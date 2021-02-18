import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import { ParticipantAccountSummary, Phone, StringDictionary } from '../types/types'

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
    {pageSize: 100},
    token,
  )
  /*const mappedResult = result.data.items.map(item => {
    return { ...item, studyExternalId: item.externalIds[studyIdentifier] }
  })*/

  return result.data.items
}


/*async function updateParticipantGroup(
  studyIdentifier: string,
  token: string,
  participantId: string,
  dataGroups: string[]

): Promise<string> {
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,

  )}/${participantId}`
  const data= {

    dataGroups:dataGroups 
  }


  const result = await callEndpoint<{identifier: string}>(
    endpoint,
    'DELETE',
    {},
    token,
  )
  return result.data.identifier
}*/

async function addParticipant(
  studyIdentifier: string,
  token: string,
  options: {externalId: string, dataGroups?: string[], phone?: Phone}

): Promise<string> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,

  )
  const data: StringDictionary<any>= {
    appId: constants.constants.APP_ID,
    externalIds: {[studyIdentifier]: options.externalId},
    dataGroups: options.dataGroups || []
  }
  if (options.phone) {
    data.phone = options.phone
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
