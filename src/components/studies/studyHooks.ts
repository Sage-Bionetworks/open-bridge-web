import {useUserSessionDataState} from '@helpers/AuthContext'
import StudyService from '@services/study.service'
import {ExtendedError, Study} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'

export const STUDY_KEYS = {
  all: ['studies'] as const,
  list: () => [...STUDY_KEYS.all, 'list'] as const,
  // list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...STUDY_KEYS.all, 'detail'] as const,
  detail: (id: string | undefined) => [...STUDY_KEYS.details(), id] as const,
}

export const useStudy = (studyId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<Study | undefined, ExtendedError>(
    STUDY_KEYS.detail(studyId),
    () => StudyService.getStudy(studyId!, token!),
    {
      enabled: !!studyId,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  )
}

export const useStudies = () => {
  const {token} = useUserSessionDataState()

  return useQuery<Study[], ExtendedError>(
    STUDY_KEYS.list(),
    () => StudyService.getStudies(token!).then(result => result.items),
    {retry: 1}
  )
}

export const useUpdateStudyInList = () => {
  const {token, appId} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    study: Study
    action: 'RENAME' | 'DELETE' | 'COPY' | 'CREATE' | 'WITHDRAW' | 'CLOSE'
  }): Promise<Study[]> => {
    const {study, action} = props
    let newVersion = 0

    switch (action) {
      case 'DELETE':
        return await StudyService.removeStudy(study.identifier, token!)
      case 'CLOSE':
        return await StudyService.completeStudy(study.identifier, token!)
      case 'WITHDRAW':
        return await StudyService.withdrawStudy(study.identifier, token!)

      case 'RENAME':
        const updatedStudy = await StudyService.renameStudy(
          study.identifier,
          study.name,
          token!
        )

        return [updatedStudy]
      case 'COPY':
        const {study: newStudy} = await StudyService.copyStudy(
          study.identifier!,
          appId,
          token!
        )
        return [newStudy]
      case 'CREATE':
        newVersion = await StudyService.createStudy(study, token!)
        return [{...props.study, version: newVersion}]
      default:
        throw Error('Unknown Study Action')
    }
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(STUDY_KEYS.all)

      // console.log('starting update in studies')
      // Snapshot the previous value
      const {study, action} = props
      const previousStudies = queryClient.getQueryData<Study[]>(
        STUDY_KEYS.list()
      )
      let updatedList: Study[] = []

      switch (action) {
        case 'CLOSE':
        case 'WITHDRAW':
        case 'RENAME':
          if (previousStudies) {
            updatedList = previousStudies.map(s =>
              s.identifier !== study.identifier
                ? s
                : {...study, version: study.version + 1}
            )
          }
          break

        case 'DELETE':
          if (previousStudies) {
            updatedList = previousStudies.filter(
              s => s.identifier !== study.identifier
            )
          }
          break
        case 'COPY': {
          updatedList = [...(previousStudies || [])]
          updatedList.unshift({
            ...study,
            identifier: '...',
            modifiedOn: new Date(),
            phase: 'design',
            name: 'Copying ' + study.name + '...',
          })

          break
        }

        default: {
          updatedList = [...(previousStudies || [])]
          updatedList.unshift({
            ...study,
          })
        }
      }
      queryClient.setQueryData<Study[]>(STUDY_KEYS.list(), [...updatedList])

      return {previousStudies}
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(STUDY_KEYS.detail(props.study.identifier))
      queryClient.invalidateQueries(STUDY_KEYS.list())
    },
  })

  return mutation
}

export const useUpdateStudyDetail = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {study: Study}): Promise<Study> => {
    let newVersion = 0

    newVersion = await StudyService.updateStudy({...props.study}, token!)
    return {...props.study, version: newVersion}
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(STUDY_KEYS.detail(props.study.identifier))

      // console.log('starting update for study detail')
      // Snapshot the previous value
      const {study} = props
      const previousStudy = queryClient.getQueryData<Study>(
        STUDY_KEYS.detail(props.study.identifier)
      )

      const newStudy: Study = {...study, version: study.version + 1}

      queryClient.setQueryData<Study>(
        STUDY_KEYS.detail(props.study.identifier),
        newStudy
      )

      return {previousStudy}
    },
    onError: (err, variables, context) => {
      throw err
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(STUDY_KEYS.detail(props.study.identifier))
    },
  })

  return mutation
}
