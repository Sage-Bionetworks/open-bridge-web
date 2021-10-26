import _ from 'lodash'
import Utility from '../helpers/utility'
import constants from '../types/constants'
import {Assessment} from '../types/types'

const MTB_TAG = 'Mobile Toolbox'

const AssessmentService = {
  getAssessments,
  getAssessmentsWithResources,

  getResource,
  MTB_TAG,
}

const isArcApp = (): {isArc: boolean; token?: string} => {
  const sessionData = Utility.getSession()
  return {
    isArc: sessionData?.appId === constants.constants.ARC_APP_ID,
    token: sessionData?.token,
  }
}

async function getAssessment(
  guid: string
  /* token?: string,*/
): Promise<Assessment[]> {
  const {isArc, token} = isArcApp()
  let endPoint = isArc
    ? constants.endpoints.assessment
    : constants.endpoints.assessmentShared
  const result = await Utility.callEndpoint<Assessment>(
    `${endPoint.replace(':id', guid)}`,
    'GET',
    {},
    token
  )

  const returnResult = isArc
    ? [result.data]
    : [{...result.data, tags: _.without(result.data.tags, MTB_TAG)}]
  return returnResult
}

async function getAssessments(): Promise<Assessment[]> {
  const {isArc, token} = isArcApp()
  const result = await Utility.callEndpoint<{items: Assessment[]}>(
    isArc
      ? constants.endpoints.assessments
      : constants.endpoints.assessmentsShared,
    'GET',
    {},
    token
  )

  const returnResult = isArc
    ? result.data.items
    : result.data.items
        .filter(item => item.tags.includes(MTB_TAG))
        .map(item => ({...item, tags: _.without(item.tags, MTB_TAG)}))
  return returnResult
}

async function getResource(assessment: Assessment): Promise<Assessment> {
  const {isArc, token} = isArcApp()
  const endPoint = isArc
    ? constants.endpoints.assessmentResources
    : constants.endpoints.assessmentSharedResources
  const response = await Utility.callEndpoint<{items: any[]}>(
    endPoint.replace(':identifier', assessment.identifier),
    'GET',
    {},
    token
  )
  return {
    ...assessment,
    resources: response.data.items,
  }
}

async function getAssessmentsWithResources(
  guid?: string
): Promise<{assessments: Assessment[]; tags: string[]}> {
  const assessments = guid ? await getAssessment(guid) : await getAssessments()
  const resourcePromises = assessments.map(async asmnt => getResource(asmnt))
  return Promise.allSettled(resourcePromises).then(items1 => {
    const items = items1
      .filter(i => i.status === 'fulfilled')
      //@ts-ignore
      .map(i => i.value) as Assessment[]

    const itemsFailed = items1
      .filter(i => i.status === 'rejected')
      //@ts-ignore
      .map(i => i.reason)
    console.log(itemsFailed)

    const allTags = items.map(item => item.tags).flat()
    const tags = allTags.reduce((acc, curr) => {
      if (!acc[curr]) {
        acc[curr] = 1
      } else {
        acc[curr] += 1
      }

      return acc
    }, {} as any)

    const result = {assessments: items, tags}
    if (!guid) {
      sessionStorage.setItem('AssessmentResources', JSON.stringify(result))
    }

    return result
  })
}

export default AssessmentService
