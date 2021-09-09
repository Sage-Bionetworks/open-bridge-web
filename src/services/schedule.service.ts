import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  AssessmentWindow,
  Schedule,
  ScheduleNotification,
  SchedulingEvent,
  StudySession,
} from '../types/scheduling'
import {Assessment, Study} from '../types/types'
import AssessmentService from './assessment.service'

const ScheduleService = {
  createSchedule,
  getSchedule,
  getScheduleTimeline,
  saveSchedule,
  createEmptyScheduleSession,
  getEventsForSchedule,
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

function createEmptyScheduleSession(startEventId: string, name = 'Session1') {
  const defaultTimeWindow: AssessmentWindow = {
    startTime: '08:00',
  }
  const studySession: StudySession = {
    name: name,
    startEventId,
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
  } catch (error) {
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
): Promise<any | undefined> {
  const result = await Utility.callEndpoint<any>(
    constants.endpoints.scheduleTimeline.replace(':studyId', studyId),
    'GET',
    {},
    token
  )
  return result.data
}

async function getEventsForSchedule(
  studyId: string,
  token: string
): Promise<SchedulingEvent[]> {
  const response = await Utility.callEndpoint<Study>(
    constants.endpoints.study.replace(':id', studyId),
    'GET',
    {},
    token
  )

  return (
    response.data.customEvents?.map(e => ({
      ...e,
      identifier: e.eventId.includes(constants.constants.CUSTOM_EVENT_PREFIX)
        ? e.eventId
        : constants.constants.CUSTOM_EVENT_PREFIX + e.eventId,
    })) || []
  )
}

export default ScheduleService
