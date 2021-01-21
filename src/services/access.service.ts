import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'

const AccessService = {
  createAccount,
  getAliasFromSynapseByEmail,
  getAccountsForOrg
}

async function getAliasFromSynapseByEmail(
  synapseEmailAddress: string,
): Promise<any> {
  const alias = synapseEmailAddress.replace('@synapse.org', '').trim()
  if (/^\d+$/.test(alias)) {
    return Promise.resolve(alias)
  }
  const result = await fetch(
    'https://repo-prod.prod.sagebase.org/repo/v1/principal/alias',
    {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ alias: alias, type: 'USER_NAME' }),
    },
  )
  const json = await result.json()
  return json.principalId
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
  orgMembership: string,
  role: string = 'developer',
): Promise<any> {
  const postData = {
    appId: constants.constants.APP_ID,
    email,
    synapseUserId,
    dataGroups: ['test_user'],
    orgMembership,
    roles: [role],
  }
  const e = constants.endpoints.accountCreate
  const result = await callEndpoint<any>(e, 'POST', postData, token)

  return result.ok
}

export default  AccessService
