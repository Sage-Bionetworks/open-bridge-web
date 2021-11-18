import {useUserSessionDataState} from '@helpers/AuthContext'
import ScheduleService, {
  ExtendedScheduleEventObject,
} from '@services/schedule.service'
import {ExtendedError} from '@typedefs/types'
import {useQuery} from 'react-query'

const EVENTS_KEYS = {
  all: ['events'] as const,
  list: (studyId: string | undefined) => [...EVENTS_KEYS.all, 'list'] as const,
  // list: (filters: string) => [...todoKeys.lists(), { filters }] as const,
  details: () => [...EVENTS_KEYS.all, 'detail'] as const,
  detail: (id: string | undefined) => [...EVENTS_KEYS.details(), id] as const,
}

export const useEvents = (
  studyId: string | undefined,
  onlyCustom: boolean,
  withBursts: boolean
) => {
  const {token} = useUserSessionDataState()

  return useQuery<ExtendedScheduleEventObject[], ExtendedError>(
    EVENTS_KEYS.list(studyId),
    () =>
      ScheduleService.getEventsForScheduleByStudyId(
        studyId!,
        token!,
        onlyCustom,
        withBursts
      ),
    {
      enabled: !!studyId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
