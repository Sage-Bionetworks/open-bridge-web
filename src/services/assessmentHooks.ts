import {useUserSessionDataState} from '@helpers/AuthContext'
import AssessmentService from '@services/assessment.service'
import {Assessment, ExtendedError} from '@typedefs/types'
import {useQuery} from 'react-query'

export const ASSESSMENT_KEYS = {
  all: ['assessments'] as const,
  list: (appId: string) => [...ASSESSMENT_KEYS.all, 'list', appId] as const,

  listWithResources: (appId: string, guid: string | null) =>
    [...ASSESSMENT_KEYS.all, 'resources', appId, guid] as const,
  resource: (appId: string, guid: string) =>
    [...ASSESSMENT_KEYS.all, 'resource', appId, guid] as const,
}

export const useAssessments = () => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment[] | undefined, ExtendedError>(
    ASSESSMENT_KEYS.list(appId),
    () => AssessmentService.getAssessments(appId, token!),
    {
      enabled: !!appId,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  )
}

export const useAssessmentWithResources = (guid: string) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment, ExtendedError>(
    ASSESSMENT_KEYS.listWithResources(appId, guid),
    () =>
      AssessmentService.getAssessmentsWithResources(appId, token!, guid).then(
        result => {
          if (result.assessments.length === 0) {
            throw new Error('no assessment found')
          } else {
            return result.assessments[0]
          }
        }
      ),
    {retry: 1}
  )
}

export const useAssessmentsWithResources = () => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<{assessments: Assessment[]; tags: string[]}, ExtendedError>(
    ASSESSMENT_KEYS.listWithResources(appId, null),
    () =>
      AssessmentService.getAssessmentsWithResources(appId, token!, undefined),
    {retry: 1}
  )
}

export const useAssessmentResource = (assessment: Assessment) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment, ExtendedError>(
    ASSESSMENT_KEYS.resource(appId, assessment.identifier),
    () => AssessmentService.getResource(assessment, token!),
    {retry: 1}
  )
}
