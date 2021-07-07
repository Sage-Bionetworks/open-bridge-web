import _ from 'lodash'
import {callEndpoint, generateNonambiguousCode} from '../helpers/utility'
import constants from '../types/constants'
import {
  EditableParticipantData,
  EnrolledAccountRecord,
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
  StringDictionary,
} from '../types/types'

export const CLINIC_EVENT_ID = 'clinic_visit'
export const JOINED_EVENT_ID = 'first_sign_in'
export const LINK_SENT_EVENT_ID = 'install_link_sent'
export const EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING = 'withdrawn'

export type ParticipantRelevantEvents = {
  clinicVisitDate: string
  joinedDate: string
  smsDate: string
}

//formats participant in the format required by datagrid
function mapWithdrawnParticipant(
  p: EnrolledAccountRecord,
  studyIdentifier: string
): ExtendedParticipantAccountSummary {
  return {
    ...p.participant,
    externalId: formatExternalId(studyIdentifier, p.externalId),
    id: p.participant.identifier,
    dateWithdrawn: p.withdrawnOn,
    withdrawalNote: p.withdrawalNote,
    externalIds: {
      [studyIdentifier]: formatExternalId(studyIdentifier, p.externalId),
    },
  }
}

//backendExternalId = studyId:externalId
function makeBackendExternalId(studyId: string, externalId: string) {
  return `${externalId}:${studyId}`
}

export function formatExternalId(studyId: string, externalId: string) {
  if (!externalId) {
    return EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING
  }
  let forDisplay = externalId.replace(`:${studyId}`, '')
  return forDisplay.length !== 6
    ? forDisplay
    : `${forDisplay.substr(0, 3)}-${forDisplay.substr(3, 3)}`
}

// gets clinic visits and join events for participants with the specified ids
async function getRelevantEventsForParticipants(
  studyIdentifier: string,
  token: string,
  participantId: string[]
): Promise<StringDictionary<ParticipantRelevantEvents>> {
  //transform ids into promises
  const promises = participantId.map(async pId => {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', pId)

    const apiCall = await callEndpoint<{items: any[]}>(
      endpoint,
      'GET',
      {},
      token
    )
    return {participantId: pId, apiCall: apiCall}
  })

  //execute promises and reduce array to dictionary object
  return Promise.all(promises).then(result => {
    const items = result.reduce((acc, item) => {
      //clinic visits
      const clinicVisitDate = item.apiCall.data.items.find(
        event => event.eventId === `custom:${CLINIC_EVENT_ID}`
      )
      //joinedDate eventIds will change
      let joinedDate = item.apiCall.data.items.find(
        event => event.eventId === `custom:${JOINED_EVENT_ID}` //TODO: this will not be custom
      )

      let smsDate = item.apiCall.data.items.find(
        event => event.eventId === `custom:${LINK_SENT_EVENT_ID}` //TODO: this will not be custom
      )
      return {
        ...acc,
        [item.participantId]: {
          clinicVisitDate: clinicVisitDate?.timestamp || '',
          joinedDate: joinedDate?.timestamp || '',
          smsDate: smsDate?.timestamp || '',
        },
      }
    }, {})
    return items
  })
}

async function getAllPages<T>(
  fn: Function,
  args: any[]
): Promise<{items: T[]; total: number}> {
  const pageSize = 50
  const result = await fn(...args, pageSize, 0)
  const pages = Math.ceil(result.total / pageSize)
  if (pages < 2) {
    return result
  }

  const queries: Promise<{items: T[]; total: number}>[] = []
  for (let i = 0; i < pages; i++) {
    queries.push(fn(...args, pageSize, i * pageSize))
  }
  return Promise.all(queries).then(result => {
    const allItems1 = result.map(i => i.items as T[])
    const allItems = allItems1.flat()

    return {items: allItems, total: result[0].total}
  })
}

// get participants
//if page and offset not specified - get all
async function getTestParticipants(
  studyIdentifier: string,
  token: string,
  pageSize?: number,
  offsetBy?: number
): Promise<{
  items: ParticipantAccountSummary[]
  total: number
}> {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':id',
    studyIdentifier
  )

  const data = {
    pageSize: pageSize,
    offsetBy: offsetBy,
    enrolledInStudyId: studyIdentifier,
    allOfGroups: ['test_user'],
  }

  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', data, token)

  const mappedData = result.data.items.map(p => ({
    ...p,
    externalId: formatExternalId(
      studyIdentifier,
      p.externalIds[studyIdentifier]
    ),
  }))

  //ALINA TODO: once there is a filter we can use that
  /*.filter(item =>
    item.studyIds?.includes(studyIdentifier),
  )*/
  return {items: mappedData, total: result.data.total}

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

