import { callEndpoint } from '../helpers/utility'
import constants from '../types/constants'
import {
  EditableParticipantData,
  ParticipantAccountSummary,
  StringDictionary
} from '../types/types'

export const CLINIC_EVENT_ID = 'clinic_visit'
export const JOINED_EVENT_ID = 'created_on'

const IS_TEST: boolean = true



// gets clinic visits and join events for participants with the specified ids
async function getRelevantEventsForParticipans(
  studyIdentifier: string,
  token: string,
  participantId: string[],
): Promise<StringDictionary<{ clinicVisitDate: string; joinedDate: string }>> {
  //transform ids into promises
  const promises = participantId.map(async pId => {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', pId)

    const apiCall = await callEndpoint<{ items: any[] }>(
      endpoint,
      'GET',
      {},
      token,
    )
    return { participantId: pId, apiCall: apiCall }
  })

  //execute promises and reduce array to dictionary object
  return Promise.all(promises).then(result => {
    const items = result.reduce((acc, item) => {
      //clinic visits
      const clinicVisitDate = item.apiCall.data.items.find(
        event => event.eventId === `custom:${CLINIC_EVENT_ID}`,
      )
      //joinedDate eventIds will change
      let joinedDate = item.apiCall.data.items.find(
        event => event.eventId === JOINED_EVENT_ID,
      )

      //ALINA: remove when real event. Just introducing randomness
      if (Math.random() > 0.5) joinedDate = undefined

      return {
        ...acc,
        [item.participantId]: {
          clinicVisitDate: clinicVisitDate?.timestamp || '',
          joinedDate: joinedDate?.timestamp || '',
        },
      }
    }, {})
    return items
  })
}

//gets all pages for participants. Used with the 'all' functionality
async function getAllParticipants(studyIdentifier: string, token: string) {
  const pageSize = 50
  const result = await getParticipants(studyIdentifier, token, pageSize, 0)
  const pages = Math.ceil(result.total / pageSize)
  if (pages < 2) {
    return result
  }

  const queries: Promise<any>[] = []
  for (let i = 0; i < pages; i++) {
    queries.push(
      getParticipants(studyIdentifier, token, pageSize, i * pageSize),
    )
  }
  return Promise.all(queries).then(result => {
    console.log(result)
    const allItems = [].concat.apply(
      [],
      result.map(i => i.items),
    )

    return { items: allItems, total: result[0].total }
  })
}

// get a page of participants
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

  const data = {
    pageSize: pageSize,
    offsetBy: offsetBy,
    noneOfGroups: IS_TEST ? undefined : ['test_user'],
  }

  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', data, token)

  //ALINA TODO: once there is a filter we can use that
  const filteredData = result.data.items.filter(item =>
    item.studyIds?.includes(studyIdentifier),
  )
  return { items: filteredData, total: result.data.total }
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
      `${endpoint}/${partipantID}`,
      'GET',
      {},
      token,
    )
    return result.data
  } catch (e) {
    // If the participant is not found, return null.
    if (e.statusCode === 404) {
      return null
    }
    throw new Error(e)
  }
}

//deletes single participant. NOTE: this is delete and NOT withdraw. Currently only works on test users
async function deleteParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
): Promise<string> {
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )}/${participantId}`

  const result = await callEndpoint<{ identifier: string }>(
    endpoint,
    'DELETE',
    {},
    token,
  )
  return result.data.identifier
}

//gets a list of withdrawn participants
async function getEnrollmentsWithdrawn(studyIdentifier: string, token: string) {
  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier,
  )}`

  const result = await callEndpoint<{ items: any }>(
    endpoint,
    'GET',
    { enrollmentFilter: 'withdrawn', includeTesters: IS_TEST },
    token,
  )
  return result.data.items
}

//withdraws participant
async function withdrawParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
  note?: string,
): Promise<string> {
  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier,
  )}/${participantId}${
    note ? '?withdrawalNote=' + encodeURIComponent(note) + '' : ''
  }`

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

//adds a participant

async function addParticipant(
  studyIdentifier: string,
  token: string,
  options: EditableParticipantData,
): Promise<string> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )
  const data: StringDictionary<any> = {
    appId: constants.constants.APP_ID,

    dataGroups: IS_TEST ? ['test_user'] : undefined,
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
      eventId: CLINIC_EVENT_ID,
      timestamp: new Date(options.clinicVisitDate).toISOString(),
    }

    await callEndpoint<{ identifier: string }>(endpoint, 'POST', data, token)
  }

  return userId
}

//used when editing a participant
async function updateNotesAndClinicVisitForParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
  options: EditableParticipantData,
): Promise<string> {
  // update notes
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )}/${participantId}`

  const data = {
    notes: options.notes,
  }

  await callEndpoint<ParticipantAccountSummary>(endpoint, 'POST', data, token)

  // update events
  let eventEndpoint = constants.endpoints.events
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  if (options.clinicVisitDate) {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', participantId)
    const data = {
      eventId: CLINIC_EVENT_ID,
      timestamp: new Date(options.clinicVisitDate).toISOString(),
    }

    await callEndpoint<{ identifier: string }>(endpoint, 'POST', data, token)
  } else {
    console.log('deleting')
    eventEndpoint = eventEndpoint + CLINIC_EVENT_ID
    await callEndpoint<{ identifier: string }>(endpoint, 'DELETE', {}, token)
  }

  return participantId
}

async function getRequestInfoForParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
) {
  //transform ids into promises

  const endpoint = constants.endpoints.requestInfo
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  const info = await callEndpoint<{ signedInOn: any }>(
    endpoint,
    'GET',
    {},
    token,
  )
  return info.data
}

const ParticipantService = {
  addParticipant,
  deleteParticipant,
  getAllParticipants,
  getRelevantEventsForParticipans,
  getEnrollmentsWithdrawn,
  getParticipantWithId,
  getParticipants,
  getRequestInfoForParticipant,
  updateNotesAndClinicVisitForParticipant,
  withdrawParticipant,
}

export default ParticipantService
