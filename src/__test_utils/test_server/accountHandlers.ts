import {IdentifierHolder} from '@services/access.service'
import constants from '@typedefs/constants'
import {LoggedInUserData, UserData, UserSessionData} from '@typedefs/types'
import {rest} from 'msw'

const getAllAccountsEndpoint = constants.endpoints.getAccountsForOrg.replace(':orgId', 'testMembership')
const postIndividualAccountsEndpoint = constants.endpoints.bridgeAccount.replace(':id', '')
const getIndividualAccountEndpoint = postIndividualAccountsEndpoint.replace(':id', 'testID')

const orgAdminUser: UserData = {
  orgMembership: 'testMembership',
  roles: ['org_admin'],
  id: 'testID',
  dataGroups: [],
  synapseUserId: '12345678',
}
export const orgAdminSession: UserSessionData = {
  ...orgAdminUser,
  token: 'testing-token',
  appId: constants.constants.OPEN_BRIDGE_APP_ID,
}
const orgAdminLoggedIn: LoggedInUserData = {
  ...orgAdminUser,
  sessionToken: 'test-session-token',
  firstName: 'FirstTest',
  lastName: 'LastTest',
  email: 'test.testing@synapse.org',
}

export const testUserId = 'U6tVUQfQr2GYDROdeTNLa6LB'

const endpoints = [
  rest.post(`*${getAllAccountsEndpoint}`, async (req, res, ctx) => {
    const data = [orgAdminLoggedIn]
    return res(
      ctx.status(200),
      ctx.json({
        items: data,
      })
    )
  }),

  rest.get(`*${getIndividualAccountEndpoint}`, async (req, res, ctx) => {
    const data = orgAdminLoggedIn
    return res(ctx.status(200), ctx.json(data))
  }),

  rest.post(`*${postIndividualAccountsEndpoint}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        identifier: testUserId,
        type: 'IdentifierHolder',
      } as IdentifierHolder)
    )
  }),
]

export default endpoints
