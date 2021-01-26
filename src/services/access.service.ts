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
  const alias = synapseEmailAddress.replace('@synapse.org', '').trim()
  if (/^\d+$/.test(alias)) {
    return Promise.resolve(alias)
  }

  const response1 = await callEndpoint<{ principalId: string }>(
    '/repo/v1/principal/alias',
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
    '/repo/v1/user/' + response1.data.principalId + '/bundle',
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
  const e = constants.endpoints.getAccountsForOrg.replace('{orgId}', orgId)
  const result = await callEndpoint<any>(e, 'POST', {}, token)

  return result.data.items
}

async function createAccount(
  token: string,
  email: string,
  synapseUserId: string,
  firstName: string,
  lastName: string,
  orgMembership: string,
  role: string = 'developer',
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
  const e = constants.endpoints.accountCreate
  const result = await callEndpoint<any>(e, 'POST', postData, token)

  return result.ok
}

export default AccessService
