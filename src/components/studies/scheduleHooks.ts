import {useUserSessionDataState} from '@helpers/AuthContext'
import ScheduleService from '@services/schedule.service'
import {Schedule, ScheduleTimeline} from '@typedefs/scheduling'
import {ExtendedError} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {STUDY_KEYS} from './studyHooks'

const SCHEDULE_KEYS = {
  all: ['schedules'] as const,
  list: () => [...SCHEDULE_KEYS.all, 'list'] as const,
  // list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...SCHEDULE_KEYS.all, 'detail'] as const,
  detail: (id: string | undefined) => [...SCHEDULE_KEYS.details(), id] as const,
  timeline: (id: string) => [...SCHEDULE_KEYS.detail(id), 'timeline'] as const,
  detail_noresources: (id: string | undefined) =>
    [...SCHEDULE_KEYS.detail(id), 'no_resources'] as const,
}

export const useSchedule = (
  studyId: string | undefined,
  withResources: boolean = true
) => {
  const {token} = useUserSessionDataState()

  return useQuery<Schedule | undefined, ExtendedError>(
    SCHEDULE_KEYS.detail(studyId),
    () => ScheduleService.getSchedule(studyId!, token!, withResources),
    {
      enabled: !!studyId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
export const useUpdateSchedule = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    studyId: string
    schedule: Schedule

    action: 'UPDATE' | 'CREATE'
  }): Promise<Schedule> => {
    const {studyId, schedule, action} = props
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
      console.log('%c ' + err, 'color: red')
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, args) => {
      queryClient.invalidateQueries(SCHEDULE_KEYS.detail(args.studyId))
      queryClient.invalidateQueries(STUDY_KEYS.detail(args.studyId))
    },
  })

  return mutation
}

export const useTimeline = (studyId: string) => {
  const {token} = useUserSessionDataState()

  return useQuery<ScheduleTimeline | undefined, ExtendedError>(
    SCHEDULE_KEYS.timeline(studyId),
    () => ScheduleService.getScheduleTimeline(studyId, token!),
    {
      enabled: !!studyId,
      refetchOnWindowFocus: true,
    }
  )
}
