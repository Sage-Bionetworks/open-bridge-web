import constants from '@typedefs/constants'
import {ParticipantAccountSummary} from '@typedefs/types'
import {rest} from 'msw'
import enrollment from '../mocks/enrollments.json'
import participant from '../mocks/participant.json'

type Search = {
  pageSize: number
  offsetBy: number
}

/* 
endpoints:

enrollments: '/v5/studies/:studyId/enrollments',
enrollment: '/v5/studies/:studyId/enrollments/:userId',
participantEnrollments: '/v5/studies/:studyId/participants/:userId/enrollments',
participant: '/v5/studies/:id/participants',
participantsSearch: '/v5/studies/:studyId/participants/search',
requestInfo: '/v5/studies/:studyId/participants/:userId/requestInfo',*/

const endpoints = [
  //get enrollment for participant
  rest.get(
    `*${constants.endpoints.participantEnrollments}*`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          items: [enrollment.items],
        })
      )
    }
  ),
  //get participant
  rest.get(`*${constants.endpoints.participant}/*`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(participant))
  }),

  //update enrollment
  rest.post(`*${constants.endpoints.enrollment}`, async (req, res, ctx) => {
    const data = req.body as ParticipantAccountSummary
    return res(ctx.status(200), ctx.json(JSON.stringify(data)))
  }),

  //update participant
  rest.post(`*${constants.endpoints.participant}/*`, async (req, res, ctx) => {
    const data = req.body as ParticipantAccountSummary
    return res(ctx.status(200), ctx.json(JSON.stringify(data)))
  }),

  // get enrollments for user
  rest.get(
    `*${constants.endpoints.participantEnrollments}/*`,
    async (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          items: [enrollment.items],
        })
      )
    }
  ),
]

export default endpoints
