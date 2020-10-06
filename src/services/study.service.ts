import { Response, Study } from '../types/types'

import Studies from '../data/studies.json'

import { callEndpoint } from '../helpers/utility'

const StudyService = {
  getStudies,
}

async function getStudies(): Promise<Study[]> {
  return Promise.resolve(Studies.data)
}

export default StudyService
