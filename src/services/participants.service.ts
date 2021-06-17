import { callEndpoint, generateNonambiguousCode } from '../helpers/utility'
import constants from '../types/constants'
import {
  EditableParticipantData,
  EnrolledAccountRecord,
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  StringDictionary
} from '../types/types'

export const CLINIC_EVENT_ID = 'clinic_visit'
export const JOINED_EVENT_ID = 'created_on'

const IS_TEST: boolean = true

//formats participant in the format required by datagrid
function mapWithdrawnParticipant(
  p: EnrolledAccountRecord,
  studyIdentifier: string,
): ExtendedParticipantAccountSummary {
  return {
    ...p.participant,
    externalId: p.externalId,
    id: p.participant.identifier,
    dateWithdrawn: p.withdrawnOn,
    withdrawalNote: p.withdrawalNote,
    externalIds: { [studyIdentifier]: p.externalId },
  }
}

//backendExternalId = studyId:externalId
function makeBackendExternalId (studyId: string, externalId: string) {return `${studyId}:${externalId}`}

function formatExternalId (studyId: string, externalId: string) {
  return externalId.replace(`${studyId}:`, '')
}

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

async function getAllPages<T>(
  fn: Function,
  args: any[],
): Promise<{ items: T[]; total: number }> {
  const pageSize = 50
  const result = await fn(...args, pageSize, 0)
  const pages = Math.ceil(result.total / pageSize)
  if (pages < 2) {
    return result
  }

  const queries: Promise<{ items: T[]; total: number }>[] = []
  for (let i = 0; i < pages; i++) {
    queries.push(fn(...args, pageSize, i * pageSize))
  }
  return Promise.all(queries).then(result => {
    const allItems1 = result.map(i => i.items as T[])
    const allItems = allItems1.flat()

    return { items: allItems, total: result[0].total }
  })
}

//gets all pages for participants. Used with the 'all' functionality
async function getAllParticipants(
  studyIdentifier: string,
  token: string,
): Promise<{
  items: ParticipantAccountSummary[]
  total: number
}> {
  return getAllPages<ParticipantAccountSummary>(getParticipants, [
    studyIdentifier,
    token,
  ])
}

async function getAllEnrollmentsWithdrawn(
  studyIdentifier: string,
  token: string,
): Promise<{ items: ExtendedParticipantAccountSummary[]; total: number }> {
  return getAllPages<ExtendedParticipantAccountSummary>(
    getEnrollmentsWithdrawn,
    [studyIdentifier, token],
  )
}
// get a page of participants
async function getParticipants(
  studyIdentifier: string,
  token: string,
  pageSize: number,
  offsetBy: number,
): Promise<{
  items: ParticipantAccountSummary[]
  total: number
}> {
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

  const mappedData = result.data.items.map(p => ({
    ...p,
    externalId: formatExternalId(studyIdentifier, p.externalIds[studyIdentifier])
  }))

  //ALINA TODO: once there is a filter we can use that
  /*.filter(item =>
    item.studyIds?.includes(studyIdentifier),
  )*/
  return { items: mappedData, total: result.data.total }

  /* ALINA: 3/9 -- uncomment this for testing delete failures */
  /*
  const data = {
    pageSize: pageSize,
    offsetBy: offsetBy,
    noneOfGroups: ['test_user'],
  }

  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', data, token)

  //ALINA TODO: once there is a filter we can use that
  const filteredDataReal = result.data.items.map(p => ({...p, externalId: p.externalIds[studyIdentifier], real: 'REAL'})).filter(item =>
    item.studyIds?.includes(studyIdentifier),
  )
  const totalReal =  result.data.total

//@ts-ignore
data.allOfGroups =  ['test_user']
data.noneOfGroups =  []

  const resultTest = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', data, token)

  //ALINA TODO: once there is a filter we can use that
  const filteredDataTest = resultTest.data.items.map(p => ({...p, externalId: p.externalIds[studyIdentifier],  real: 'TEST'})).filter(item =>
    item.studyIds?.includes(studyIdentifier),
  )

  const totalTest =  resultTest.data.total
  return { items: [...filteredDataTest, ...filteredDataReal], total: totalTest*1+ totalReal }*/
}

