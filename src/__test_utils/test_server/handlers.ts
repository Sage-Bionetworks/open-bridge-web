import constants from '@typedefs/constants'
import {ParticipantAccountSummary} from '@typedefs/types'
import {rest} from 'msw'
import * as assessments from '../mocks/assessments'

const mtbAppId = constants.constants.MTB_APP_ID
const arcAppId = constants.constants.ARC_APP_ID

type Search = {
  pageSize: number
  offsetBy: number
}
const getAllAccountsEndpoint = constants.endpoints.getAccountsForOrg.replace(
  ':orgId',
  'testMembership'
)
const getIndividualAccountEndpoint = constants.endpoints.bridgeAccount.replace(
  ':id',
  'testID'
)

export const handlers = [
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

  rest.post(
    `*${constants.endpoints.participantsSearch}`,
    async (req, res, ctx) => {
      const data = req.body as Search
      const expectedData = []
      for (let i = data.offsetBy + 1; i <= data.pageSize + data.offsetBy; i++) {
        let obj: ParticipantAccountSummary = {
          createdOn: '2021-02-22T20:45:38.375Z',
          externalIds: {testID: `test-id-${i}`},
          id: 'dRNO0ydUO3hAGD5rHOXx1Gmb' + i,
          status: 'unverified',
          firstName: '',
          lastName: '',
          email: '',
        }
        expectedData.push(obj)
      }
      return res(
        ctx.status(200),
        ctx.json({
          items: expectedData,
          total: 100,
        })
      )
    }
  ),
  //shared assessments
  rest.get(
    `*${constants.endpoints.assessmentsShared.split('/?')[0]}/*`,
    (req, res, ctx) => {
      console.log('REQ', req)
      return res(
        ctx.json({
          items: [assessments.SharedAssessmentsArc],
        }),
        ctx.status(200)
      )
    }
  ),

  //get local assessments
  rest.get(
    `*${constants.endpoints.assessments.split('/?')[0]}/*`,
    (req, res, ctx) => {
      return res(
        ctx.json({
          items: [...assessments.LocalAssessmentsMTB],
        }),
        ctx.status(200)
      )
    }
  ),

  rest.post(
    `*${constants.endpoints.assessment.replace(':id', '')}`,
    (req, res, ctx) => {
      return res(ctx.json(req.body), ctx.status(200))
    }
  ),

  rest.get(`*${constants.endpoints.events}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      })
    )
  }),
]
