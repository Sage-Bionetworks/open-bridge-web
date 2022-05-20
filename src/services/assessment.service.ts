import Utility from '@helpers/utility'
import constants from '@typedefs/constants'
import {Survey} from '@typedefs/surveys'
import {Assessment, ExtendedError} from '@typedefs/types'

/* AG: BOTH survey and assessments would include arb/mtb tag, but surveys would include survey tag while other assessments won't*/
const ASSESSMENT_APP_TAG = {
  [constants.constants.ARC_APP_ID]: 'ARC',
  [constants.constants.MTB_APP_ID]: 'Mobile Toolbox',
}

const SURVEY_APP_TAG = {
  [constants.constants.ARC_APP_ID]: 'Arc Surveys Alina Test',
  [constants.constants.MTB_APP_ID]: 'MTB Surveys Alina Test',
}

const TAGS_TO_HIDE = [
  ...Object.values(SURVEY_APP_TAG),
  ...Object.values(ASSESSMENT_APP_TAG),
]

/* gets a shared assessment */
async function getAssessment(
  token: string,
  guid: string
): Promise<Assessment[]> {
  let endPoint = constants.endpoints.assessmentShared
  const result = await Utility.callEndpoint<Assessment>(
    `${endPoint.replace(':id', guid)}`,
    'GET',
    {},
    token
  )

  const returnResult = [
    {
      ...result.data,
      tags: result.data.tags?.filter(tag => !TAGS_TO_HIDE.includes(tag)),
    },
  ]
  return returnResult
}

/* gets the list of shared assessments OR local (surveys)*/
async function getAssessments(
  appId: string,
  token: string,
  isLocal = false
): Promise<Assessment[]> {
  const result = await Utility.callEndpoint<{items: Assessment[]}>(
    isLocal
      ? constants.endpoints.assessments
      : constants.endpoints.assessmentsShared,
    'GET',
    {},
    token
  )

  const filterTag = isLocal ? SURVEY_APP_TAG[appId] : ASSESSMENT_APP_TAG[appId]
  const returnResult = result.data.items

    .filter(item => item.tags && item.tags.includes(filterTag))
    .map(item => ({
      ...item,
      tags: item.tags?.filter(tag => !TAGS_TO_HIDE.includes(tag)),
    }))

  return returnResult
}

/*gets resources for an assessment (shared) or survey (local) */
async function getResource(
  assessment: Assessment,
  token: string,
  isLocal = false
): Promise<Assessment> {
  const endPoint = isLocal
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
  appId: string,
  token: string,
  guid?: string
): Promise<{assessments: Assessment[]; tags: string[]}> {
  const assessments = guid
    ? await getAssessment(token, guid)
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

/* creates assessment for the survey. Potentially can be used to create any assessment but needs to be 
  refactored as to add the proper tags conditionally */
async function createSurveyAssessment(
  assessment: Assessment,
  token: string,
  appId: string
): Promise<Assessment> {
  const tags = Array.from(new Set([...assessment.tags, SURVEY_APP_TAG[appId]]))
  const response = await Utility.callEndpoint<Assessment>(
    constants.endpoints.assessment.replace(':id', ''),
    'POST',
    {...assessment, tags},
    token
  )
  return response.data
}

async function getSurveyAssessment(
  guid: string,
  token: string
): Promise<Assessment> {
  const endpoint = constants.endpoints.assessment.replace(':id', guid)
  const assessmentResponse = await Utility.callEndpoint<Assessment>(
    endpoint,
    'GET',
    {},
    token
  )
  const assessmentConfigResponse = await Utility.callEndpoint<Survey>(
    `${endpoint}/config`,
    'GET', // once we add things to the study -- we can change this to actual object
    {},
    token
  )

  const assessment = {
    ...assessmentResponse.data,
    tags: assessmentResponse.data.tags.filter(
      tag => !TAGS_TO_HIDE.includes(tag)
    ),
    config: assessmentConfigResponse.data,
  }

  return assessment
}

async function updateSurveyAssessment(
  assessment: Assessment,
  token: string,
  appId: string
): Promise<Assessment> {
  const endpoint = constants.endpoints.assessment.replace(
    ':id',
    assessment.guid!
  )
  const tags = Array.from(new Set([...assessment.tags, SURVEY_APP_TAG[appId]]))
  const assessmentToUpdate = {...assessment, tags}
  const update = async (a: Assessment): Promise<Assessment> => {
    console.log('trying update', a)
    const assessmentResponse = await Utility.callEndpoint<Assessment>(
      endpoint,
      'POST', // once we add things to the study -- we can change this to actual object
      a,
      token
    )
    console.log('assessment updated', assessmentResponse.data)
    return assessmentResponse.data
  }

  try {
    return update(assessmentToUpdate)
  } catch (error) {
    console.log('!!error')
    if ((error as ExtendedError).statusCode === 409) {
      console.log('409')
      assessmentToUpdate.version = assessmentToUpdate.version + 1

      return update(assessmentToUpdate)
    } else {
      throw error
    }
  }
}
async function getSurveyAssessmentConfig(
  guid: string,

  token: string
): Promise<Survey> {
  const endpoint = `${constants.endpoints.assessment.replace(
    ':id',
    guid
  )}/config`
  const response = await Utility.callEndpoint<Survey>(
    endpoint,
    'GET', // once we add things to the study -- we can change this to actual object
    {},
    token
  )

  return response.data
}

async function updateSurveyAssessmentConfig(
  guid: string,
  config: Survey,
  token: string
): Promise<Survey> {
  const endpoint = `${constants.endpoints.assessment.replace(
    ':id',
    guid
  )}/config`
  const response = await Utility.callEndpoint<Survey>(
    endpoint,
    'POST', // once we add things to the study -- we can change this to actual object
    config,
    token
  )

  return response.data
}

const AssessmentService = {
  createSurveyAssessment,
  updateSurveyAssessment,
  updateSurveyAssessmentConfig,
  getSurveyAssessmentConfig,
  getSurveyAssessment,
  getAssessments,
  getAssessmentsWithResources,
  getResource,
  ASSESSMENT_APP_TAG,
  SURVEY_APP_TAG,
}

export default AssessmentService
