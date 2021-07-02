import {callEndpoint} from '../helpers/utility'
import constants from '../types/constants'
import {
  AssessmentWindow,
  Schedule,
  ScheduleNotification,
  StartEventId,
  StudySession,
} from '../types/scheduling'
import {Study, FileRevision} from '../types/types'
import AssessmentService from './assessment.service'

const StudyService = {
  editStudyLogo,
  getStudies,
  getStudy,
  createStudy,
  removeStudy,
  updateStudy,
  createStudySchedule,
  createNewStudySchedule,
  getStudySchedule,
  getStudyScheduleTimeline,
  saveStudySchedule,
  createEmptyStudySession,
}

export const DEFAULT_NOTIFICATION: ScheduleNotification = {
  notifyAt: 'after_window_start',
  offset: undefined,
  interval: undefined,
  allowSnooze: true,
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
    const uploadResult = await callEndpoint<FileRevision>(
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
    const successfulUploadResponse = await callEndpoint<Study>(
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
  const studies = await callEndpoint<{items: Study[]}>(
    constants.endpoints.studies,
    'GET',
    {},
    token
  )

  return studies.data.items
}

async function getStudy(id: string, token: string): Promise<Study | undefined> {
  const response = await callEndpoint<Study>(
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
  const newVersion = await callEndpoint<{version: number}>(
    constants.endpoints.study.replace(':id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    study,
    token
  )

  return newVersion.data.version
}

async function createStudySchedule(
  name: string,

  token: string
): Promise<string> {
  const result = await callEndpoint<string>(
    constants.endpoints.schedule.replace('/:id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    {name},
    token
  )
  return result.data
}

async function createNewStudySchedule(
  schedule: Schedule,

  token: string
): Promise<Schedule> {
  const result = await callEndpoint<Schedule>(
    constants.endpoints.schedule.replace('/:id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    {...schedule, guid: undefined},
    token
  )

  return result.data
}

async function updateStudy(study: Study, token: string): Promise<number> {
  const result = await callEndpoint<{version: number}>(
    constants.endpoints.study.replace(':id', study.identifier),
    'POST',
    study,
    token
  )
  return result.data.version
}

async function removeStudy(studyId: string, token: string): Promise<Study[]> {
  await callEndpoint<{items: Study[]}>(
    constants.endpoints.study.replace(':id', studyId),
    'DELETE',
    {},
    token
  )
  const data = await getStudies(token)
  return data
}

async function saveStudySchedule(
  schedule: Schedule,
  token: string
): Promise<Schedule> {
  const scheduleEndpoint = constants.endpoints.schedule
  try {
    const response = await callEndpoint<Schedule>(
      scheduleEndpoint.replace(':id', schedule.guid),
      'POST',
      schedule,
      token
    )
    return response.data
  } catch (error) {
    //we might need to retry if there is a verison mismatch
    if (error.statusCode == 409) {
      const endPoint = scheduleEndpoint.replace(':id', schedule.guid)
      const sched = await callEndpoint<Schedule>(endPoint, 'GET', {}, token)
      schedule.version = sched.data.version
      const response = await callEndpoint<Schedule>(
        scheduleEndpoint.replace(':id', schedule.guid),
        'POST',
        schedule,
        token
      )
      return response.data
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
  scheduleId: string,
  token: string
): Promise<Schedule | undefined> {
  const schedule = await callEndpoint<Schedule>(
    constants.endpoints.schedule.replace(':id', scheduleId),
    'GET',
    {},
    token
  )
  return schedule ? addAssessmentResourcesToSchedule(schedule.data) : undefined
}

async function getStudyScheduleTimeline(
  scheduleId: string,
  token: string
): Promise<any | undefined> {
  const result = await callEndpoint<any>(
    constants.endpoints.scheduleTimeline.replace(':id', scheduleId),
    'GET',
    {},
    token
  )
  return result.data
}

export default StudyService
