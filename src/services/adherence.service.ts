import {
  AdherenceDetailReport,
  AdherenceStatistics,
  AdherenceWeeklyReport,
  ProgressionStatus,
} from '@typedefs/types'
import _ from 'lodash'
import Utility from '../helpers/utility'
import constants from '../types/constants'

export const COMPLIANCE_THRESHOLD = 60

export type WeeklyAdherenceFilter = {
  idFilter?: string
  labelFilters?: string[]

  adherenceMax?: number
  adherenceMin?: number
  progressionFilters?: ProgressionStatus[]
}

// this function ony used internally for 'priming' adherence report after the event dates are changed, or user is modified
async function getAdherenceForWeekForUsers(
  studyId: string,
  userIds: string[],
  token: string
): Promise<AdherenceWeeklyReport[]> {
  const weeklyPromises = userIds.map(userId => {
    const endpoint = constants.endpoints.adherenceUserWeekly
      .replace(':studyId', studyId)
      .replace(':userId', userId)
    return Utility.callEndpoint<any>(endpoint, 'GET', {}, token)
  })

  const result = (await Promise.all(weeklyPromises)).map(result => result.data)
  return result
}

async function getAdherenceStatsForWeek(
  studyId: string,
  token: string
): Promise<AdherenceStatistics> {
  const endpoint = constants.endpoints.adherenceStats.replace(
    ':studyId',
    studyId
  )
  const data = {adherenceThreshold: COMPLIANCE_THRESHOLD}

  const result = await Utility.callEndpoint<AdherenceStatistics>(
    endpoint,
    'GET',
    data,
    token
  )
  return result.data
}

async function getAdherenceForWeek(
  studyId: string,
  currentPage: number,
  pageSize: number,
  filter: WeeklyAdherenceFilter,

  token: string
): Promise<{total: number; items: AdherenceWeeklyReport[]}> {
  console.log('startint priming - only use if need immediate data for test')

  // ALINA TODO: remove when batched report is done -- priming
  /* 
  const enr = await ParticipantService.getEnrollmentByEnrollmentType(
    studyId,
    token!,
    'enrolled',
    true
  )

 const ids = enr.items.map(p => p.participant.identifier)
  console.log('ds', ids)
  const prime = await getAdherenceForWeekForUsers(studyId, ids, token)
  console.log('starting all')*/
  /* end of priming */

  const endpoint = constants.endpoints.adherenceWeekly.replace(
    ':studyId',
    studyId
  )

  const defaultFilters = {
    progressionFilters: ['in_progress', 'done'],
    testFilter: 'both',
  }

  const paging = {
    pageSize: pageSize || undefined,
    offsetBy: pageSize > 0 ? currentPage * pageSize : undefined,
  }

  filter.labelFilters = filter.labelFilters?.map(label => {
    return _.trim(label, ':')
  })

  let data: Record<string, any> = {...paging, ...defaultFilters, ...filter}

  // remove empty keys
  Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
  console.log('data', data)

  const result = await Utility.callEndpoint<{
    items: AdherenceWeeklyReport[]
    total: number
  }>(endpoint, 'POST', data, token)

  return {items: result.data.items, total: result.data.total}
}

async function getAdherenceForParticipant(
  studyId: string,
  userId: string,
  token: string
): Promise<AdherenceDetailReport> {
  const endpoint = constants.endpoints.adherenceDetail
    .replace(':studyId', studyId)
    .replace(':userId', userId)
  const result = await Utility.callEndpoint<any>(endpoint, 'GET', {}, token)
  return result.data
}

const AdherenceService = {
  getAdherenceForParticipant,
  getAdherenceForWeek,
  getAdherenceForWeekForUsers,
  getAdherenceStatsForWeek,
  COMPLIANCE_THRESHOLD,
}

export default AdherenceService
