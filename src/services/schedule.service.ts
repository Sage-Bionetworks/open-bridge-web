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
  StudyBurst,
  StudySession,
  TimelineScheduleItem,
  TimePeriod,
} from '../types/scheduling'
import AssessmentService from './assessment.service'
import EventService, {
  BURST_EVENT_PATTERN,
  JOINED_EVENT_ID,
} from './event.service'
import StudyService from './study.service'

const ScheduleService = {
  createSchedule,
  createEmptyScheduleSession,
  getEventsForTimeline,
  getAllEventsForTimelineByStudyId,
  getSchedule,
  getTimeline,
  saveSchedule,
  getStudyBurst,
}

export type ExtendedScheduleEventObject = {
  eventId: string

  originEventId?: string
  interval?: TimePeriod
  delay?: TimePeriod
  studyBurstId?: string
}

export const TIMELINE_RETRIEVED_EVENT: SchedulingEvent = {
  eventId: JOINED_EVENT_ID,
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

function getStudyBurst(
  schedule?: Schedule | ScheduleTimeline
): StudyBurst | undefined {
  return !schedule?.studyBursts || schedule.studyBursts.length === 0
    ? undefined
    : schedule.studyBursts[0]
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
  appId: string,
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
      const updatedSchedule = await getSchedule(studyId, appId, token, false)
      if (!updatedSchedule) {
        throw new Error('No schedule found')
      }
      return saveSchedule(
        studyId,
        appId,
        {...schedule, version: updatedSchedule.version},
        token
      )
    } else {
      throw error
    }
  }
}

async function addAssessmentResourcesToSchedule(
  appId: string,
  token: string,
  schedule: Schedule
): Promise<Schedule> {
  //agendel: get fresh -- don't use local storage
  const assessmentData = await AssessmentService.getAssessmentsWithResources(
    appId,
    token
  )
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
  appId: string,
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
  const result = addResources
    ? await addAssessmentResourcesToSchedule(appId, token, schedule.data)
    : schedule.data
  return result
}

async function getTimeline(
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

function getEventsForTimeline(
  {schedule, studyBursts}: ScheduleTimeline,
  sortedCustomEventIds?: string[]
): ExtendedScheduleEventObject[] {
  //get startEventIds from Sessions

  const burst = !_.isEmpty(studyBursts) ? studyBursts[0] : undefined

  const events = schedule.reduce(
    (p: ExtendedScheduleEventObject[], i: TimelineScheduleItem) => {
      var isBurstEvent = i.studyBurstNum !== undefined
      var eventId = isBurstEvent ? burst!.originEventId : i.startEventId

      var event = {
        eventId,
        studyBurstId: isBurstEvent ? burst?.identifier : undefined,
      }
      //check if we already have this event
      const eventIndex = p.findIndex(e => e.eventId === eventId)
      // add event if it doesn't exist or would replace non-burst event
      if (eventIndex === -1) {
        return [...p, event]
      } else {
        if (!p[eventIndex].studyBurstId && event.studyBurstId) {
          p[eventIndex] = event
        }
        return p
      }
    },
    [] as {eventId: string; delay: TimePeriod}[]
  )

  if (!sortedCustomEventIds) {
    return events
  }
  const prefixedStudyEvents = sortedCustomEventIds.map(e =>
    EventService.prefixCustomEventIdentifier(e)
  )
  const result = events.sort((a, b) => {
    return prefixedStudyEvents.indexOf(a.eventId) >
      prefixedStudyEvents.indexOf(b.eventId)
      ? 1
      : -1
  })
  return result
}

//this includes burst events
async function getAllEventsForTimelineByStudyId(
  studyId: string,
  token: string
): Promise<ExtendedScheduleEventObject[]> {
  // get schedule
  const study = await StudyService.getStudy(studyId, token)
  const timeline = await getTimeline(studyId, token)
  if (!timeline) {
    throw Error('Schedule not found')
  }
  // get events from Sessions
  const events = getEventsForTimeline(
    timeline,
    study?.customEvents?.map(e => e.eventId)
  )

  var burst = getStudyBurst(timeline)

  var result = events.reduce((res, current) => {
    // var res = [...res]

    // create and add non-burst event
    var nontBurstEvent: ExtendedScheduleEventObject = {
      eventId: current.eventId,
      delay: current.delay,
    }

    res.push(nontBurstEvent)

    // if we are getting burst events -- add it and create the events for an actual burst
    if (burst?.identifier && burst.identifier === current.studyBurstId) {
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
  }, [] as ExtendedScheduleEventObject[])

  return result
}

export default ScheduleService
