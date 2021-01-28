import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { OrgUser, UserData } from '../types/types'

const AccessService = {
  createAccount,
  getAliasFromSynapseByEmail,
  getAccountsForOrg,
  getIndividualAccount
}

async function getAliasFromSynapseByEmail(
  synapseEmailAddress: string,
): Promise<any> {
  if (
    synapseEmailAddress.indexOf('@synapse.org') === -1 &&
    synapseEmailAddress.indexOf('@synapse.org') > -1
  ) {
    return Promise.reject({ message: 'the email should be ...@synapse.org' })
  }

  const alias = synapseEmailAddress.replace('@synapse.org', '').trim()

  const response1 = await callEndpoint<{ principalId: string }>(
    constants.endpoints.synapseGetAlias,
    'POST',
    { alias: alias, type: 'USER_NAME' },
    undefined,
    true,
  )

  const response2 = await callEndpoint<{
    userProfile: {
      // userId: string
      firstName: string
      lastName: string
      //ownerId: string
    }
  }>(
    constants.endpoints.synapseGetUserProfile.replace(
      ':id',
      response1.data.principalId,
    ),
    'GET',
    { MASK: 0x1 },
    undefined,
    true,
  )

  return {
    principalId: response1.data.principalId,
    firstName: response2.data.userProfile.firstName,
    lastName: response2.data.userProfile.lastName,
  }
  //return json.principalId
}

async function getAccountsForOrg(
  token: string,

  orgId: string,
): Promise<UserData[]> {
  console.log('GETTING ACCOUNTS')
  const endpoint = constants.endpoints.getAccountsForOrg.replace(
    ':orgId',
    orgId,
  )
  const result = await callEndpoint<{items: OrgUser[]}>(endpoint, 'POST', {}, token)

  return result.data.items
}


async function getIndividualAccount(
  token: string,

  userId: string,
): Promise<OrgUser> {

  const endpoint = `${constants.endpoints.bridgeAccount}/${userId}`
  const result = await callEndpoint<OrgUser>(endpoint, 'GET', {}, token)

  return result.data
}

async function createAccount(
  token: string,
  email: string,
  synapseUserId: string,
  firstName: string,
  lastName: string,
  orgMembership: string,
  role: string,
): Promise<any> {
  const postData = {
    appId: constants.constants.APP_ID,
    email,
    synapseUserId,
    dataGroups: ['test_user'],
    firstName,
    lastName,
    orgMembership,
    roles: [role],
  }
  const result = await callEndpoint<any>(
    constants.endpoints.bridgeAccount,
    'POST',
    postData,
    token,
  )

  return result.ok
}

export default AccessService
