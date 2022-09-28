import Utility from '@helpers/utility'
import constants from '@typedefs/constants'
import { Survey } from '@typedefs/surveys'
import { Assessment, AssessmentResource, ExtendedError } from '@typedefs/types'

/* AG: BOTH survey and assessments would include arb/mtb tag, but surveys would include survey tag while other assessments won't*/
const ASSESSMENT_APP_TAG = {
  [constants.constants.ARC_APP_ID]: 'ARC',
  [constants.constants.INV_ARC_APP_ID]: 'ARC',
  [constants.constants.MTB_APP_ID]: 'Mobile Toolbox',
}

const SURVEY_APP_TAG = {
  [constants.constants.ARC_APP_ID]: 'Arc Surveys Alina Test',
  [constants.constants.MTB_APP_ID]: 'MTB Surveys Alina Test',
  [constants.constants.INV_ARC_APP_ID]: 'Arc Surveys Alina Test',
}

//tags used internally that end user will not see
const TAGS_TO_HIDE = [
  ...Object.values(SURVEY_APP_TAG),
  ...Object.values(ASSESSMENT_APP_TAG),
]

const DEFAULT_ASSESSMENT_RETR_OPTIONS = {isLocal: false, isSurvey: false}

/* gets a shared assessment */
async function getAssessment(
  guid: string,
  token: string,

  options: {isLocal: boolean; shouldKeepAllTags?: boolean}
): Promise<Assessment> {
  let endPoint = options.isLocal
    ? constants.endpoints.assessment
    : constants.endpoints.assessmentShared
  const assessmentResponse = await Utility.callEndpoint<Assessment>(
    `${endPoint.replace(':id', guid)}`,
    'GET',
    {},
    token
  )
  // should keep all tags if set 'true' will return assessment. Otherwise it'll fiter the tags
  const assessment = {
    ...assessmentResponse.data,
    tags: options.shouldKeepAllTags
      ? assessmentResponse.data.tags
      : assessmentResponse.data.tags.filter(tag => !TAGS_TO_HIDE.includes(tag)),
  }

  return assessment
}

/* gets the list of shared assessments OR local (surveys)*/
async function getAssessments(
  appId: string,
  token: string,
  options: {isLocal?: boolean; isSurvey?: boolean} = {}
  //  isLocal = false
): Promise<Assessment[]> {
  const _options = {...DEFAULT_ASSESSMENT_RETR_OPTIONS, ...options}
  const result = await Utility.callEndpoint<{items: Assessment[]}>(
    _options?.isLocal
      ? constants.endpoints.assessments
      : constants.endpoints.assessmentsShared,
    'GET',
    {},
    token
  )

  const filterTag = _options?.isSurvey
    ? SURVEY_APP_TAG[appId]
    : ASSESSMENT_APP_TAG[appId]
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
  options: {isLocal?: boolean; isSurvey?: boolean; guid?: string} = {}
): Promise<{assessments: Assessment[]; tags: string[]}> {
  const {guid, ..._options} = {...DEFAULT_ASSESSMENT_RETR_OPTIONS, ...options}
  const assessments = guid
    ? await getAssessment(guid, token, {isLocal: _options.isLocal}).then(
        result => [result]
      )
    : await getAssessments(appId, token, _options)
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
  appId: string,
  assessment: Assessment,
  token: string
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

async function duplicateAssessment(
  appId: string,
  guid: string,
  token: string,
  isLocal: boolean
): Promise<{assessment: Assessment; config: Survey}> {
  const sourceAssessment = await getAssessment(guid, token, {
    isLocal,
  })
  const sourceConfig = await getSurveyAssessmentConfig(guid, token)
  const identifier = Utility.generateNonambiguousCode(6, 'CONSONANTS')
  const assessmentCopy: Assessment = {
    ...sourceAssessment,
    title: `Copy of ${sourceAssessment.title}`,
    createdOn: undefined,
    identifier,
    guid: undefined,
    modifiedOn: undefined,
    deleted: undefined,
    version: 0,

  }
  const configCopy = {config: {...sourceConfig.config, identifier}}

  const assessment = await createSurveyAssessment(appId, assessmentCopy, token)
  const config = await updateSurveyAssessmentConfig(
    assessment.guid!,
    configCopy,
    token
  )
  return {assessment, config}
}

async function updateSurveyAssessment(
  appId: string,
  assessment: Assessment,
  token: string
): Promise<Assessment> {
  const endpoint = constants.endpoints.assessment.replace(
    ':id',
    assessment.guid!
  )
  const tags = Array.from(new Set([...assessment.tags, SURVEY_APP_TAG[appId]]))
  const assessmentToUpdate = {...assessment, tags}
  const update = async (a: Assessment): Promise<Assessment> => {
    const assessmentResponse = await Utility.callEndpoint<Assessment>(
      endpoint,
      'POST', // once we add things to the study -- we can change this to actual object
      a,
      token
    )

    return assessmentResponse.data
  }

  let result
  try {
    result = await update(assessmentToUpdate)
  } catch (error) {
    if ((error as ExtendedError).statusCode === 409) {
      assessmentToUpdate.version = assessmentToUpdate.version + 1

      result = await update(assessmentToUpdate)
    } else {
      throw error
    }
  }
  if (result) {
    return result
  } else throw new Error("Can't update assessment")
}

async function deleteSurveyAssessment(
  assessment: Assessment,
  token: string
): Promise<Assessment> {
  const endpoint = constants.endpoints.assessment.replace(
    ':id',
    assessment.guid!
  )

  const assessmentResponse = await Utility.callEndpoint<Assessment>(
    endpoint,
    'DELETE',
    {},
    token
  )
  console.log('assessment deleted', assessmentResponse.data)
  return assessmentResponse.data
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

//updates a particularLocal resource for assessment
async function updateSurveyAssessmentResource(
  assessmentId: string,
  resource: AssessmentResource,
  token: string
): Promise<AssessmentResource> {
  const endpoint = `${constants.endpoints.assessmentResources.replace(
    ':identifier',
    assessmentId
  )}/${resource.guid || ''}`

  const response = await Utility.callEndpoint<AssessmentResource>(
    endpoint,
    'POST', // once we add things to the study -- we can change this to actual object
    resource,
    token
  )

  return response.data
}
async function updateSurveyAssessmentConfig(
  guid: string,
  survey: Survey,
  token: string
): Promise<Survey> {
  const endpoint = `${constants.endpoints.assessment.replace(
    ':id',
    guid
  )}/config`

  const result = await Utility.callEndpoint<Survey>(endpoint, 'GET', {}, token)
  const data = {
    config: survey.config,
    version: result.data.version,
  }

  const response = await Utility.callEndpoint<Survey>(
    endpoint,
    'POST',
    data,
    token
  )

  return response.data
}

const AssessmentService = {
  createSurveyAssessment,
  duplicateAssessment,
  updateSurveyAssessment,
  deleteSurveyAssessment,
  updateSurveyAssessmentResource,
  updateSurveyAssessmentConfig,
  getSurveyAssessmentConfig,

  getAssessment,
  getAssessments,
  getAssessmentsWithResources,
  getResource,
  ASSESSMENT_APP_TAG,
  SURVEY_APP_TAG,
}

export default AssessmentService
