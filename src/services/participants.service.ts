import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { ParticipantAccountSummary } from '../types/types'

async function getParticipants(
  studyIdentifier: string,
  token: string,
): Promise<ParticipantAccountSummary[]> {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':id',
    studyIdentifier,
  )
  const result = await callEndpoint<{ items: ParticipantAccountSummary[] }>(
    endpoint,
    'POST',
    {},
    token,
  )
  /*const mappedResult = result.data.items.map(item => {
    return { ...item, studyExternalId: item.externalIds[studyIdentifier] }
  })*/

  return result.data.items
}

async function addParticipant(
  studyIdentifier: string,
  token: string,
  options: {phone?: string, externalId: string}

): Promise<string> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,

  )
  const data= {
    appId: constants.constants.APP_ID,
    externalIds: {[studyIdentifier]: options.externalId}
  }


  const result = await callEndpoint<{identifier: string}>(
    endpoint,
    'POST',
    data,
    token,
  )
  return result.data.identifier
}

const ParticipantService = {
  getParticipants, addParticipant
}

export default ParticipantService
