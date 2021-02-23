import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import {
  ParticipantAccountSummary,
  Phone,
  StringDictionary,
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
  participantId: string[],
) {
  //transform ids into promises
  const promises = participantId.map(async pId => {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', pId)

    const apiCall = await callEndpoint<{ items: any[] }>(
      endpoint,
      'GET',
      { type: 'clinic_visit' },
      token,
    )
    return { participantId: pId, apiCall: apiCall }
  })

  //execute promises and reduce array to dictionary object
  return Promise.all(promises).then(result => {
    const items = result.reduce((acc, item) => {
      //only need clinic visits
      const clinicVisitEvents = item.apiCall.data.items.filter(
        event => event.eventId === 'custom:clinic_visit',
      )

      const clinicVisitDate = clinicVisitEvents?.length
        ? clinicVisitEvents[0].timestamp
        : ''

      return { ...acc, [item.participantId]: clinicVisitDate }
    }, {})
    return items
  })
}

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
  getParticipantWithId,
  deleteParticipant,
  getClinicVisitsForParticipants,
}

export default ParticipantService
