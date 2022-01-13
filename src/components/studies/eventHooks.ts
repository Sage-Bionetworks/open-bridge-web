import {useUserSessionDataState} from '@helpers/AuthContext'
import EventService from '@services/event.service'
import ScheduleService, {
  ExtendedScheduleEventObject,
} from '@services/schedule.service'
import {ExtendedError, ParticipantEvent} from '@typedefs/types'
import {useQuery} from 'react-query'

const EVENTS_KEYS = {
  all: ['events'] as const,
  list: (studyId: string | undefined) => [...EVENTS_KEYS.all, 'list'] as const,

  detail: (studyId: string | undefined, userId: string | undefined) =>
    [...EVENTS_KEYS.list(studyId), userId] as const,
}

export const useEvents = (studyId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<ExtendedScheduleEventObject[], ExtendedError>(
    EVENTS_KEYS.list(studyId),
    () => ScheduleService.getAllEventsForTimelineByStudyId(studyId!, token!),
    {
      enabled: !!studyId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}

export const useEventsForUser = (
  studyId: string | undefined,
  userId: string | undefined
) => {
  const {token} = useUserSessionDataState()

  return useQuery<
    {
      timeline_retrieved: Date | undefined
      customEvents: ParticipantEvent[]
    },
    ExtendedError
  >(
    EVENTS_KEYS.detail(studyId, userId),
    () =>
      EventService.getRelevantEventsForParticipants(studyId!, token!, [
        userId!,
      ]).then(result => result[userId!]),
    {
      enabled: !!studyId && !!userId,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
