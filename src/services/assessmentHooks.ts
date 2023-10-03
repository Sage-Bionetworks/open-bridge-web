import {useUserSessionDataState} from '@helpers/AuthContext'
import AssessmentService from '@services/assessment.service'
import {Survey} from '@typedefs/surveys'
import {Assessment, AssessmentResource, ExtendedError} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'

export const ASSESSMENT_KEYS = {
  assessments: (isLocal: boolean) => ['assessments', isLocal],
  all: (appId: string, isLocal: boolean) => [...ASSESSMENT_KEYS.assessments(isLocal), appId] as const,
  list: (appId: string, isLocal: boolean, isSurvey: boolean) =>
    [...ASSESSMENT_KEYS.all(appId, isLocal), 'list', isSurvey] as const,
  assessment: (guid: string, isLocal: boolean) => [...ASSESSMENT_KEYS.assessments(isLocal), 'assessment', guid] as const,
  assessmentConfig: (guid: string, isLocal: boolean) => [...ASSESSMENT_KEYS.assessments(isLocal), 'assessmentConfig', guid] as const,
  detailWithResources: (appId: string, guid: string, isLocal: boolean) =>
    [...ASSESSMENT_KEYS.all(appId, isLocal), 'detail_resources', guid] as const,
  listWithResources: (appId: string, isLocal: boolean, isSurvey: boolean) =>
    [...ASSESSMENT_KEYS.list(appId, isLocal, isSurvey), 'list_resources'] as const,
  resource: (appId: string, guid: string, isLocal: boolean) => [...ASSESSMENT_KEYS.all(appId, isLocal), 'resource', guid] as const,
}

export const useAssessments = (options?: {isLocal: boolean; isSurvey: boolean}) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment[] | undefined, ExtendedError>(
    ASSESSMENT_KEYS.list(appId, !!options?.isLocal, !!options?.isSurvey),
    () => {
      const result = AssessmentService.getAssessments(appId, token!, options)
      return result
    },
    {
      enabled: !!appId,
      retry: 2,
      refetchOnWindowFocus: false,
    }
  )
}

export const useAssessmentWithResources = (guid: string, isLocal: boolean) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment, ExtendedError>(
    ASSESSMENT_KEYS.detailWithResources(appId, guid, isLocal),
    () =>
      AssessmentService.getAssessmentsWithResources(appId, token!, {
        guid: guid,
        isLocal: isLocal,
      }).then(result => {
        if (result.assessments.length === 0) {
          throw new Error('no assessment found')
        } else {
          return result.assessments[0]
        }
      }),
    {retry: 1, enabled: guid !== ':id'}
  )
}

export const useAssessmentsWithResources = (isLocal: boolean, isSurvey: boolean) => {
  const {token, appId} = useUserSessionDataState()
  const options = {isLocal, isSurvey}

  return useQuery<{assessments: Assessment[]; tags: string[]}, ExtendedError>(
    ASSESSMENT_KEYS.listWithResources(appId, isLocal, isSurvey),
    () => AssessmentService.getAssessmentsWithResources(appId, token!, options),
    {retry: 1}
  )
}

export const useAssessmentResource = (assessment: Assessment) => {
  const {token, appId} = useUserSessionDataState()

  return useQuery<Assessment, ExtendedError>(
    ASSESSMENT_KEYS.resource(appId, assessment.identifier, assessment.isLocal ?? false),
    () => AssessmentService.getResource(assessment, token!),
    {retry: 1}
  )
}

export const useSurveyAssessment = (isLocal: boolean, guid?: string) => {
  const {token} = useUserSessionDataState()
  const options = {isSurvey: true, isLocal}

  return useQuery<Assessment | undefined, ExtendedError>(
    ASSESSMENT_KEYS.assessment(guid || '', true),
    () =>
      guid
        ? AssessmentService.getAssessment(guid, token!, options).then(assessment =>
            AssessmentService.getResource(assessment, token!)
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
  const {token} = useUserSessionDataState()

  return useQuery<Survey | undefined, ExtendedError>(
    ASSESSMENT_KEYS.assessmentConfig(guid || '', true),
    () => {
      return guid ? AssessmentService.getSurveyAssessmentConfig(guid, token!) : Promise.resolve(undefined)
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

  const update = async (props: {guid: string; survey: Survey}): Promise<Survey> => {
    const {survey, guid} = props

    console.log('updating config', survey)

    return AssessmentService.updateSurveyAssessmentConfig(guid, survey, token!)
  }

  const mutation = useMutation<Survey, Error, any, any>(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ASSESSMENT_KEYS.assessmentConfig(props.guid, true))
    },

    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(ASSESSMENT_KEYS.all(appId, true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.assessmentConfig(props.guid || '', true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.detailWithResources(appId, props.guid || '', true))
    },
  })

  return mutation
}

export const useUpdateSurveyResource = () => {
  const {token, appId} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {assessment: Assessment; resource: AssessmentResource}): Promise<AssessmentResource> => {
    const {resource, assessment} = props

    return AssessmentService.updateSurveyAssessmentResource(assessment.identifier, resource, token!)
  }

  const mutation = useMutation<AssessmentResource, Error, any, any>(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ASSESSMENT_KEYS.assessment(props.assessment.guid!, true))
    },

    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(ASSESSMENT_KEYS.all(appId, true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.assessmentConfig(props.assessment.guid!, true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.detailWithResources(appId, props.assessment.guid!, true))
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
        return AssessmentService.deleteSurveyAssessment(assessment, token!)

      case 'COPY':
        const {assessment: result} = await AssessmentService.duplicateAssessment(appId, assessment.guid!, token!, true)
        return result

      case 'UPDATE':
        console.log('updating', assessment)
        return AssessmentService.updateSurveyAssessment(appId, assessment, token!)
      case 'CREATE':
        return AssessmentService.createSurveyAssessment(appId, assessment, token!)

      default:
        throw Error('Unknown Survey Action')
    }
  }

  const mutation = useMutation<Assessment, Error, any, any>(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ASSESSMENT_KEYS.all(appId, true))

      //Snapshot the old value
      const previousState = queryClient.getQueryData<Assessment[]>(ASSESSMENT_KEYS.list(appId, true, true))
      let newState = [...(previousState || [])]
      switch (props.action) {
        case 'DELETE':
          newState = newState.filter(a => a.guid !== props.assessment.guid)
          break
        case 'COPY':
          newState.unshift({...props.assessment, identifier: '...'})
          break
        case 'UPDATE':
          queryClient.setQueryData(
            ASSESSMENT_KEYS.list(appId, true, true),
            newState.map(a => (a.guid === props.assessment.guid ? props.assessment : a))
          )
          break
        case 'CREATE':
          queryClient.setQueryData(ASSESSMENT_KEYS.list(appId, true, true), newState.concat(props.assessment))
          break
      }

      //update to the new value
      queryClient.setQueryData(ASSESSMENT_KEYS.list(appId, true, true), newState)

      //Return a context with old and rew values
      return {previousState, newState}
    },

    onSettled: async (data, error, props, context) => {
      if (error) {
        queryClient.setQueryData(ASSESSMENT_KEYS.list(appId, true, true), context?.previousState)
      }
      queryClient.invalidateQueries(ASSESSMENT_KEYS.list(appId, true, true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.assessment(props.assessment.guid || '', true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.assessmentConfig(props.assessment.guid || '', true))
      queryClient.invalidateQueries(ASSESSMENT_KEYS.detailWithResources(appId, props.assessment.guid || '', true))
    },
  })

  return mutation
}
