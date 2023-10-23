import constants from '@typedefs/constants'
import {rest} from 'msw'
import AdherenceAlertsHandlers from './adherenceAlertsHandlers'
import AssessmentRequests from './assessmentHandlers'
import EnrollmentParticipantRequests from './enrollmentParticipantHandlers'
import ScheduleRequests from './scheduleHandlers'
import {default as AccountRequests, default as StudyRequests} from './studyHandlers'
import UserHandlers from './userHandlers'

export const handlers = [
  ...AssessmentRequests,
  ...EnrollmentParticipantRequests,
  ...StudyRequests,
  ...AccountRequests,
  ...ScheduleRequests,
  ...AdherenceAlertsHandlers,
  ...UserHandlers,

  rest.get(`*${constants.endpoints.events}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      })
    )
  }),
]
