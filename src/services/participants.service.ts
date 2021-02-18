import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { ParticipantAccountSummary } from '../types/types'

async function getParticipants(
  studyIdentifier: string,
  token: string,
  pageSize: number,
  offsetBy: number,
) {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':id',
    studyIdentifier,
  )
  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(
    endpoint,
    'POST',
    {
      pageSize: pageSize,
      offsetBy: offsetBy,
    },
    token,
  )
  /*const mappedResult = result.data.items.map(item => {
    return { ...item, studyExternalId: item.externalIds[studyIdentifier] }
  })*/
  console.log('data retrieved', result)
  return { items: result.data.items, total: result.data.total }
}

async function getParticipantWithId(
  studyIdentifier: string,
  token: string,
  partipantID: string,
) {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )
  try {
    const result = await callEndpoint<ParticipantAccountSummary>(
      endpoint + '/' + partipantID,
      'GET',
      {},
      token,
    )
    return result.data
  } catch (e) {
    // If the participant is not found, return null.
    return null
  }
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
  getParticipantWithId,
}

export default ParticipantService
