import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { Assessment } from '../types/types'
import { getItem, KEYS } from './lshelper'

const AssessmentService = {
  getAssessments,
  getAssessmentsWithResources,
  getAssessmentsForSession,
  importAssessmentIntoLocalContext,
  getResource,
}

async function getAssessment(
  guid: string,
  token?: string,
): Promise<Assessment[]> {
  const result = !token
    ? await callEndpoint<Assessment>(
        `${constants.endpoints.assessmentShared.replace(':id', guid)}`,
        'GET',
        {},
      )
    : await callEndpoint<Assessment>(
        `${constants.endpoints.assessment.replace(':id', guid)}`,
        'GET',
        {},
        token,
      )

  return [result.data]
}

async function importAssessmentIntoLocalContext(
  guid: string,
  ownerId: string,
  token: string,
) {
  const assessment = await callEndpoint<Assessment>(
    `${constants.endpoints.assessmentShared.replace(':id', guid)}/import`,
    `POST`,
    {
      ownerId: ownerId,
    },
    token,
  )
  return assessment.data
}

async function getAssessments(token?: string): Promise<Assessment[]> {
  const result = token
    ? await callEndpoint<{ items: Assessment[] }>(
        //constants.endpoints.assessments,
        constants.endpoints.assessments,
        'GET',
        {},
        token,
      )
    : await callEndpoint<{ items: Assessment[] }>(
        constants.endpoints.assessmentsShared,
        'GET',
        {},
      )

  return result.data.items
}

async function getResource(assessment: Assessment): Promise<Assessment> {
  const endPoint = constants.endpoints.assessmentsSharedResources.replace(
    ':identifier',
    assessment.identifier,
  )
  const response = await callEndpoint<{ items: any[] }>(endPoint, 'GET', {})
  return {
    ...assessment,
    resources: response.data.items,
    duration: Math.ceil(Math.random() * 30),
  }
}

async function getAssessmentsWithResources(
  guid?: string,
  token?: string,
): Promise<{ assessments: Assessment[]; tags: string[] }> {
  const name = token ? 'AShared' : 'ANonShared'

  const localStore = localStorage.getItem(name)
  if (localStore) {
    return Promise.resolve(JSON.parse(localStore))
  }

  const assessments = guid
    ? await getAssessment(guid, token)
    : await getAssessments(token)
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

    const result = { assessments: items, tags }
    localStorage.setItem('AR', JSON.stringify(result))

    return result
  })
}

async function getAssessmentsForSession(
  sessionId: string,
  token?: string,
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
    { sessionId: string; assessments: Assessment[] }[]
  >(KEYS.ASSESSMENTS)
  if (!sessionAssessments) {
    return []
  }
  return (
    sessionAssessments.find(a => a.sessionId === sessionId)?.assessments || []
  )
}

export default AssessmentService
