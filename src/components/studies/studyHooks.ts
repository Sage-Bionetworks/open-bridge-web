import {useUserSessionDataState} from '@helpers/AuthContext'
import StudyService from '@services/study.service'
import {Study} from '@typedefs/types'
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

  return useQuery<Study | undefined, Error>(
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

  return useQuery<Study[], Error>(
    STUDY_KEYS.list(),
    () => StudyService.getStudies(token!),
    {retry: 1}
  )
}

export const useUpdateStudyInList = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    study: Study
    action: 'UPDATE' | 'DELETE' | 'COPY' | 'CREATE'
    isPassive?: false
  }): Promise<Study[]> => {
    const {study, action, isPassive} = props
    let newVersion = 0
    if (isPassive) {
      return Promise.resolve([study])
    }

    switch (action) {
      case 'DELETE':
        return await StudyService.removeStudy(study.identifier, token!)
      case 'UPDATE':
        newVersion = await StudyService.updateStudy(
          {...props.study /*, version: originalStudy!.version*/},
          token!
        )
        return [{...props.study, version: newVersion}]
      case 'COPY':
        const {study: newStudy} = await StudyService.copyStudy(
          study.identifier!,
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

      console.log('starting update in study hook')
      // Snapshot the previous value
      const {study, action} = props
      const previousStudies = queryClient.getQueryData<Study[]>(
        STUDY_KEYS.list()
      )
      let updatedList: Study[] = []

      switch (action) {
        case 'UPDATE':
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
            name: 'Copying ' + study.name + " and it's schedule...",
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
      if (!props.isPassive) {
        queryClient.invalidateQueries(STUDY_KEYS.detail(props.study.identifier))
        queryClient.invalidateQueries(STUDY_KEYS.list())
      }
    },
  })

  return mutation
}

export const useUpdateStudyDetail = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    study: Study

    isPassive?: boolean
  }): Promise<Study> => {
    const {study, isPassive} = props
    let newVersion = 0
    if (isPassive) {
      return new Promise((resolve, reject) => {
        resolve(study)
      })
    } else {
      newVersion = await StudyService.updateStudy({...props.study}, token!)
      return {...props.study, version: newVersion}
    }
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(STUDY_KEYS.detail(props.study.identifier))

      console.log('starting update')
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
      console.log(err, variables, context)
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, props) => {
      if (!props.isPassive) {
        queryClient.invalidateQueries(STUDY_KEYS.detail(props.study.identifier))
      }
    },
  })

  return mutation
}
