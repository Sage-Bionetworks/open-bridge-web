import { Response, Study } from '../types/types'

import Studies from '../data/studies.json'

import { callEndpoint } from '../helpers/utility'

const StudyService = {
  getStudies,
  getStudy
}

async function getStudies(): Promise<Study[]> {
  return Promise.resolve(Studies.data)
}

async function getStudy(id: string): Promise<Study|undefined> {
    const result = Studies.data.find(study=> study.id===id)
    return Promise.resolve(result)
  }

export default StudyService
