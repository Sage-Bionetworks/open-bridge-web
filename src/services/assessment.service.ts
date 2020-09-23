import {
  ENDPOINT,
  LoggedInUserData,
  Response,
  UserAttributes,
  Assessment,
} from '../types/types'

import Assessments from '../data/assessments.json'

import { callEndpoint } from '../helpers/utility'

const AssessmentService = {
  getAssessments,
}

async function getAssessments(): Promise<Assessment[]> {
  console.log('a', Assessments)
  return Promise.resolve(Assessments.data)
}

export default AssessmentService
