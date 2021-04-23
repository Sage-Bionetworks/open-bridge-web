import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import {
  AssessmentWindow,
  Schedule,
  StartEventId,
  StudySession,
} from '../types/scheduling'
import { Study } from '../types/types'
import AssessmentService from './assessment.service'

const StudyService = {
  getStudies,
  getStudy,
  createStudy,
  removeStudy,
  updateStudy,
  createStudySchedule,
  createNewStudySchedule,
  getStudySchedule,
  saveStudySchedule,
  createEmptyStudySession,
}

function createEmptyStudySession(
  startEventId: StartEventId,
  name = 'Session1',
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
  }
  return studySession
}

async function getStudies(token: string): Promise<Study[]> {
  const studies = await callEndpoint<{ items: Study[] }>(
    constants.endpoints.studies,
    'GET',
    {},
    token,
  )
  //alina: this is temporary until we get status returned from back end

  return studies.data.items.map(study =>
    study.status ? study : { ...study, status: 'DRAFT' },
  )
}

async function getStudy(id: string, token: string): Promise<Study | undefined> {
  const response = await callEndpoint<Study>(
    constants.endpoints.study.replace(':id', id),
    'GET',
    {},
    token,
  )
  const study = response.data
  if (!study.clientData) {
    study.clientData = {}
  }
  return study
}

async function createStudy(study: Study, token: string): Promise<Study[]> {
  await callEndpoint<{ items: Study[] }>(
    constants.endpoints.study.replace(':id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    study,
    token,
  )

  const data = await getStudies(token)
  return data
}

async function createStudySchedule(
  name: string,

  token: string,
): Promise<string> {
  const result = await callEndpoint<string>(
    constants.endpoints.schedule.replace('/:id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    { name },
    token,
  )
  return result.data
}

async function createNewStudySchedule(
  schedule: Schedule,

  token: string,
): Promise<Schedule> {
  const result = await callEndpoint<Schedule>(
    constants.endpoints.schedule.replace('/:id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    { ...schedule, guid: undefined },
    token,
  )

  return result.data
}

async function updateStudy(study: Study, token: string): Promise<number> {
  const result = await callEndpoint<{ version: number }>(
    constants.endpoints.study.replace(':id', study.identifier),
    'POST', // once we add things to the study -- we can change this to actual object
    //  { identifier: study.identifier, version: study.version, name: study.name },
    study,
    token,
  )
  return result.data.version
}

async function removeStudy(studyId: string, token: string): Promise<Study[]> {
  await callEndpoint<{ items: Study[] }>(
    constants.endpoints.study.replace(':id', studyId),
    'DELETE',
    {},
    token,
  )
  const data = await getStudies(token)
  return data
}

async function saveStudySchedule(
  schedule: Schedule,
  token: string,
): Promise<Schedule> {
  const scheduleEndpoint = constants.endpoints.schedule
  try {
    const response = await callEndpoint<Schedule>(
      scheduleEndpoint.replace(':id', schedule.guid),
      'POST',
      schedule,
      token,
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
        token,
      )
      return response.data
    } else {
      throw error
    }
  }
}

async function addAssessmentResourcesToSchedule(
  schedule: Schedule,
): Promise<Schedule> {
  const assessmentData = await AssessmentService.getAssessmentsWithResources()
  schedule.sessions.forEach(session => {
    const assmntWithResources = session.assessments?.map(assmnt => {
      assmnt.resources = assessmentData.assessments.find(
        a => a.guid === assmnt.guid,
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
  token: string,
): Promise<Schedule | undefined> {
  const schedule = await callEndpoint<Schedule>(
    constants.endpoints.schedule.replace(':id', scheduleId),
    'GET',
    {},
    token,
  )

  return schedule ? addAssessmentResourcesToSchedule(schedule.data) : undefined
}

export default StudyService
