import {
  AdherenceWeeklyReport,
  EventStreamAdherenceReport,
} from '@typedefs/types'
import Utility from '../helpers/utility'
import constants from '../types/constants'

export const COMPLIANCE_THRESHOLD = 50

async function getAdherenceForWeek(
  studyId: string,
  userIds: string[],
  token: string
): Promise<AdherenceWeeklyReport[]> {
  const weeklyPromises = userIds.map(userId => {
    const endpoint = constants.endpoints.adherenceWeekly
      .replace(':studyId', studyId)
      .replace(':userId', userId)
    return Utility.callEndpoint<any>(endpoint, 'GET', {}, token)
  })

  const result = (await Promise.all(weeklyPromises)).map(result => result.data)

  return result
}

async function getAdherenceForParticipant(
  studyId: string,
  userId: string,
  token: string
): Promise<EventStreamAdherenceReport> {
  const endpoint = constants.endpoints.adherenceDetail
    .replace(':studyId', studyId)
    .replace(':userId', userId)
  const result = await Utility.callEndpoint<any>(endpoint, 'GET', {}, token)
  return result.data
}

const AdherenceService = {
  getAdherenceForParticipant,
  getAdherenceForWeek,
  COMPLIANCE_THRESHOLD,
}

export default AdherenceService
