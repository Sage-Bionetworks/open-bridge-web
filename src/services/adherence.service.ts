import {
  AdherenceWeeklyReport,
  EventStreamAdherenceReport,
} from '@typedefs/types'
import Utility from '../helpers/utility'
import constants from '../types/constants'
import ParticipantService from './participants.service'

export const COMPLIANCE_THRESHOLD = 50
const testJSON = [
  {
    participant: {
      identifier: 'RR8zKVA2Bi9a8MrQ796I1Ghv',
      firstName: 'Kashiyuki',
      email: 'alx.dark+Kashiyuki@sagebase.org',
      externalId: 'TestMe',
      type: 'AccountRef',
    },
    rows: [
      {
        label: 'Main Sequence 1 / Week 1 / Session #2',
        searchableLabel: ':Main Sequence 1:Week 1:Session #2:',
        sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
        sessionName: 'Session #2',
        sessionSymbol: 'Session2Triangle',
        week: 1,
        studyBurstId: 'Main Sequence',
        studyBurstNum: 1,
        type: 'WeeklyAdherenceReportRow',
      },
      {
        label: 'Week 1 / Session #2',
        searchableLabel: ':Week 1:Session #2:',
        sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
        sessionName: 'Session #2',
        sessionSymbol: 'Session2Triangle',
        week: 1,
        type: 'WeeklyAdherenceReportRow',
      },
      {
        label: 'Week 1 / Session #1',
        searchableLabel: ':Week 1:Session #1:',
        sessionGuid: 'vkWzfkNzh3b_-8lfTrXuQzLY',
        sessionName: 'Session #1',
        sessionSymbol: 'Session1Circle',
        week: 1,
        type: 'WeeklyAdherenceReportRow',
      },
      {
        label: 'Main Sequence 1 / Week 1 / Session #3',
        searchableLabel: ':Main Sequence 1:Week 1:Session #3:',
        sessionGuid: '4ohLxKVedAizpmneBYy4nn_5',
        sessionName: 'Session #3',
        sessionSymbol: 'Session3Square',
        week: 1,
        studyBurstId: 'Main Sequence',
        studyBurstNum: 1,
        type: 'WeeklyAdherenceReportRow',
      },
    ],
    weeklyAdherencePercent: 0,
    clientTimeZone: 'Europe/Paris',
    createdOn: '2022-01-24T19:37:42.369+01:00',
    byDayEntries: {
      '0': [
        {
          sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
          startDay: 0,
          startDate: '2022-01-23',
          timeWindows: [
            {
              sessionInstanceGuid: '2j04cxD63q7E9hYwRCFNSg',
              timeWindowGuid: 'k-P-G5nZ8UR_zX0-1jQNF7dJ',
              state: 'expired',
              endDay: 0,
              endDate: '2022-01-23',
              type: 'EventStreamWindow',
            },
            {
              sessionInstanceGuid: 'taDT9C6IV2XKfMgMv7tQow',
              timeWindowGuid: 'u1h1Zp8Yp8RIo-7NzBNc7br-',
              state: 'expired',
              endDay: 0,
              endDate: '2022-01-23',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
          startDay: 0,
          startDate: '2022-01-23',
          timeWindows: [
            {
              sessionInstanceGuid: '2j04cxD63q7E9hYwRCFNSg',
              timeWindowGuid: 'k-P-G5nZ8UR_zX0-1jQNF7dJ',
              state: 'expired',
              endDay: 0,
              endDate: '2022-01-23',
              type: 'EventStreamWindow',
            },
            {
              sessionInstanceGuid: 'taDT9C6IV2XKfMgMv7tQow',
              timeWindowGuid: 'u1h1Zp8Yp8RIo-7NzBNc7br-',
              state: 'expired',
              endDay: 0,
              endDate: '2022-01-23',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: 'vkWzfkNzh3b_-8lfTrXuQzLY',
          startDay: 0,
          startDate: '2022-01-23',
          timeWindows: [
            {
              sessionInstanceGuid: 'j4_06J5XdEuU-7t5_tooSg',
              timeWindowGuid: 'kUum8eg3OArXDBLgRgLHg6L2',
              state: 'unstarted',
              endDay: 27,
              endDate: '2022-02-19',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
      ],
      '1': [
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
      ],
      '2': [
        {
          sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
          startDay: 2,
          startDate: '2022-01-25',
          timeWindows: [
            {
              sessionInstanceGuid: 'Kgf9ZuxLLOR3SvshxLBiBw',
              timeWindowGuid: 'k-P-G5nZ8UR_zX0-1jQNF7dJ',
              state: 'not_yet_available',
              endDay: 2,
              endDate: '2022-01-25',
              type: 'EventStreamWindow',
            },
            {
              sessionInstanceGuid: 'bvaA86on4HTIGPM1poTmGQ',
              timeWindowGuid: 'u1h1Zp8Yp8RIo-7NzBNc7br-',
              state: 'not_yet_available',
              endDay: 2,
              endDate: '2022-01-25',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
          startDay: 2,
          startDate: '2022-01-25',
          timeWindows: [
            {
              sessionInstanceGuid: 'Kgf9ZuxLLOR3SvshxLBiBw',
              timeWindowGuid: 'k-P-G5nZ8UR_zX0-1jQNF7dJ',
              state: 'not_yet_available',
              endDay: 2,
              endDate: '2022-01-25',
              type: 'EventStreamWindow',
            },
            {
              sessionInstanceGuid: 'bvaA86on4HTIGPM1poTmGQ',
              timeWindowGuid: 'u1h1Zp8Yp8RIo-7NzBNc7br-',
              state: 'not_yet_available',
              endDay: 2,
              endDate: '2022-01-25',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: '4ohLxKVedAizpmneBYy4nn_5',
          startDay: 2,
          startDate: '2022-01-25',
          timeWindows: [
            {
              sessionInstanceGuid: 'NIOabHjEqb8z69Z5hhIbng',
              timeWindowGuid: 'lCNefGIZZOkXi7CXsFa07mjn',
              state: 'not_yet_available',
              endDay: 2,
              endDate: '2022-01-25',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
      ],
      '3': [
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
      ],
      '4': [
        {
          sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
          startDay: 4,
          startDate: '2022-01-27',
          timeWindows: [
            {
              sessionInstanceGuid: 'ezX5qzPxjsjruCUyP9AbDg',
              timeWindowGuid: 'k-P-G5nZ8UR_zX0-1jQNF7dJ',
              state: 'not_yet_available',
              endDay: 4,
              endDate: '2022-01-27',
              type: 'EventStreamWindow',
            },
            {
              sessionInstanceGuid: 'eqx4V7NxQHmgL3_w_E1fXA',
              timeWindowGuid: 'u1h1Zp8Yp8RIo-7NzBNc7br-',
              state: 'not_yet_available',
              endDay: 4,
              endDate: '2022-01-27',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: 'of80ZD4qyy9C7q80H6xlYyxX',
          startDay: 4,
          startDate: '2022-01-27',
          timeWindows: [
            {
              sessionInstanceGuid: 'ezX5qzPxjsjruCUyP9AbDg',
              timeWindowGuid: 'k-P-G5nZ8UR_zX0-1jQNF7dJ',
              state: 'not_yet_available',
              endDay: 4,
              endDate: '2022-01-27',
              type: 'EventStreamWindow',
            },
            {
              sessionInstanceGuid: 'eqx4V7NxQHmgL3_w_E1fXA',
              timeWindowGuid: 'u1h1Zp8Yp8RIo-7NzBNc7br-',
              state: 'not_yet_available',
              endDay: 4,
              endDate: '2022-01-27',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: '4ohLxKVedAizpmneBYy4nn_5',
          startDay: 4,
          startDate: '2022-01-27',
          timeWindows: [
            {
              sessionInstanceGuid: '0obA76qEeldEioajXV07Tg',
              timeWindowGuid: 'lCNefGIZZOkXi7CXsFa07mjn',
              state: 'not_yet_available',
              endDay: 4,
              endDate: '2022-01-27',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
      ],
      '5': [
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
      ],
      '6': [
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          timeWindows: [],
          type: 'EventStreamDay',
        },
        {
          sessionGuid: '4ohLxKVedAizpmneBYy4nn_5',
          startDay: 6,
          startDate: '2022-01-29',
          timeWindows: [
            {
              sessionInstanceGuid: 'lIxqwycUhyXCOrOCwbJ-Xw',
              timeWindowGuid: 'lCNefGIZZOkXi7CXsFa07mjn',
              state: 'not_yet_available',
              endDay: 6,
              endDate: '2022-01-29',
              type: 'EventStreamWindow',
            },
          ],
          type: 'EventStreamDay',
        },
      ],
    },
    type: 'WeeklyAdherenceReport',
  },
]

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
  filter: {
    labelFilter: string[]
    completionStatus: string[]
    adherenceThreshold: number
  },

  token: string
): Promise<{total: number; items: AdherenceWeeklyReport[]}> {
  console.log('getting adherence')
  console.log('startint prime')
  const enr = await ParticipantService.getEnrollmentByEnrollmentType(
    studyId,
    token!,
    'enrolled',
    true
  )

  /* ALINA TODO: remove when batched report is done -- priming */
  const ids = enr.items.map(p => p.participant.identifier)
  const prime = await getAdherenceForWeekForUsers(studyId, ids, token)
  console.log('starting all')
  /* end of priming */

  const endpoint = constants.endpoints.adherenceWeekly.replace(
    ':studyId',
    studyId
  )
  //create query

  const data: Record<string, any> = {
    pageSize: pageSize || undefined,
    offsetBy: pageSize > 0 ? (currentPage - 1) * pageSize : undefined,
    labelFilter: filter?.labelFilter.length ? filter.labelFilter : undefined,
    complianceNumber: filter?.adherenceThreshold || undefined,
    //todo  labelFilter: filter?.completionStatus.length ? filter.completionStatus : undefined,
  }

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
