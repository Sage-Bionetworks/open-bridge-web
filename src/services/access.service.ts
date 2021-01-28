import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'

const AccessService = {
  createAccount,
  getAliasFromSynapseByEmail,
  getAccountsForOrg,
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
): Promise<any> {
  console.log('GETTING ACCOUNTS')
  const endpoint = constants.endpoints.getAccountsForOrg.replace(
    ':orgId',
    orgId,
  )
  const result = await callEndpoint<any>(endpoint, 'POST', {}, token)

  return result.data.items
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
    constants.endpoints.accountCreate,
    'POST',
    postData,
    token,
  )

  return result.ok
}

export default AccessService
