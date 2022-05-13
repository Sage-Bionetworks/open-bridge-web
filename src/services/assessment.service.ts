import Utility from '../helpers/utility'
import constants from '../types/constants'
import {Assessment} from '../types/types'

const MTB_TAG = 'Mobile Toolbox'
const ARC_TAG = 'Arc'
const SURVEY_TAG = 'Alina Survey Test'

const isArcApp = (appId: string) => appId === constants.constants.ARC_APP_ID

/*

const isArcApp = (): {isArc: boolean; token?: string} => {
  const sessionData = Utility.getSession()
  return {
    isArc: sessionData?.appId === constants.constants.ARC_APP_ID,
    token: sessionData?.token,
  }
}*/

async function getAssessment(
  appId: string,
  token: string,
  guid: string
  /* token?: string,*/
): Promise<Assessment[]> {
  const isArc = isArcApp(appId)
  let endPoint = constants.endpoints.assessmentShared
  const result = await Utility.callEndpoint<Assessment>(
    `${endPoint.replace(':id', guid)}`,
    'GET',
    {},
    token
  )
  const filterTag = isArc ? ARC_TAG : MTB_TAG
  const returnResult = [
    {...result.data, tags: result.data.tags?.filter(tag => tag !== filterTag)},
  ]
  return returnResult
}

async function getAssessments(
  appId: string,
  token: string
): Promise<Assessment[]> {
  const isArc = isArcApp(appId)
  const result = await Utility.callEndpoint<{items: Assessment[]}>(
    constants.endpoints.assessmentsShared,
    'GET',
    {},
    token
  )

  const filterTag = isArc ? ARC_TAG : MTB_TAG
  const returnResult = result.data.items
    .filter(item => item.tags && item.tags.includes(filterTag))
    .map(item => ({
      ...item,
      tags: item.tags?.filter(tag => tag !== filterTag),
    }))
  return returnResult
}

async function getResource(
  assessment: Assessment,
  token: string
): Promise<Assessment> {
  const endPoint = constants.endpoints.assessmentSharedResources
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
  appId: string,
  token: string,
  guid?: string
): Promise<{assessments: Assessment[]; tags: string[]}> {
  const assessments = guid
    ? await getAssessment(appId, token, guid)
    : await getAssessments(appId, token)
  const resourcePromises = assessments.map(async asmnt =>
    getResource(asmnt, token)
  )
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

async function createSurveyAssessment(
  assessment: Assessment,
  token: string
): Promise<number> {
  const newVersion = await Utility.callEndpoint<{version: number}>(
    constants.endpoints.assessment.replace(':id', ''),
    'POST', // once we add things to the study -- we can change this to actual object
    assessment,
    token
  )

  return newVersion.data.version
}

const AssessmentService = {
  createSurveyAssessment,
  getAssessments,
  getAssessmentsWithResources,
  getResource,
  MTB_TAG,
}

export default AssessmentService
