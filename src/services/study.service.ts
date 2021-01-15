import { getRandomId } from '../helpers/utility'
import {
  Schedule,
  Study,
  StudyArm,
  StudySession,
  StudyStatus,
} from '../types/types'
import { getItem, KEYS, MOCKS, setItem } from './lshelper'

const StudyService = {
  getStudies,
  getStudy,
  saveStudy,
  removeStudy,
  getStudySessions,
  saveStudySessions,
  getStudyArms,
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

async function saveStudySessions(
  studyId: string,
  sessions: StudySession[],
): Promise<StudySession[]> {
  const allSessions = await getAllStudySessions()
  const others = allSessions?.filter(s => s.studyId !== studyId) || []
  const allSessionsUpdated = [...others, ...sessions]
  const result = await setItem(KEYS.STUDY_SESSIONS, allSessionsUpdated)

  return result
}

async function getStudyArms(studyId: string): Promise<StudyArm[]> {
  let result
  /* let studyArms = await getItem<StudyArm[]>(KEYS.STUDY_ARMS)
  let result =  studyArms?.filter(sa => sa.studyId === studyId)
 if(!result || result.length === 0){*/
  const sessions = await getStudySessions(studyId)
  const schedule: Schedule = {
    name: 'Untitled',
    eventStartId: '123',
    sessions: sessions || [],
  }
  const newStudyArm: StudyArm = {
    id: getRandomId(),
    studyId,
    active: true,
    name: 'Untitled',

    schedule,
  }
  result = [newStudyArm]
  //}
  result[0] = { ...result[0], active: true }

  return result
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
