import {Schedule} from '@typedefs/scheduling'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import ScheduleService from '../services/schedule.service'
import StudyService from '../services/study.service'
import {Study} from '../types/types'
import {useUserSessionDataState} from './AuthContext'

/*export const KEYS = {
  study: 'study',
  schedule: 'schedule',
  studies: 'studies',
}*/

const STUDY_KEYS = {
  all: ['studies'] as const,
  list: () => [...STUDY_KEYS.all, 'list'] as const,
  // list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...STUDY_KEYS.all, 'detail'] as const,
  detail: (id: string | undefined) => [...STUDY_KEYS.details(), id] as const,
}

const SCHEDULE_KEYS = {
  all: ['schedules'] as const,
  list: () => [...SCHEDULE_KEYS.all, 'list'] as const,
  // list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...SCHEDULE_KEYS.all, 'detail'] as const,
  detail: (id: string | undefined) => [...SCHEDULE_KEYS.details(), id] as const,
}

export const useStudy = (
  studyId: string | undefined
  // studyDataUpdateFn: Dispatch<Action>
) => {
  const {token} = useUserSessionDataState()

  return useQuery<Study | undefined, Error>(
    STUDY_KEYS.detail(studyId),
    () => StudyService.getStudy(studyId!, token!),
    {
      enabled: !!studyId,
      retry: 1,
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
        const {study: newStudy, schedule} = await StudyService.copyStudy(
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

      console.log('starting update')
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
      alert('error')
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

  const update = async (props: {
    study: Study
    action: 'UPDATE'
    isPassive?: boolean
  }): Promise<Study> => {
    const {study, action, isPassive} = props
    let newVersion = 0
    if (isPassive) {
      //  return Promise.resolve(study)
      return new Promise((resolve, reject) => {
        resolve(study)
      })
    } else {
      newVersion = await StudyService.updateStudy(
        {...props.study /*, version: originalStudy!.version*/},
        token!
      )
      return {...props.study, version: newVersion}
    }
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(STUDY_KEYS.detail(props.study.identifier))

      console.log('starting update')
      // Snapshot the previous value
      const {study, action, isPassive} = props
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
      alert('error')
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

export const useSchedule = (studyId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<Schedule | undefined, Error>(
    SCHEDULE_KEYS.detail(studyId),
    () => ScheduleService.getSchedule(studyId!, token!),
    {
      enabled: !!studyId,
      retry: false,
    }
  )
}
export const useUpdateSchedule = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    studyId: string
    schedule: Schedule
    isPassive?: boolean

    action: 'UPDATE' | 'CREATE'
  }): Promise<Schedule> => {
    const {studyId, schedule, action, isPassive} = props
    if (isPassive) {
      //  return Promise.resolve(study)
      return new Promise((resolve, reject) => {
        resolve(schedule)
      })
    }
    if (action === 'UPDATE') {
      return ScheduleService.saveSchedule(studyId, schedule, token!)
    } else {
      return ScheduleService.createSchedule(studyId, schedule, token!)
    }
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(SCHEDULE_KEYS.detail(props.studyId))
      queryClient.cancelQueries(STUDY_KEYS.detail(props.studyId))

      console.log('starting update')
      // Snapshot the previous value
      const {studyId, schedule, action} = props
      const previousSchedule = queryClient.getQueryData<Schedule>(
        SCHEDULE_KEYS.detail(studyId)
      )

      queryClient.setQueryData<Schedule>(SCHEDULE_KEYS.detail(studyId), {
        ...schedule,
      })

      return {previousSchedule}
    },
    onError: (err, variables, context) => {
      alert('error')
      console.log(err, variables, context)
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, args) => {
      if (!args.isPassive) {
        queryClient.invalidateQueries(SCHEDULE_KEYS.detail(args.studyId))
        queryClient.invalidateQueries(STUDY_KEYS.detail(args.studyId))
      }
    },
  })

  return mutation
}

/*export const useStudyBuilderInfo = (
  studyId: string | undefined,
  studyDataUpdateFn: Dispatch<Action>,
  shouldGetScheduleResources: boolean = true
) => {
  const {token} = useUserSessionDataState()

  const {
    data: studyData,
    error: studyError,
    status: studyStatus,
  } = useQuery<Study | undefined, Error>(
    ['getStudy', studyId, token],
    () => StudyService.getStudy(studyId!, token!),
    {
      enabled: !!studyId,
    }
  )

  const {
    data: scheduleData,
    error: scheduleError,
    status: scheduleStatus,
  } = useQuery<Schedule | undefined, Error>(
    ['getSchedule', studyId, token, shouldGetScheduleResources],
    () => {
      return ScheduleService.getSchedule(
        studyId!,
        token!,
        shouldGetScheduleResources
      )
    },
    {
      enabled: !!studyId,
      retry: false,
    }
  )

  React.useEffect(() => {
    if (
      studyStatus === 'success' &&
      (scheduleStatus === 'success' || scheduleStatus === 'error')
    ) {
      studyDataUpdateFn({
        type: 'SET_ALL',
        payload: {study: studyData!, schedule: scheduleData},
      })
    }
  }, [
    scheduleData,
    scheduleError,
    scheduleStatus,
    studyStatus,
    studyData,
    studyError,
    studyDataUpdateFn,
  ])
  const isLoading = studyStatus === 'loading' || scheduleStatus === 'loading'

  return {studyError, isLoading, study: studyData, schedule: scheduleData}
}
*/
