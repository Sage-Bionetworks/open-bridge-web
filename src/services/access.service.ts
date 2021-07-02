import {callEndpoint} from '../helpers/utility'
import constants from '../types/constants'
import {OrgUser, UserData} from '../types/types'

const AccessService = {
  createIndividualAccount,
  deleteIndividualAccount,
  getAliasFromSynapseByEmail,
  getAccountsForOrg,
  getDetailedAccountsForOrg,
  getIndividualAccount,
  updateIndividualAccountRoles,
}

async function getAliasFromSynapseByEmail(
  synapseEmailAddress: string
): Promise<any> {
  if (
    synapseEmailAddress.indexOf('@synapse.org') === -1 &&
    synapseEmailAddress.indexOf('@synapse.org') > -1
  ) {
    return Promise.reject({message: 'the email should be ...@synapse.org'})
  }

  const alias = synapseEmailAddress.replace('@synapse.org', '').trim()
  const principal = await callEndpoint<{principalId: string}>(
    constants.endpoints.synapseGetAlias,
    'POST',
    {alias: alias, type: 'USER_NAME'},
    undefined,
    true
  )

  const profile = await callEndpoint<{
    userProfile: {
      firstName: string
      lastName: string
    }
  }>(
    constants.endpoints.synapseGetUserProfile.replace(
      ':id',
      principal.data.principalId
    ),
    'GET',
    {MASK: 0x1},
    undefined,
    true
  )

  return {
    principalId: principal.data.principalId,
    firstName: profile.data.userProfile.firstName,
    lastName: profile.data.userProfile.lastName,
  }
}

async function getAccountsForOrg(
  token: string,
  orgId: string
): Promise<UserData[]> {
  const endpoint = constants.endpoints.getAccountsForOrg.replace(
    ':orgId',
    orgId
  )
  const result = await callEndpoint<{items: OrgUser[]}>(
    endpoint,
    'POST',
    {},
    token
  )

  return result.data.items
}

async function getIndividualAccount(
  token: string,
  userId: string
): Promise<OrgUser> {
  const endpoint = constants.endpoints.bridgeAccount.replace(':id', userId)
  const result = await callEndpoint<OrgUser>(endpoint, 'GET', {}, token)
  return result.data
}

async function getDetailedAccountsForOrg(
  token: string,
  orgId: string
): Promise<OrgUser[]> {
  const accounts = await AccessService.getAccountsForOrg(token!, orgId)
  const promises = accounts.map(async account => {
    return await AccessService.getIndividualAccount(token!, account.id)
  })
  const result = await Promise.all(promises)
  return result
}

async function deleteIndividualAccount(
  token: string,
  userId: string
): Promise<OrgUser> {
  const endpoint = constants.endpoints.bridgeAccount.replace(':id', userId)
  const result = await callEndpoint<OrgUser>(endpoint, 'DELETE', {}, token)
  return result.data
}

async function createIndividualAccount(
  token: string,
  email: string,
  synapseUserId: string,
  firstName: string,
  lastName: string,
  orgMembership: string,
  role: string
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
  const endpoint = constants.endpoints.bridgeAccount.replace(':id', '')
  const result = await callEndpoint<any>(endpoint, 'POST', postData, token)

  return result.ok
}

async function updateIndividualAccountRoles(
  token: string,
  userId: string,
  roles: string[]
): Promise<any> {
  const endpoint = constants.endpoints.bridgeAccount.replace(':id', userId)
  const userResponse = await callEndpoint<OrgUser>(endpoint, 'GET', {}, token)
  const data = userResponse.data
  const updatedUser = {...data, roles}
  const result = await callEndpoint<any>(endpoint, 'POST', updatedUser, token)
  return result.data
}

export default AccessService
