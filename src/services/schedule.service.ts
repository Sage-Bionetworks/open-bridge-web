import {getTimePeriodFromPeriodString} from '@components/studies/scheduler/utility'
import _ from 'lodash'
import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  AssessmentWindow,
  Schedule,
  ScheduleNotification,
  ScheduleTimeline,
  SchedulingEvent,
  StudySession,
  TimePeriod,
} from '../types/scheduling'
import {Assessment} from '../types/types'
import AssessmentService from './assessment.service'
import {BURST_EVENT_PATTERN} from './event.service'

const ScheduleService = {
  createSchedule,
  getSchedule,
  getScheduleTimeline,
  saveSchedule,
  createEmptyScheduleSession,
  getEventIdsForSchedule,
  getEventIdsForScheduleByStudyId,
}

export type ExtendedScheduleEventObject = {
  eventId: string

  originEventId?: string
  interval?: TimePeriod
  delay?: TimePeriod
  studyBurstId?: string
}

export const TIMELINE_RETRIEVED_EVENT: SchedulingEvent = {
  eventId: 'timeline_retrieved',
  updateType: 'immutable',
}

export const DEFAULT_NOTIFICATION: ScheduleNotification = {
  notifyAt: 'after_window_start',
  offset: undefined,
  interval: undefined,
  messages: [
    {
      subject: 'New Activities are Live',
      message: 'Please complete',
      lang: 'en',
    },
  ],
}

function createEmptyScheduleSession(
  startEventId: string,
  symbol: string,
  name = 'Session1'
) {
  const defaultTimeWindow: AssessmentWindow = {
    startTime: '08:00',
  }
  const studySession: StudySession = {
    name,
    symbol,
    startEventIds: [startEventId],
    timeWindows: [defaultTimeWindow],
    performanceOrder: 'participant_choice',
    assessments: [],
    notifications: [{...DEFAULT_NOTIFICATION}],
  }
  return studySession
}

async function createSchedule(
  studyId: string,
  schedule: Schedule,
  token: string
): Promise<Schedule> {
  const result = await Utility.callEndpoint<Schedule>(
    constants.endpoints.schedule.replace(':studyId', studyId),
    'POST', // once we add things to the study -- we can change this to actual object
    {...schedule, guid: undefined},
    token
  )

  return result.data
}

async function saveSchedule(
  studyId: string,
  schedule: Schedule,
  token: string
): Promise<Schedule> {
  const scheduleEndpoint = constants.endpoints.schedule
  try {
    const response = await Utility.callEndpoint<Schedule>(
      scheduleEndpoint.replace(':studyId', studyId),
      'POST',
      schedule,
      token
    )

    return response.data
  } catch (error: any) {
    //we might need to retry if there is a verison mismatch
    if (error.statusCode === 409) {
      const updatedSchedule = await getSchedule(studyId, token, false)
      if (!updatedSchedule) {
        throw 'No schedule found'
      }
      return saveSchedule(
        studyId,
        {...schedule, version: updatedSchedule.version},
        token
      )
    } else {
      throw error
    }
  }
}

async function addAssessmentResourcesToSchedule(
  schedule: Schedule
): Promise<Schedule> {
  //try from storage first
  const localA = sessionStorage.getItem('AssessmentResources')

  const assessmentData = localA
    ? (JSON.parse(localA) as {assessments: Assessment[]; tags: string[]})
    : await AssessmentService.getAssessmentsWithResources()
  schedule.sessions.forEach(session => {
    const assmntWithResources = session.assessments?.map(assmnt => {
      assmnt.resources = assessmentData.assessments.find(
        a => a.guid === assmnt.guid
      )?.resources
      return assmnt
    })
    session.assessments = assmntWithResources ? [...assmntWithResources] : []
  })

  return schedule
}

//returns scehdule and sessions
async function getSchedule(
  studyId: string,
  token: string,
  addResources = true
): Promise<Schedule | undefined> {
  const schedule = await Utility.callEndpoint<Schedule>(
    constants.endpoints.schedule.replace(':studyId', studyId),
    'GET',
    {},
    token
  )
  if (!schedule) {
    return undefined
  }
  return addResources
    ? addAssessmentResourcesToSchedule(schedule.data)
    : schedule.data
}

async function getScheduleTimeline(
  studyId: string,
  token: string
): Promise<ScheduleTimeline | undefined> {
  const result = await Utility.callEndpoint<any>(
    constants.endpoints.scheduleTimeline.replace(':studyId', studyId),
    'GET',
    {},
    token
  )
  return result.data
}

function getEventsForSchedule(
  schedule: Schedule
): ExtendedScheduleEventObject[] {
  const sessions = schedule.sessions.filter(
    session => !_.isEmpty(session.startEventIds)
  )
  if (!sessions) {
    return []
  }

  const events = sessions.reduce(
    (p: ExtendedScheduleEventObject[], c: StudySession) => {
      var eventId = c.startEventIds?.[0]
      var studyBurstId = c.studyBurstIds ? _.first(c.studyBurstIds) : undefined
      //if we already have this event
      var event = {
        eventId,
        delay: c.delay ? getTimePeriodFromPeriodString(c.delay) : undefined,
        studyBurstId,
      }
      const eventIndex = p.findIndex(e => e.eventId === eventId)
      // if event already exists
      if (eventIndex > -1) {
        //if it's a burst -- replace non-burst otherwise ignore
        if (studyBurstId) {
          p[eventIndex] = event
        }
        return p

        //else replace it with the burst event
      } else {
        return [...p, event]
      }
    },
    [] as {eventId: string; delay: TimePeriod}[]
  )
  return events
}

function getEventIdsForSchedule(schedule: Schedule): string[] {
  const eventIds = getEventsForSchedule(schedule).map(e => e.eventId)

  return _.uniq(eventIds)
}

async function getEventIdsForScheduleByStudyId(
  studyId: string,
  token: string,
  onlyCustom = true,
  withBursts = false
): Promise<ExtendedScheduleEventObject[]> {
  // get schedule
  const schedule = await getSchedule(studyId, token, false)
  if (!schedule) {
    throw Error('Schedule not found')
  }
  // get events from Sessions
  const events = getEventsForSchedule(schedule)

  var burst = schedule.studyBursts?.[0]

  var result = events.reduce((res, current) => {
    //custom events
    const isEventCustom = current.eventId !== TIMELINE_RETRIEVED_EVENT.eventId
    //if we are ignoring the timeline events -- don't add it
    if (!isEventCustom && onlyCustom) {
      return res
    } else {
      // create and add non-burst event
      var nontBurstEvent: ExtendedScheduleEventObject = {
        eventId: current.eventId,
        delay: current.delay,
      }

      var res = [...res, nontBurstEvent]

      // if we are getting burst events -- add them as well
      if (
        withBursts &&
        burst?.identifier &&
        burst.identifier === current.studyBurstId
      ) {
        for (let i = 1; i <= burst.occurrences; i++) {
          //generate burst name
          var eventId = BURST_EVENT_PATTERN.replace(
            '[0-9]+',
            i < 10 ? '0' + i : '' + i
          ).replace('[burst_id]', burst.identifier)
          res.push({
            eventId,
            originEventId: current.eventId,
            delay: current.delay,
            interval: getTimePeriodFromPeriodString(burst.interval),
          })
        }
      }

      return res
    }
  }, [] as ExtendedScheduleEventObject[])

  return result
}

export default ScheduleService
