import {useUserSessionDataState} from '@helpers/AuthContext'
import EventService from '@services/event.service'
import ScheduleService, {
  ExtendedScheduleEventObject,
} from '@services/schedule.service'
import {ExtendedError, ParticipantEvent} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {ADHERENCE_KEYS} from './adherenceHooks'

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

export const useUpdateEventsForUser = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    studyId: string
    participantId: string
    customEvents: ParticipantEvent[]
  }): Promise<string> => {
    const participantId = await EventService.updateParticipantCustomEvents(
      props.studyId,
      token!,
      props.participantId,
      props.customEvents
    )
    return participantId
  }
  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(
        EVENTS_KEYS.detail(props.studyId, props.participantId)
      )
    },
    onError: (err, variables, context) => {
      console.log('error updating events')
    },
    onSuccess: (data, props) => {
      queryClient.invalidateQueries(
        EVENTS_KEYS.detail(props.studyId, props.participantId)
      )
      queryClient.invalidateQueries(
        ADHERENCE_KEYS.detail(props.studyId, props.participantId)
      )
      queryClient.refetchQueries(
        ADHERENCE_KEYS.detail(props.studyId, props.participantId)
      )
      console.debug('refetch')
    },
  })

  return mutation
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
