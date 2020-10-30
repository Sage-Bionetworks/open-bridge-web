import { Response, Assessment } from '../types/types'

import Assessments from '../data/assessments.json'

import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'

const AssessmentService = {
  getAssessments,
  getSharedAssessments,
  getSharedAssessmentsWithResources,
}

async function getAssessments(token: string): Promise<Assessment[]> {
  console.log('a', Assessments)
  //return Promise.resolve(Assessments.data)
  const result = await callEndpoint<{ items: Assessment[] }>(
    constants.endpoints.assessments,
    'GET',
    {},
    token,
  )

  return result.data.items
}

async function getSharedAssessment(guid: string): Promise<Assessment[]> {
  const result = await callEndpoint<Assessment>(
    `${constants.endpoints.assessmentShared}${guid}/`,
    'GET',
    {},
  )

  return [result.data]
}

async function getSharedAssessments(): Promise<Assessment[]> {
  const result = await callEndpoint<{ items: Assessment[] }>(
    constants.endpoints.assessmentsShared,
    'GET',
    {},
  )
  return result.data.items
}
const getResource = async (assessment: Assessment): Promise<Assessment> => {
  const endPoint = constants.endpoints.assessmentsSharedResources.replace(
    '{identifier}',
    assessment.identifier,
  )
  const response = await callEndpoint<{ items: any[] }>(endPoint, 'GET', {})
  return {
    ...assessment,
    resources: response.data.items,
    duration: Math.ceil(Math.random() * 30),
  }
}

async function getSharedAssessmentsWithResources(
  guid?: string,
): Promise<{ assessments: Assessment[]; tags: string[] }> {
  const name = 'AR'

  const localStore = localStorage.getItem('AR')
  /*if (localStore) {
  return Promise.resolve(JSON.parse(localStore))
  }*/

  const assessments = guid
    ? await getSharedAssessment(guid)
    : await getSharedAssessments()
  const resourcePromises = assessments.map(async asmnt => getResource(asmnt))
  return Promise.all(resourcePromises).then(items => {
    const allTags = items.map(item => item.tags).flat()
    const tags = allTags.reduce((acc, curr) => {
      if (!acc[curr]) {
        acc[curr] = 1
      } else {
        acc[curr] += 1
      }

      return acc
    }, {} as any)

    const result = { assessments: items, tags }
    localStorage.setItem('AR', JSON.stringify(result))

    return result
  })
}

export default AssessmentService
