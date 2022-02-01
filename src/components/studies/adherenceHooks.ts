import {CompletionStatus} from '@components/adherence/participants/CompletionFilter'
import {useUserSessionDataState} from '@helpers/AuthContext'
import AdherenceService from '@services/adherence.service'
import {
  AdherenceWeeklyReport,
  EventStreamAdherenceReport,
  ExtendedError,
} from '@typedefs/types'
import {useQuery} from 'react-query'

export const ADHERENCE_KEYS = {
  all: ['adherence'] as const,
  list: (
    studyId: string,
    currentPage: number = 0,
    pageSize: number = 0,
    searchLabels: string = '',
    adherenceThreshold: number = 0,
    completionFilter: string = ''
  ) =>
    [
      ...ADHERENCE_KEYS.all,
      'list',
      studyId,
      currentPage,
      pageSize,
      searchLabels,
      adherenceThreshold,
      completionFilter,
    ] as const,

  detail: (studyId: string, userId: string) =>
    [...ADHERENCE_KEYS.list(studyId), userId] as const,
}

export const useAdherence = (studyId: string, userId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<EventStreamAdherenceReport, ExtendedError>(
    ADHERENCE_KEYS.detail(studyId, userId!),
    () => AdherenceService.getAdherenceForParticipant(studyId, userId!, token!),
    {
      enabled: !!studyId && !!userId && !!token,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
export const useAdherenceForWeekForUsers = (
  studyId: string,
  userIds: string[]
) => {
  const {token} = useUserSessionDataState()

  return useQuery<AdherenceWeeklyReport[], ExtendedError>(
    ADHERENCE_KEYS.list(studyId),

    () =>
      AdherenceService.getAdherenceForWeekForUsers(studyId, userIds, token!),
    {
      enabled: !!studyId && userIds.length > 0 && !!token,
      retry: true,
      refetchOnWindowFocus: true,
    }
  )
}

export const useAdherenceForWeek = (
  studyId: string,
  currentPage: number,
  pageSize: number,
  completionStatus: CompletionStatus[],
  labelFilter?: string[],
  adherenceThreshold?: number
) => {
  const {token} = useUserSessionDataState()
  console.log('a', adherenceThreshold)
  let filter = {
    labelFilter: labelFilter || [],
    completionStatus: completionStatus,
    adherenceThreshold: adherenceThreshold || 0,
  }

  return useQuery<
    {items: AdherenceWeeklyReport[]; total: number},
    ExtendedError
  >(
    ADHERENCE_KEYS.list(
      studyId,
      currentPage,
      pageSize,
      labelFilter?.join(',') || '',
      adherenceThreshold,
      completionStatus?.join(',') || ''
    ),

    () =>
      AdherenceService.getAdherenceForWeek(
        studyId,

        currentPage,
        pageSize,
        filter,
        token!
      ),
    {
      enabled: !!studyId && !!token,
      retry: true,
      refetchOnWindowFocus: true,
    }
  )
}
