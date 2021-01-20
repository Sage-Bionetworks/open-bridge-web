import { Schedule, StudyDuration, StudySession } from '../types/scheduling'
import { Study, StudyStatus } from '../types/types'
import { getItem, KEYS, MOCKS, setItem } from './lshelper'

const StudyService = {
  getStudies,
  getStudy,
  saveStudy,
  removeStudy,
  getStudySessions,
  saveStudySessions,
  getStudySchedule,
  saveStudySchedule
}

async function getStudies(): Promise<Study[]> {
  let studies = await getItem<Study[]>(KEYS.STUDIES)
  if (!studies) {
    const mocks = MOCKS.STUDIES.map(s => ({
      ...s,
      status: s.status as StudyStatus,
    }))
    studies = await setItem<Study[]>(KEYS.STUDIES, mocks)
  }
  if (studies === null) {
    throw 'no studies'
  }
  return studies
}

async function getStudy(id: string): Promise<Study | undefined> {
  const studies = await getStudies()
  const _study = studies.find(study => study.identifier === id)
  if (_study) {
    const study: Study = {
      ..._study!,
      status: _study.status as StudyStatus,
    }
    return study
  } else {
    return undefined
  }
}

async function getAllStudySessions(): Promise<StudySession[] | null> {
  let sessions = await getItem<StudySession[]>(KEYS.STUDY_SESSIONS)
  if (!sessions) {
    const mocks = MOCKS.SESSIONS
    //@ts-ignore
    sessions = await setItem(KEYS.STUDY_SESSIONS, mocks)
  }

  return sessions
}

async function getAllSchedules(): Promise<Schedule[] | null> {
  let s = await getItem<Schedule[]>(KEYS.SCHEDULES)
  if (!s) {
    const mocks = MOCKS.SCHEDULE
    //@ts-ignore
    s = await setItem(KEYS.SCHEDULES, [mocks])
  }

  return s
}

async function getStudySessions(
  studyId: string,
): Promise<StudySession[] | undefined> {
  let sessions = await getAllStudySessions()
  return sessions
    ?.filter(s => s.studyId === studyId)
    .map((s, index) => ({ ...s, order: index }))
}

async function saveStudy(study: Study): Promise<Study[]> {
  const studies = (await getStudies()) || []
  let newStudies: Study[]
  if (studies.find(_study => _study.identifier === study.identifier)) {
    //if study exist
    newStudies = studies.map(_study =>
      _study.identifier === study.identifier ? study : _study,
    )
  } else {
    newStudies = [...studies, study]
  }
  const result = await setItem(KEYS.STUDIES, newStudies)
  return result
}

async function removeStudy(studyId: string): Promise<Study[]> {
  const studies = (await getStudies()) || []
  const newStudies = studies.filter(s => s.identifier !== studyId)
  const result = await setItem(KEYS.STUDIES, newStudies)
  return result
}

async function saveStudySchedule(
  studyId: string,
  schedule: Schedule,
  duration: StudyDuration,
): Promise<void> {
  const study = await getStudy(studyId)
  if (!study) {
    return Promise.reject('no study')
  }
  study.studyDuration = duration

  //save study
  const result1 = await saveStudy(study)

  //save sessions
  const allSessions = await getAllStudySessions()
  const others = allSessions?.filter(s => s.studyId !== studyId) || []
  const sessions = schedule.sessions
  const allSessionsUpdated = [...others, ...sessions]
  const result2 = await setItem(KEYS.STUDY_SESSIONS, allSessionsUpdated)

  //save schedule
  const allSchedules = await getAllSchedules()
  const otherSched = allSchedules?.filter(s => s.studyId !== studyId) || []
  const allSchedsUpdated = [...otherSched, {
    ...schedule,
    studyId: studyId,
  }]
  const result3 = await setItem(KEYS.SCHEDULES,  allSchedsUpdated)

  console.log('done')
  return
}

async function saveStudySessions(
  studyId: string,
  sessions: StudySession[],
): Promise<StudySession[]> {
  const allSessions = await getAllStudySessions()
  const others = allSessions?.filter(s => s.studyId !== studyId) || []
  const allSessionsUpdated = [...others, ...sessions]
  const result = await setItem(KEYS.STUDY_SESSIONS, allSessionsUpdated)
  var promise = new Promise(function (resolve, reject) {
    console.log('waiting')
    window.setTimeout(function () {
      resolve(result)
    }, 2000)
  })
  var x = await promise
  console.log('done')
  return result
}

//returns scehdule and sessions
async function getStudySchedule(studyId: string): Promise<Schedule> {
  /* let studyArms = await getItem<StudyArm[]>(KEYS.STUDY_ARMS)
  let result =  studyArms?.filter(sa => sa.studyId === studyId)
 if(!result || result.length === 0){*/
  let sessions = await getStudySessions(studyId)
  let schedules = await getItem<Schedule[]>(KEYS.SCHEDULES)
  let schedule = schedules?.filter(sa => sa.studyId === studyId)?.[0]
  if (!schedule) {
    const mocks = MOCKS.SCHEDULE
    schedule = mocks
    schedule.studyId  = studyId
    //@ts-ignore
    await setItem(KEYS.SCHEDULES, [mocks])
  }

  return { ...schedule, sessions: sessions || [] }
}

/*return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Some Error Just happened")), 1000)
    );*/

/*async function getStudyGroups(id: string): Promise<Group[]> {
  const result = Studies.data.find(study => study.id === id)
  if (result && result.groups) {
    return new Promise(resolve =>
      //@ts-ignore
      setTimeout(resolve.bind(null, result.groups), 2000),
    )
  } else {
    return new Promise((resolve, reject) =>
      setTimeout(() => reject(new Error('no groups')), 1000),
    )
  }*/

/*return new Promise(resolve =>
        setTimeout(resolve.bind(null, result?.groups), 2000)
    );*/
/*return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Some Error Just happened")), 1000)
    );*/

export default StudyService
