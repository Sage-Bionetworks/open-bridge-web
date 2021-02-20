import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import {
  ParticipantAccountSummary,
  Phone,
  StringDictionary
} from '../types/types'

export type AddParticipantType = {
  clinicVisitDate?: Date
  notes?: string
  externalId?: string
  phone?: Phone
}
async function getClinicVisitsForParticipants(
  studyIdentifier: string,
  token: string,
  ids: string[],
) {
  const endpoints = ids.map(userId => {
    const result = {
      endpoint: constants.endpoints.events
        .replace(':studyId', studyIdentifier)
        .replace(':userId', userId),
      userId,
    }
    return result
  })

  const promises = endpoints.map(async endpoint => {
    const apiCall = await callEndpoint<{ items: any[] }>(
      endpoint.endpoint,
      'GET',
      { type: 'clinic_visit' },
      token,
    )
    return { userId: endpoint.userId, apiCall: apiCall }
  })
 
  return Promise.all(promises).then(result => {
    const items = result.reduce((acc, item) => {
      const record = {
        events: item.apiCall.data.items.filter(
          event => event.eventId === 'custom:clinic_visit',
        ),
        clinicVisit: '',
      }
      if (record.events?.length) {
        record.clinicVisit = record.events[0].timestamp
      }
      return { ...acc, [item.userId]: record.clinicVisit }
    }, {})
    return items
  })
}
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
    { pageSize: 100 },
    token,
  )

  /*const mappedResult = result.data.items.map(item => {
    return { ...item, studyExternalId: item.externalIds[studyIdentifier] }
  })*/

  return result.data.items
}

async function deleteParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
  dataGroups: string[],
): Promise<string> {
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )}/${participantId}`
  const data = {
    dataGroups: dataGroups,
  }

  const result = await callEndpoint<{ identifier: string }>(
    endpoint,
    'DELETE',
    {},
    token,
  )
  return result.data.identifier
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
  options: AddParticipantType,
): Promise<string> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )
  const data: StringDictionary<any> = {
    appId: constants.constants.APP_ID,

    dataGroups: ['test_user'],
  }
  if (options.phone) {
    data.phone = options.phone
  }
  if (options.externalId) {
    data.externalIds = { [studyIdentifier]: options.externalId }
  }

  const result = await callEndpoint<{ identifier: string }>(
    endpoint,
    'POST',
    data,
    token,
  )

  const userId = result.data.identifier

  if (options.clinicVisitDate) {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', userId)
    const data = {
      eventId: 'clinic_visit',
      timestamp: new Date(options.clinicVisitDate).toISOString(),
    }

    const eventResult = await callEndpoint<{ identifier: string }>(
      endpoint,
      'POST',
      data,
      token,
    )
  }

  return userId
}

const ParticipantService = {
  getParticipants,
  addParticipant,
  deleteParticipant,
  getClinicVisitsForParticipants,
}

export default ParticipantService
