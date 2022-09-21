import constants from '@typedefs/constants'
import {ParticipantAccountSummary} from '@typedefs/types'
import {rest} from 'msw'
import * as assessments from '../mocks/assessments'

type Search = {
  pageSize: number
  offsetBy: number
}

/*enrollments: '/v5/studies/:studyId/enrollments',
enrollmentsForUser: '/v5/studies/:studyId/participants/:userId/enrollments',
participant: '/v5/studies/:id/participants',
participantsSearch: '/v5/studies/:studyId/participants/search',
requestInfo: '/v5/studies/:studyId/participants/:userId/requestInfo',*/

const endpoints = [
  //shared assessments
  rest.get(
    `*${constants.endpoints.enrollments.replace(':studyId', '123')}*`,
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
  //post for for user enrollments
  rest.post(
    `*${constants.endpoints.enrollmentsForUser
      .replace(':studyId', '123')
      .replace(':userId', '123')}*`,
    (req, res, ctx) => {
      return res(ctx.json(req.body), ctx.status(200))
    }
  ),

  //generate rest request for  '/v5/studies/:studyId/enrollments',
  rest.post(`*${constants.endpoints.enrollments}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      })
    )
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
]

export default endpoints
