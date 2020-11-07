import { Group, Study, StudySession, StudyStatus } from '../types/types'
import Studies from '../data/studies.json'
import Sessions from '../data/sessions.json'
import { StudySection } from '../components/studies/sections'
import AssessmentService from './assessment.service'

const StudyService = {
  getStudies,
  getStudy,
  saveStudy,

  getStudySessions,
}

async function getStudies(): Promise<Study[]> {
  //@ts-ignore
  return Promise.resolve(Studies.data)
}

async function getStudy(id: string): Promise<Study | undefined> {
  const _study = Studies.data.find(study => study.identifier === id)!
  const result = await getStudySessions(_study!.identifier)
  const study: Study = {..._study!, status: _study.status as StudyStatus, sessions: result|| []}
//@ts-ignore
  return new Promise(resolve => setTimeout(resolve.bind(null, study), 2))
  /*return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Some Error Just happened")), 1000)
    );*/
}

async function getStudySessions(id: string): Promise<StudySession[]| undefined> {

  const sessions = Sessions.data 
  const promises = sessions.map(session  => {
    return AssessmentService.getAssessmentsForSession(session.id)
  })

  return Promise.all(promises).then(sessionAssessments=> sessionAssessments.map((assArray, index) => ({...sessions[index], assessments: assArray})))

}

async function saveStudy(study: Study): Promise<Study | undefined> {
  //const result = Studies.data.find(study => study.id === id)
console.log('saving')
  return new Promise(resolve => setTimeout(resolve.bind(null, study), 2000))
  /*return new Promise((resolve, reject) =>
    setTimeout(() => reject(new Error("Some Error Just happened")), 1000)
    );*/
}

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