async function getParticipantById(
  studyIdentifier: string,
  token: string,
  participantId: string,
): Promise<ParticipantAccountSummary | null> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )
  try {
    const result = await callEndpoint<ParticipantAccountSummary>(
      `${endpoint}/${participantId}`,
      'GET',
      {},
      token,
    )
    return {
      ...result.data,
      externalId: formatExternalId(studyIdentifier, result.data.externalIds[studyIdentifier])
    }
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
async function getEnrollmentsWithdrawn(
  studyIdentifier: string,
  token: string,
  pageSize: number,
  offsetBy: number,
): Promise<{ items: ExtendedParticipantAccountSummary[]; total: number }> {
  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier,
  )}`
  const data = {
    enrollmentFilter: 'withdrawn',
    pageSize: pageSize,
    offsetBy: offsetBy,
    includeTesters: IS_TEST,
  }

  const result = await callEndpoint<{
    items: EnrolledAccountRecord[]
    total: number
  }>(endpoint, 'GET', data, token)
  const resultItems = result.data.items.map(p =>
    mapWithdrawnParticipant(p, studyIdentifier),
  )

  return { items: resultItems, total: result.data.total }
}

async function getEnrollmentsWithdrawnById(
  studyIdentifier: string,
  token: string,
  participantId: string,
) {
  const endpoint = constants.endpoints.enrollmentsForUser
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)
  try {
    const result = await callEndpoint<{ items: EnrolledAccountRecord[] }>(
      endpoint,
      'GET',
      {},
      token,
    )
    const filteredRows = result.data.items
      .filter(p => p.studyId === studyIdentifier)
      .map(p => mapWithdrawnParticipant(p, studyIdentifier))
    return filteredRows?.length ? filteredRows[0] : null
  } catch (e) {
    // If the participant is not found, return null.
    if (e.statusCode === 404) {
      return null
    }
    throw new Error(e)
  }
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

async function updateParticipantGroup(
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
    'POST',
    data,
    token,
  )
  return result.data.identifier
}

// used for the preview screen in study builder
async function addTestParticipantForPreview(
  studyIdentifier: string,
  token: string,
): Promise<string> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )
  const data: StringDictionary<any> = {
    appId: constants.constants.APP_ID,
    dataGroups: ['test_user'],
    externalIds: { [studyIdentifier]: formatExternalId(studyIdentifier, generateNonambiguousCode(6)) },
  }

  const result = await callEndpoint<{ identifier: string }>(
    endpoint,
    'POST',
    data,
    token,
  )

  return result.data.identifier
}

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

   // dataGroups: IS_TEST ? ['test_user'] : undefined,
  }

  //if (options.phone) {
    data.phone = options.phone
    data.note = options.note
    data.clinicVisitDate = options.clinicVisitDate
  //}
  if (options.externalId) {
    data.externalIds = { [studyIdentifier]: makeBackendExternalId(studyIdentifier, options.externalId) }
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
  // update note
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier,
  )}/${participantId}`

  const data = {
    note: options.note,
  }

  await callEndpoint<ParticipantAccountSummary>(endpoint, 'POST', data, token)

  // update events
  let eventEndpoint = constants.endpoints.events
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  if (options.clinicVisitDate) {
    // if we have clinicVisitDate - update it
    const data = {
      eventId: CLINIC_EVENT_ID,
      timestamp: new Date(options.clinicVisitDate).toISOString(),
    }

    await callEndpoint<{ identifier: string }>(
      eventEndpoint,
      'POST',
      data,
      token,
    )
  } else {
    // if it is empty - delete it
    eventEndpoint = eventEndpoint + CLINIC_EVENT_ID
    await callEndpoint<{ identifier: string }>(
      eventEndpoint,
      'DELETE',
      {},
      token,
    )
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
  addTestParticipantForPreview,
  deleteParticipant,
  getAllParticipants,
  getRelevantEventsForParticipans,
  getEnrollmentsWithdrawn,
  getEnrollmentsWithdrawnById,
  getAllEnrollmentsWithdrawn,
  getParticipantById,
  getParticipants,
  getRequestInfoForParticipant,
  updateNotesAndClinicVisitForParticipant,
  updateParticipantGroup,
  withdrawParticipant,
}

export default ParticipantService
