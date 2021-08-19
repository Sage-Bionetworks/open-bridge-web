import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  AssessmentWindow,
  Schedule,
  ScheduleNotification,
  SchedulingEvent,
  StartEventId,
  StudySession,
} from '../types/scheduling'
import {FileRevision, Study} from '../types/types'
import AssessmentService from './assessment.service'

const StudyService = {
  editStudyLogo,
  getStudies,
  getStudy,
  createStudy,
  launchStudy,
  removeStudy,
  updateStudy,
  createStudySchedule,
  getStudySchedule,
  getStudyScheduleTimeline,
  saveStudySchedule,
  createEmptyStudySession,
  getEventsForSchedule,
}

export const TIMELINE_RETRIEVED_EVENT: SchedulingEvent = {
  identifier: 'timeline_retrieved',
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

function createEmptyStudySession(
  startEventId: StartEventId,
  name = 'Session1'
) {
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

async function editStudyLogo(
  studyId: string,
  token: string,
  fileSize: number,
  fileName: string,
  fileBody: string,
  mimeType: string,
  file: File
): Promise<Study> {
  try {
    // upload to the backend
    const uploadToBackendEndpoint = `${constants.endpoints.studies}/${studyId}/logo`
    const bodyForUploadBackendEndpoint: FileRevision = {
      name: fileName,
      mimeType: mimeType,
      size: fileSize,
      fileGuid: fileBody,
    }
    const uploadResult = await Utility.callEndpoint<FileRevision>(
      uploadToBackendEndpoint,
      'POST',
      bodyForUploadBackendEndpoint,
      token
    )
    const uploadData = uploadResult.data
    // upload to aws
    let headers: HeadersInit = new Headers()
    headers.set('Content-Type', mimeType)
    headers.set('Content-Disposition', 'inline')
    const config = {
      method: 'PUT',
      headers,
      body: file,
    }
    const uploadURL = uploadData.uploadURL!
    await fetch(uploadURL, config)
    // Tell the backend that we have successfully finished uploading file to aws
    const successfulUploadEndpoint = `${constants.endpoints.studies}/${studyId}/logo/${uploadData.createdOn}`
    const successfulUploadResponse = await Utility.callEndpoint<Study>(
      successfulUploadEndpoint,
      'POST',
      {},
      token
    )
    return successfulUploadResponse.data
  } catch (error) {
    throw error
  }
}

async function getStudies(token: string): Promise<Study[]> {
  const studies = await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studies,
    'GET',
    {},
    token
  )

  return studies.data.items
}

async function getStudy(id: string, token: string): Promise<Study | undefined> {
  const response = await Utility.callEndpoint<Study>(
    constants.endpoints.study.replace(':id', id),
    'GET',
    {},
    token
  )
  const study = response.data
  if (!study.clientData) {
    study.clientData = {}
  }
  return study
}

async function createStudy(study: Study, token: string): Promise<number> {
  const newVersion = await Utility.callEndpoint<{version: number}>(
    constants.endpoints.study.replace(':id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    study,
    token
  )

  return newVersion.data.version
}

async function createStudySchedule(
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

async function updateStudy(study: Study, token: string): Promise<number> {
  try {
    const result = await Utility.callEndpoint<{version: number}>(
      constants.endpoints.study.replace(':id', study.identifier),
      'POST',
      study,
      token
    )
    return result.data.version
  } catch (error) {
    //we might need to retry if there is a verison mismatch
    if (error.statusCode === 409) {
      console.log('409')
      const updatedStudy = await getStudy(study.identifier, token)
      if (!updatedStudy) {
        throw 'No study'
      }
      study.version = updatedStudy.version
      return updateStudy(study, token)
    } else {
      throw error
    }
  }
}

async function removeStudy(studyId: string, token: string): Promise<Study[]> {
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.study.replace(':id', studyId),
    'DELETE',
    {},
    token
  )
  const data = await getStudies(token)
  return data
}

async function launchStudy(studyId: string, token: string): Promise<Study> {
  await Utility.callEndpoint<{items: Study[]}>(
    constants.endpoints.studyLaunch.replace(':id', studyId),
    'POST',
    {},
    token
  )
  const data = await getStudy(studyId, token)
  if (!data) {
    throw Error('No study found')
  }
  return data
}

async function saveStudySchedule(
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
      const updatedSchedule = await getStudySchedule(studyId, token, false)
      if (!updatedSchedule) {
        throw 'No schedule found'
      }
      return saveStudySchedule(
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
  const assessmentData = await AssessmentService.getAssessmentsWithResources()
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
async function getStudySchedule(
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

async function getStudyScheduleTimeline(
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
  studyId: string
): Promise<SchedulingEvent[]> {
  const token = Utility.getSession()?.token
  const response = await Utility.callEndpoint<Study>(
    constants.endpoints.study.replace(':id', studyId),
    'GET',
    {},
    token
  )

  return (
    response.data.clientData?.events?.map(e => ({
      ...e,
      identifier: e.identifier.includes(constants.constants.CUSTOM_EVENT_PREFIX)
        ? e.identifier
        : constants.constants.CUSTOM_EVENT_PREFIX + e.identifier,
    })) || []
  )
}

export default StudyService
