import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { Schedule, StudyDuration, StudySession } from '../types/scheduling'
import { Study } from '../types/types'

const StudyService = {
  getStudies,
  getStudy,
  updateStudy,
  createStudy,
  removeStudy,
  getStudySessions,
  saveStudySessions,
  getStudySchedule,
  saveStudySchedule,
}

async function getStudies(token: string): Promise<Study[]> {
  const studies = await callEndpoint<{ items: Study[] }>(
    constants.endpoints.studies,
    'GET',
    {},
    token,
  )
 //alina: this is temporary until we get status returned from back end

  return studies.data.items.map(study=> (study.status? study : {...study, status: 'DRAFT'} ))
}

async function getStudy(id: string, token: string): Promise<Study | undefined> {
  const study = await callEndpoint<{ data: Study }>(
    constants.endpoints.study.replace(':id', id),
    'GET',
    {},
    token,
  )
  return study.data.data
}

/*async function getAllSchedules(): Promise<Schedule[] | null> {
  let s = await getItem<Schedule[]>(KEYS.SCHEDULES)
  if (!s) {
    const mocks = MOCKS.SCHEDULE
    //@ts-ignore
    s = await setItem(KEYS.SCHEDULES, [mocks])
  }

  return s
}*/

async function getStudySessions(
  studyId: string,
  token: string,
): Promise<StudySession[] | undefined> {
  const studySessions = await callEndpoint<{ items: StudySession[] }>(
    constants.endpoints.scheduleSessions.replace(':id', studyId),
    'GET',
    {},
    token,
  )
  return studySessions.data.items
}

async function createStudy(study: Study, token: string): Promise<Study[]> {
  await callEndpoint<{ items: Study[] }>(
    constants.endpoints.study.replace(':id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    { identifier: study.identifier, version: study.version, name: study.name },
    token,
  )
  debugger
  const data = await getStudies(token)
  return data
}

async function updateStudy(study: Study, token: string): Promise<Study[]> {
 const result =  await callEndpoint<{ items: Study[] }>(
    constants.endpoints.study.replace(':id', study.identifier),
    'POST',// once we add things to the study -- we can change this to actual object
    { identifier: study.identifier, version: study.version, name: study.name },
    //study,
    token,
  )
  debugger
  const data = await getStudies(token)
  return data
}

async function removeStudy(studyId: string, token: string): Promise<Study[]> {
  const { data } = await callEndpoint<{ items: Study[] }>(
    constants.endpoints.study.replace(':id', studyId),
    'DELETE',
    {},
    token,
  )
  return data.items
}

async function saveStudySchedule(
  studyId: string,
  schedule: Schedule,
  duration: StudyDuration,
  token: string,
): Promise<void> {
  const study = await getStudy(studyId, token)
  if (!study) {
    return Promise.reject('no study')
  }
  study.studyDuration = duration

  //save study
  await updateStudy(study, token)

  //save sessions
  const studySessions = await callEndpoint<any>(
    constants.endpoints.scheduleSessions.replace(':id', studyId),
    'POST',
    schedule.sessions,
    token,
  )

  //save schedule
  const sched = await callEndpoint<any>(
    constants.endpoints.schedule.replace(':id', studyId),
    'POST',
    schedule,
    token,
  )
  console.log(studySessions, sched)

  return
}

async function saveStudySessions(
  studyId: string,
  sessions: StudySession[],
  token: string,
): Promise<StudySession[]> {
  const { data } = await callEndpoint<{ items: StudySession[] }>(
    constants.endpoints.scheduleSessions.replace(':id', studyId),
    'POST',
    sessions,
    token,
  )
  var promise = new Promise(function (resolve, reject) {
    console.log('waiting')
    window.setTimeout(function () {
      resolve(data)
    }, 2000)
  })
  await promise

  return data.items
}

//returns scehdule and sessions
async function getStudySchedule(
  studyId: string,
  token: string,
): Promise<Schedule> {
  let sessions = await getStudySessions(studyId, token)
  const { data } = await callEndpoint<{ data: Schedule }>(
    constants.endpoints.schedule.replace(':id', studyId),
    'GET',
    {},
    token,
  )

  return { ...data.data, sessions: sessions || [] }
}

export default StudyService
