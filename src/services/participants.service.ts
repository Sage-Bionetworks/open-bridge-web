import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { ParticipantAccountSummary } from '../types/types'

async function getParticipants(studyIdentifier: string, token: string) {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':id',
    studyIdentifier,
  )
  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', {}, token)
  /*const mappedResult = result.data.items.map(item => {
    return { ...item, studyExternalId: item.externalIds[studyIdentifier] }
  })*/
  return { items: result.data.items, total: result.data.total }
}

async function addParticipant(
  studyIdentifier: string,
  token: string,
): Promise<ParticipantAccountSummary[]> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )
  const result = await callEndpoint<{ items: ParticipantAccountSummary[] }>(
    endpoint,
    'POST',
    {},
    token,
  )
  const mappedResult = result.data.items.map(item => {
    return { ...item, studyExternalId: item.externalIds[studyIdentifier] }
  })

  return mappedResult
}

const ParticipantService = {
  getParticipants,
  addParticipant,
}

export default ParticipantService
