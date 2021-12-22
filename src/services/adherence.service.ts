import {EventStreamAdherenceReport} from '@typedefs/types'
import Utility from '../helpers/utility'
import constants from '../types/constants'

const AdherenceService = {
  getAdherenceForParticipant,
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

export default AdherenceService
