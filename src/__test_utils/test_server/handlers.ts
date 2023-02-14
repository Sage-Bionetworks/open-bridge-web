import constants from '@typedefs/constants'
import {rest} from 'msw'
import AssessmentRequests from './assessmentHandlers'
import EnrollmentParticipantRequests from './enrollmentParticipantHandlers'
import ScheduleRequests from './scheduleHandlers'
import {
  default as AccountRequests,
  default as StudyRequests,
} from './studyHandlers'
const mtbAppId = constants.constants.MTB_APP_ID
const arcAppId = constants.constants.ARC_APP_ID

export const handlers = [
  ...AssessmentRequests,
  ...EnrollmentParticipantRequests,
  ...StudyRequests,
  ...AccountRequests,
  ...ScheduleRequests,

  rest.get(`*${constants.endpoints.events}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      })
    )
  }),
]