async function getActiveParticipantById(
  studyIdentifier: string,
  token: string,
  participantId: string
): Promise<ParticipantAccountSummary | null> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )
  try {
    const result = await callEndpoint<ParticipantAccountSummary>(
      `${endpoint}/${participantId}`,
      'GET',
      {},
      token
    )
    return {
      ...result.data,
      externalId: formatExternalId(
        studyIdentifier,
        result.data.externalIds[studyIdentifier]
      ),
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
  participantId: string
): Promise<string> {
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )}/${participantId}`

  const result = await callEndpoint<{identifier: string}>(
    endpoint,
    'DELETE',
    {},
    token
  )
  return result.data.identifier
}

async function getParticipants(
  studyIdentifier: string,
  token: string,
  participantType: ParticipantActivityType,
  pageSize: number,
  offsetBy: number
): Promise<{items: ExtendedParticipantAccountSummary[]; total: number}> {
  // get enrollment for non test account
  if (!pageSize) {
    return getAllPages<ParticipantAccountSummary>(getParticipants, [
      studyIdentifier,
      token,
      participantType,
    ])
  }

  if (participantType === 'TEST') {
    return getTestParticipants(studyIdentifier, token, pageSize, offsetBy)
  }

  const queryFilter =
    participantType === 'ACTIVE'
      ? 'enrolled'
      : participantType === 'WITHDRAWN'
      ? 'withdrawn'
      : 'all'
  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier
  )}`
  const data = {
    enrollmentFilter: queryFilter,
    pageSize: pageSize,
    offsetBy: offsetBy,
    includeTesters: false,
  }

  const result = (
    await callEndpoint<{
      items: EnrolledAccountRecord[]
      total: number
    }>(endpoint, 'GET', data, token)
  ).data

  let resultItems: ParticipantAccountSummary[] = []
  if (queryFilter === 'withdrawn') {
    resultItems = result.items.map(p =>
      mapWithdrawnParticipant(p, studyIdentifier)
    )
  }
  if (queryFilter === 'enrolled') {
    const participantPromises = result.items.map(i =>
      getActiveParticipantById(studyIdentifier, token, i.participant.identifier)
    )
    const resolvedParticipants = await Promise.all(participantPromises)
    resultItems = resolvedParticipants.filter(
      p => p !== null
    ) as ParticipantAccountSummary[]
  }

  return {items: resultItems, total: result.total}
}

async function getAllParticipantsInEnrollmentType(
  studyIdentifier: string,
  token: string,
  enrollmentType: string,
  includeTesters?: boolean,
  pageSize?: number,
  offsetBy?: number
) {
  if (!pageSize) {
    return getAllPages<EnrolledAccountRecord>(
      getAllParticipantsInEnrollmentType,
      [studyIdentifier, token, enrollmentType, includeTesters || false]
    )
  }
  const endpoint = `${constants.endpoints.studies}/${studyIdentifier}/enrollments`
  const body = {
    enrollmentFilter: enrollmentType,
    includeTesters: includeTesters || false,
    pageSize: pageSize,
    offsetBy: offsetBy ? offsetBy : 0,
  }
  const result = await callEndpoint<{
    items: EnrolledAccountRecord[]
    total: number
  }>(endpoint, 'GET', body, token)
  return {items: result.data.items, total: result.data.total}
}

async function getNumEnrolledParticipants(
  studyIdentifier: string,
  token: string
) {
  const endpoint = `${constants.endpoints.studies}/${studyIdentifier}/enrollments`
  const body = {
    enrollmentFilter: 'enrolled',
  }
  const result = await callEndpoint<{total: number}>(
    endpoint,
    'GET',
    body,
    token
  )
  return result.data.total
}

async function getEnrollmentById(
  studyIdentifier: string,
  token: string,
  participantId: string,
  participantType: ParticipantActivityType
) {
  const endpoint = constants.endpoints.enrollmentsForUser
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)
    .trim()
  try {
    const result = await callEndpoint<{items: EnrolledAccountRecord[]}>(
      endpoint,
      'GET',
      {},
      token
    )
    const filteredRows = result.data.items.filter(
      p => p.studyId === studyIdentifier
    )

    if (_.isEmpty(filteredRows)) {
      return null
    }
    const participant = filteredRows[0]
    const recordFromParticipantApi = await getActiveParticipantById(
      studyIdentifier,
      token,
      participant.participant.identifier
    )

    const isWithdrawn = participant.withdrawnOn !== undefined
    const isTestUser = recordFromParticipantApi?.dataGroups?.includes(
      'test_user'
    )
    if (participantType === 'WITHDRAWN' && (!isWithdrawn || isTestUser)) {
      return null
    }
    if (participantType === 'ACTIVE' && (isWithdrawn || isTestUser)) {
      return null
    }

    if (participantType === 'TEST' && !isTestUser) {
      return null
    }

    if (participant.withdrawnOn && participantType !== 'TEST') {
      return mapWithdrawnParticipant(filteredRows[0], studyIdentifier)
    } else {
      return getActiveParticipantById(
        studyIdentifier,
        token,
        filteredRows[0].participant.identifier
      )
    }
  } catch (e) {
    // If the participant is not found, return null.
    if (e.statusCode === 404) {
      return null
    }
    throw new Error(e)
  }
}

