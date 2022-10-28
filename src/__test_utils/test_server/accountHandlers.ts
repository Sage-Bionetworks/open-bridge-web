import constants from '@typedefs/constants'
import {rest} from 'msw'

const getAllAccountsEndpoint = constants.endpoints.getAccountsForOrg.replace(
  ':orgId',
  'testMembership'
)
const getIndividualAccountEndpoint = constants.endpoints.bridgeAccount.replace(
  ':id',
  'testID'
)

const endpoints = [
  rest.post(`*${getAllAccountsEndpoint}`, async (req, res, ctx) => {
    const data = [
      {
        firstName: 'John',
        lastName: 'Roberts',
        id: 'testID',
      },
    ]
    return res(
      ctx.status(200),
      ctx.json({
        items: data,
      })
    )
  }),

  rest.get(`*${getIndividualAccountEndpoint}`, async (req, res, ctx) => {
    const data = {
      status: 'org_admin',
      email: 'test@testing@synapse.org',
      synapseUserId: '12345678',
      roles: ['org_admin'],
      firstName: 'John',
      lastName: 'Roberts',
    }
    return res(ctx.status(200), ctx.json(data))
  }),
]

export default endpoints
