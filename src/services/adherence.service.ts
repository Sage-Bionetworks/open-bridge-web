import {
  AdherenceWeeklyReport,
  EventStreamAdherenceReport,
} from '@typedefs/types'
import Utility from '../helpers/utility'
import constants from '../types/constants'

export const COMPLIANCE_THRESHOLD = 50

export type WeeklyAdherenceFilter = {
  idFilter?: string
  labelFilters?: string[]
  completionStatus?: string[]
  adherenceMax?: number
  adherenceMin?: number
  progressionFilters?: string[]
}

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

async function getAdherenceForWeek(
  studyId: string,
  currentPage: number,
  pageSize: number,
  filter: WeeklyAdherenceFilter,

  token: string
): Promise<{total: number; items: AdherenceWeeklyReport[]}> {
  console.log('getting adherence')
  console.log('startint priming - only use if need immediate data for test')
  /* const enr = await ParticipantService.getEnrollmentByEnrollmentType(
    studyId,
    token!,
    'enrolled',
    true
  )

  // ALINA TODO: remove when batched report is done -- priming 
  const ids = enr.items.map(p => p.participant.identifier)
  const prime = await getAdherenceForWeekForUsers(studyId, ids, token)
  console.log('starting all')
  /* end of priming */

  const endpoint = constants.endpoints.adherenceWeekly.replace(
    ':studyId',
    studyId
  )
  //create query
  /*
  adherenceMax: 100
  adherenceMin: 0
  idFilter: "123"
  offsetBy: 0
  labelFilters: ["Week #2"]
offsetBy: 0
pageSize: 50
progressionFilters: ["unstarted", "in_progress", "done"]
  pageSize: 50
  testFilter: "both"*/

  const defaultFilters = {
    adherenceMax: 100,
    adherenceMin: 0,
    testFilter: 'both',
  }
  console.log('filter', filter)
  const paging = {
    pageSize: pageSize || undefined,
    offsetBy: pageSize > 0 ? (currentPage - 1) * pageSize : undefined,
  }
  console.log('paging', paging)

  let data: Record<string, any> = {...paging, ...defaultFilters, ...filter}

  // remove empty keys
  Object.keys(data).forEach(key => data[key] === undefined && delete data[key])
  console.log('data', data)

  const result = await Utility.callEndpoint<{
    items: AdherenceWeeklyReport[]
    total: number
  }>(endpoint, 'POST', data, token)
  console.log(result.data)
  //@ts-ignore
  console.log('updated')
  return {items: result.data.items, total: result.data.total}
}

async function getAdherenceForParticipant(
  studyId: string,
  userId: string,
  token: string
): Promise<EventStreamAdherenceReport> {
  console.log('getting particiapnt')
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
  COMPLIANCE_THRESHOLD,
}

export default AdherenceService
