import {useUserSessionDataState} from '@helpers/AuthContext'
import AdherenceService, {
  WeeklyAdherenceFilter,
} from '@services/adherence.service'
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
    idFilter: string = '',
    labelFilters: string = '',
    completionStatus: string = '',
    adherenceMin: number = 0,
    adherenceMax: number = 0,
    completionFilters: string = ''
  ) =>
    [
      ...ADHERENCE_KEYS.all,
      'list',
      studyId,
      currentPage,
      pageSize,
      idFilter,
      labelFilters,
      completionStatus,
      adherenceMin,
      adherenceMax,
      completionFilters,
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
  filter: WeeklyAdherenceFilter
) => {
  const {token} = useUserSessionDataState()

  return useQuery<
    {items: AdherenceWeeklyReport[]; total: number},
    ExtendedError
  >(
    ADHERENCE_KEYS.list(
      studyId,
      currentPage,
      pageSize,
      filter.idFilter,
      filter.labelFilters?.join(',') || '',

      filter.completionStatus?.join(',') || '',
      filter.adherenceMin,
      filter.adherenceMax,
      filter.progressionFilters?.join(',')
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
