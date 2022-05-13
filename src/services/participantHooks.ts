import {useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import EventService from '@services/event.service'
import ParticipantService from '@services/participants.service'
import {
  EditableParticipantData,
  ExtendedError,
  ParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  ParticipantRequestInfo,
  Phone,
} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {ParticipantData} from '../components/studies/participants/participantUtility'
import {EVENTS_KEYS} from './eventHooks'

export const PARTICIPANT_KEYS = {
  all: ['participants'] as const,
  list: (
    studyId: string | undefined,
    currentPage: number = 0,
    pageSize: number = 0,
    tab: ParticipantActivityType = 'ACTIVE',
    searchValue: string | undefined = undefined
  ) =>
    [
      ...PARTICIPANT_KEYS.all,
      'list',
      studyId,
      currentPage,
      pageSize,
      tab,
      searchValue,
    ] as const,
  detail: (studyId: string, participantId: string) =>
    [...PARTICIPANT_KEYS.list(studyId), participantId] as const,
}

async function getParticipants(
  studyId: string,
  currentPage: number,
  pageSize: number, // set to 0 to get all the participants
  tab: ParticipantActivityType,
  token: string,
  searchOptions?: {
    searchParam: 'EXTERNAL_ID' | 'PHONE_NUMBER'
    searchValue: string
  }
): Promise<ParticipantData> {
  const offset = currentPage * pageSize
  //const token = Utility.getSession()?.token
  if (!token) {
    throw Error('Need token')
  }
  const participants = searchOptions?.searchValue
    ? await ParticipantService.participantSearch(
        studyId,
        token,
        searchOptions.searchValue,
        tab,
        searchOptions.searchParam
      )
    : await ParticipantService.getParticipants(
        studyId,
        token,
        tab,
        pageSize,
        offset < 0 ? 0 : offset
      )

  const result = participants.items!.map(participant => {
    const id = participant.id as string

    if (participant.externalId) {
      const splitExternalId = participant.externalId.split(':')
      let id = ''
      if (splitExternalId.length === 1) {
        id = splitExternalId[0]
      } else {
        id = splitExternalId[splitExternalId[0] === studyId ? 1 : 0]
      }
      participant.externalId = Utility.formatStudyId(id)
    }
    const updatedParticipant = {
      ...participant,
      events: [],
    }
    return updatedParticipant
  })
  return {items: result, total: participants.total}
}

export const useParticipants = (
  studyId: string | undefined,
  currentPage: number,
  pageSize: number,
  tab: ParticipantActivityType,
  searchValue?: string | undefined,
  isById?: boolean
) => {
  const {token} = useUserSessionDataState()
  let searchOptions:
    | {searchParam: 'EXTERNAL_ID' | 'PHONE_NUMBER'; searchValue: string}
    | undefined = undefined
  if (searchValue) {
    const searchParam = isById ? 'EXTERNAL_ID' : 'PHONE_NUMBER'
    searchOptions = {searchParam, searchValue}
  }
  return useQuery<ParticipantData, ExtendedError>(
    PARTICIPANT_KEYS.list(studyId, currentPage, pageSize, tab, searchValue),
    () =>
      getParticipants(
        studyId!,
        currentPage,
        pageSize,
        tab,
        token!,
        searchOptions
      ),
    {
      enabled: !!studyId,
      retry: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )
}

export const useInvalidateParticipants = () => {
  const queryClient = useQueryClient()
  const invalidate = () => {
    queryClient.invalidateQueries(PARTICIPANT_KEYS.all)
  }
  return invalidate
}

export const useUpdateParticipantInList = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    studyId: string
    action: 'WITHDRAW' | 'DELETE' | 'UPDATE'
    userId?: string[]
    note?: string
    updatedFields?: {
      [Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]
    }
    customEvents?: ParticipantEvent[]

    isAllSelected?: boolean
  }): Promise<string | string[]> => {
    switch (props.action) {
      case 'WITHDRAW':
        return await ParticipantService.withdrawParticipant(
          props.studyId!,
          token!,
          props.userId![0],
          props.note
        )
      case 'DELETE':
        return await ParticipantService.deleteParticipant(
          props.studyId!,
          token!,
          props.userId!
        )
      case 'UPDATE':
        if (props.customEvents?.length) {
          if (
            !props.updatedFields?.clientTimeZone ||
            props.updatedFields.clientTimeZone.length < 3
          ) {
            throw new Error('Please enter the time zone to update the events')
          }
          await EventService.updateParticipantCustomEvents(
            props.studyId,
            token!,
            props.userId![0],
            props.customEvents,
            props.updatedFields.clientTimeZone
          )
        }
        return await ParticipantService.updateParticipant(
          props.studyId,
          token!,
          props.userId!,
          props.updatedFields!,
          props.isAllSelected
        )
      default:
        throw Error('Unknown Action')
    }
  }
  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(PARTICIPANT_KEYS.all)
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(
        PARTICIPANT_KEYS.detail(props.studyId, props.userId![0])
      )
      queryClient.invalidateQueries(PARTICIPANT_KEYS.all)
      if (props.customEvents && props.customEvents.length > 0) {
        console.log('invalidating events list')
        queryClient.invalidateQueries(EVENTS_KEYS.list(props.studyId))
      }
    },
  })
  return mutation
}

export const useAddParticipant = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    studyId: string
    options: EditableParticipantData
    phone?: Phone
  }): Promise<string> => {
    const {studyId, options, phone} = props
    return phone
      ? await ParticipantService.addParticipant(studyId, token!, {
          ...options,
          phone,
        })
      : await ParticipantService.addParticipant(studyId, token!, options)
  }

  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(PARTICIPANT_KEYS.all)
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
    },
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(PARTICIPANT_KEYS.all)
    },
  })
  return mutation
}

export const useGetParticipantInfo = (
  studyId: string,
  participantId: string
) => {
  const {token} = useUserSessionDataState()

  return useQuery<ParticipantRequestInfo, ExtendedError>(
    PARTICIPANT_KEYS.detail(studyId, participantId),
    () =>
      ParticipantService.getRequestInfoForParticipant(
        studyId,

        participantId,
        token!
      ),
    {
      enabled: !!studyId && !!participantId,
      retry: false,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  )
}
