import {useUserSessionDataState} from '@helpers/AuthContext'
import AssessmentService from '@services/assessment.service'
import {Survey} from '@typedefs/surveys'
import {Assessment, AssessmentResource, ExtendedError} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'

export const ASSESSMENT_KEYS = {
  all: ['assessments'] as const,
  list: (appId: string) => [...ASSESSMENT_KEYS.all, 'list', appId] as const,
  assessment: (guid: string) =>
    [...ASSESSMENT_KEYS.all, 'assessment', guid] as const,
  survey: (guid: string) => [...ASSESSMENT_KEYS.all, 'survey', guid] as const,
  surveyResource: (guid: string) =>
    [...ASSESSMENT_KEYS.all, 'resource', guid] as const,
  detailWithResources: (appId: string, guid: string) =>
    [...ASSESSMENT_KEYS.all, 'detail_resources', appId, guid] as const,
  listWithResources: (appId: string) =>
    [...ASSESSMENT_KEYS.all, 'list_resources', appId] as const,
  resource: (appId: string, guid: string) =>
    [...ASSESSMENT_KEYS.all, 'resource', appId, guid] as const,
}

export const useAssessments = (areSurveys?: boolean) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment[] | undefined, ExtendedError>(
    ASSESSMENT_KEYS.list(appId),
    () => AssessmentService.getAssessments(appId, token!, areSurveys),
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
    ASSESSMENT_KEYS.detailWithResources(appId, guid),
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
    {retry: 1, enabled: guid !== ':id'}
  )
}

export const useAssessmentsWithResources = () => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<{assessments: Assessment[]; tags: string[]}, ExtendedError>(
    ASSESSMENT_KEYS.listWithResources(appId),
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

export const useSurveyAssessment = (guid?: string) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment | undefined, ExtendedError>(
    ASSESSMENT_KEYS.assessment(guid || ''),
    () =>
      guid
        ? AssessmentService.getSurveyAssessment(guid, token!).then(assessment =>
            AssessmentService.getResource(assessment, token!, true)
          )
        : Promise.resolve(undefined),
    {
      enabled: !!guid && guid !== ':id',
      retry: 1,
      refetchOnWindowFocus: false,
    }
  )
}

export const useSurveyConfig = (guid?: string) => {
  const {token, appId} = useUserSessionDataState()
  console.log('getting config with guid:', guid)
  return useQuery<Survey | undefined, ExtendedError>(
    ASSESSMENT_KEYS.survey(guid || ''),
    () => {
      console.log('!!!!guid!!!', guid)
      return guid
        ? AssessmentService.getSurveyAssessmentConfig(guid, token!)
        : Promise.resolve(undefined)
    },
    {
      retry: 1,
      refetchOnWindowFocus: false,
    }
  )
}
export const useUpdateSurveyConfig = () => {
  const {token, appId} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    guid: string
    survey: Survey
  }): Promise<Survey> => {
    const {survey, guid} = props

    console.log('updating config', survey)

    return AssessmentService.updateSurveyAssessmentConfig(guid, survey, token!)
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ASSESSMENT_KEYS.survey(props.guid))
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
      throw err
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(ASSESSMENT_KEYS.list(appId))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.survey(props.guid || ''))
      queryClient.invalidateQueries(
        ASSESSMENT_KEYS.detailWithResources(appId, props.guid || '')
      )
    },
  })

  return mutation
}

export const useUpdateSurveyResource = () => {
  const {token, appId} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    assessment: Assessment
    resource: AssessmentResource
  }): Promise<AssessmentResource> => {
    const {resource, assessment} = props

    return AssessmentService.updateSurveyAssessmentResource(
      assessment.identifier,
      resource,
      token!
    )
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ASSESSMENT_KEYS.survey(props.assessment.guid!))
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
      throw err
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(ASSESSMENT_KEYS.list(appId))
      queryClient.invalidateQueries(
        ASSESSMENT_KEYS.survey(props.assessment.guid!)
      )
      queryClient.invalidateQueries(
        ASSESSMENT_KEYS.detailWithResources(appId, props.assessment.guid!)
      )
    },
  })

  return mutation
}

export const useUpdateSurveyAssessment = () => {
  const {token, appId} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    assessment: Assessment

    action: 'COPY' | 'CREATE' | 'DELETE' | 'UPDATE'
  }): Promise<Assessment> => {
    const {assessment, action} = props

    switch (action) {
      case 'DELETE':
      // TODO: return await AssessmentService.removeStudy(study.identifier, token!)

      case 'COPY':
      /*  TODO: const {survey: Assessment} = await AssessmentService.copyStudy(
          survey.identifier!,
          appId,
          token!
        )
        return [newStudy]*/
      case 'UPDATE':
        console.log('updating', assessment)
        return AssessmentService.updateSurveyAssessment(
          assessment,
          token!,
          appId
        )
      case 'CREATE':
        return AssessmentService.createSurveyAssessment(
          assessment,
          token!,
          appId
        )

      default:
        throw Error('Unknown Survey Action')
    }
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ASSESSMENT_KEYS.all)
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
      throw err
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(ASSESSMENT_KEYS.list(appId))
      queryClient.invalidateQueries(
        ASSESSMENT_KEYS.assessment(props.assessment.guid || '')
      )
      queryClient.invalidateQueries(
        ASSESSMENT_KEYS.survey(props.assessment.guid || '')
      )
      queryClient.invalidateQueries(
        ASSESSMENT_KEYS.detailWithResources(appId, props.assessment.guid || '')
      )
    },
  })

  return mutation
}
