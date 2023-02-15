import {useUserSessionDataState} from '@helpers/AuthContext'
import AdherenceService, {WeeklyAdherenceFilter} from '@services/adherence.service'
import {
  AdherenceAlert,
  AdherenceAlertCategory,
  AdherenceDetailReport,
  AdherenceStatistics,
  AdherenceWeeklyReport,
  ExtendedError,
} from '@typedefs/types'
import {useMutation, useQuery, useQueryClient} from 'react-query'

export const ADHERENCE_KEYS = {
  all: ['adherence'] as const,

  list: (
    studyId: string,
    currentPage: number = 0,
    pageSize: number = 0,
    idFilter: string = '',
    labelFilters: string = '',
    progressionFilters: string = '',
    adherenceMin: number = 0,
    adherenceMax: number = 0
  ) =>
    [
      ...ADHERENCE_KEYS.all,
      'list',
      studyId,
      currentPage,
      pageSize,
      idFilter,
      labelFilters,
      progressionFilters,
      adherenceMin,
      adherenceMax,
    ] as const,

  detail: (studyId: string, userId: string) => [...ADHERENCE_KEYS.list(studyId), userId] as const,
  alerts: (studyId: string, category: string | undefined = undefined, currentPage: number = 0, pageSize: number = 0) =>
    [...ADHERENCE_KEYS.list(studyId, currentPage, pageSize, '', ''), 'summary', category] as const,
}

export const useAdherence = (studyId: string, userId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<AdherenceDetailReport, ExtendedError>(
    ADHERENCE_KEYS.detail(studyId, userId!),
    () => AdherenceService.getAdherenceForParticipant(studyId, userId!, token!),
    {
      enabled: !!studyId && !!userId && !!token,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}

export const useAdherenceStatsForWeek = (studyId: string) => {
  const {token} = useUserSessionDataState()

  return useQuery<AdherenceStatistics, ExtendedError>(
    ADHERENCE_KEYS.list(studyId),
    () => AdherenceService.getAdherenceStatsForWeek(studyId, token!),
    {
      enabled: !!studyId && !!token,
      retry: true,
      refetchOnWindowFocus: true,
    }
  )
}

export const useAdherenceAlerts = (
  studyId: string,
  categories: AdherenceAlertCategory[],
  pageSize: number = 25,
  offsetBy = 0
) => {
  const cat = categories.join()
  const {token} = useUserSessionDataState()
  return useQuery<{items: AdherenceAlert[]; total: number}, ExtendedError>(
    ADHERENCE_KEYS.alerts(studyId, cat, offsetBy, pageSize),
    () => AdherenceService.getAdherenceAlerts(studyId, categories, pageSize, offsetBy, token!),
    {
      enabled: !!studyId && !!token,
      retry: true,
      refetchOnWindowFocus: true,
    }
  )
}

export const useUpdateAdherenceAlerts = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  // update alerts status on the server
  const update = async (props: {
    studyId: string, 
    alertIds: string[], 
    action: 'READ' | 'UNREAD' | 'DELETE'
  }): Promise<any> => {
    const {studyId, alertIds} = props
    switch(props.action) {
      // TODO - add delete
      case 'READ':
        return await AdherenceService.markAdherenceAlertsAsRead(props.studyId, props.alertIds, token!)
      case 'UNREAD':
        return await AdherenceService.markAdherenceAlertsAsUnread(props.studyId, props.alertIds, token!)
      default:
        throw Error('Unknown Action')
    }
  }

  // invalidate alerts data
  const mutation = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries(ADHERENCE_KEYS.alerts(props.studyId))
    },
    onError: (err, variables, context) => {
      console.log(err, variables, context)
    }, 
    onSettled: async (data, error, props) => {
      queryClient.invalidateQueries(ADHERENCE_KEYS.alerts(props.studyId))
    },
  })
  return mutation
}

export const useAdherenceForWeek = (
  studyId: string,
  currentPage: number,
  pageSize: number,
  filter: WeeklyAdherenceFilter
) => {
  const {token} = useUserSessionDataState()

  return useQuery<{items: AdherenceWeeklyReport[]; total: number}, ExtendedError>(
    ADHERENCE_KEYS.list(
      studyId,
      currentPage,
      pageSize,
      filter.idFilter,
      filter.labelFilters?.join(',') || '',
      filter.progressionFilters?.join(','),

      filter.adherenceMin,
      filter.adherenceMax
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
