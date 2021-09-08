import Utility from '../helpers/utility'
import constants from '../types/constants'
import {Assessment} from '../types/types'
import {getItem, KEYS} from './lshelper'

const AssessmentService = {
  getAssessments,
  getAssessmentsWithResources,
  getAssessmentsForSession,
  getResource,
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

  return [result.data]
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

  return result.data.items
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

async function getAssessmentsForSession(
  sessionId: string,
  token?: string
): Promise<Assessment[]> {
  // aling to do when api is ready
  /* const result =await callEndpoint<{ items: Assessment[] }>(
    constants.endpoints.assessmentsForSession.replace(
      ':sessionId',
      sessionId),
    'GET',
    {},
    token,
  

  return result*/
  const sessionAssessments = await getItem<
    {sessionId: string; assessments: Assessment[]}[]
  >(KEYS.ASSESSMENTS)
  if (!sessionAssessments) {
    return []
  }
  return (
    sessionAssessments.find(a => a.sessionId === sessionId)?.assessments || []
  )
}

export default AssessmentService