async function participantSearchUsingExternalId(
  studyIdentifier: string,
  token: string,
  externalId: string,
  participantType: ParticipantActivityType
) {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':id',
    studyIdentifier
  )
  const queryFilter =
    participantType === 'ACTIVE'
      ? 'enrolled'
      : participantType === 'WITHDRAWN'
      ? 'withdrawn'
      : 'all'
  const noneOfGroups = []
  if (participantType !== 'TEST') {
    noneOfGroups.push('test_user')
  }
  const body = {
    externalIdFilter: externalId,
    enrollment: queryFilter,
    noneOfGroups: noneOfGroups,
  }
  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', body, token)
  return result.data
}

async function participantSearchUsingPhoneNumber(
  studyIdentifier: string,
  token: string,
  phoneNumber: string,
  participantType: ParticipantActivityType
) {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':id',
    studyIdentifier
  )
  const queryFilter =
    participantType === 'ACTIVE'
      ? 'enrolled'
      : participantType === 'WITHDRAWN'
      ? 'withdrawn'
      : 'all'
  const noneOfGroups = []
  if (participantType !== 'TEST') {
    noneOfGroups.push('test_user')
  }
  const body = {
    phoneFilter: phoneNumber,
    enrollment: queryFilter,
    noneOfGroups: noneOfGroups,
  }
  const result = await callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', body, token)
  return result.data
}

//withdraws participant
async function withdrawParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
  note?: string
): Promise<string> {
  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier
  )}/${participantId}${
    note ? '?withdrawalNote=' + encodeURIComponent(note) + '' : ''
  }`

  const result = await callEndpoint<{identifier: string}>(
    endpoint,
    'DELETE',
    {},
    token
  )

  return result.data.identifier
}

async function updateParticipantGroup(
  studyIdentifier: string,
  token: string,
  participantId: string,
  dataGroups: string[]
): Promise<string> {
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )}/${participantId}`
  const data = {
    dataGroups: dataGroups,
  }

  const result = await callEndpoint<{identifier: string}>(
    endpoint,
    'POST',
    data,
    token
  )
  return result.data.identifier
}

//adds a participant

async function addParticipant(
  studyIdentifier: string,
  token: string,
  options: EditableParticipantData,
  isTestUser?: boolean
): Promise<string> {
  const endpoint = constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )

  const data: StringDictionary<any> = {
    appId: constants.constants.APP_ID,
  }

  //if (options.phone) {
  data.phone = options.phone
  data.note = options.note
  data.clinicVisitDate = options.clinicVisitDate
  //}
  if (isTestUser) {
    data.dataGroups = ['test_user']
  }
  if (options.externalId) {
    const backEndFormatExternalId = makeBackendExternalId(
      studyIdentifier,
      options.externalId
    )
    data.externalIds = {[studyIdentifier]: backEndFormatExternalId}
    data.password = backEndFormatExternalId
  }

  const result = await callEndpoint<{identifier: string}>(
    endpoint,
    'POST',
    data,
    token
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

    await callEndpoint<{identifier: string}>(endpoint, 'POST', data, token)
  }

  return userId
}

// used for the preview screen in study builder
async function addTestParticipant(
  studyIdentifier: string,
  token: string
): Promise<string> {
  return addParticipant(
    studyIdentifier,
    token,
    {externalId: generateNonambiguousCode(6)},
    true
  )
}

async function updateParticipantNote(
  studyIdentifier: string,
  token: string,
  participantId: string,
  note?: string
) {
  // update note
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )}/${participantId}`
  const data = {
    note: note,
  }
  await callEndpoint<ParticipantAccountSummary>(endpoint, 'POST', data, token)
  return participantId
}

async function updateParticipantClinicVisit(
  studyIdentifier: string,
  token: string,
  participantId: string,
  clinicVisitDate?: Date
) {
  let eventEndpoint = constants.endpoints.events
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  if (clinicVisitDate) {
    // if we have clinicVisitDate - update it
    const data = {
      eventId: CLINIC_EVENT_ID,
      timestamp: new Date(clinicVisitDate).toISOString(),
    }

    await callEndpoint<{identifier: string}>(eventEndpoint, 'POST', data, token)
  } else {
    // if it is empty - delete it
    eventEndpoint = eventEndpoint + CLINIC_EVENT_ID
    await callEndpoint<{identifier: string}>(eventEndpoint, 'DELETE', {}, token)
  }
  return participantId
}

async function getRequestInfoForParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string
) {
  //transform ids into promises
  const endpoint = constants.endpoints.requestInfo
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  const info = await callEndpoint<{signedInOn: any}>(endpoint, 'GET', {}, token)
  return info.data
}

const ParticipantService = {
  addParticipant,
  addTestParticipant,
  deleteParticipant,
  formatExternalId,
  getRelevantEventsForParticipants,
  getNumEnrolledParticipants,
  getAllParticipantsInEnrollmentType,
  getEnrollmentById,
  getActiveParticipantById,
  getParticipants,
  participantSearchUsingExternalId,
  participantSearchUsingPhoneNumber,
  getRequestInfoForParticipant,
  updateParticipantGroup,
  updateParticipantNote,
  updateParticipantClinicVisit,
  withdrawParticipant,
}

export default ParticipantService
