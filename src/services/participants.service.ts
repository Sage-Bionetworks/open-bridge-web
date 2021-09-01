import _ from 'lodash'
import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  EditableParticipantData,
  EnrolledAccountRecord,
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
  StringDictionary,
} from '../types/types'
import EventService from './event.service'

export const EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING = 'withdrawn'

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
    events: [],
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
  return forDisplay
  //AGENDEL - we are not formatting external ids any more 8/24
  /*return forDisplay.length !== 6
    ? forDisplay
    : `${forDisplay.substr(0, 3)}-${forDisplay.substr(3, 3)}`*/
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

  const result = await Utility.callEndpoint<{
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
    const result = await Utility.callEndpoint<ParticipantAccountSummary>(
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

  const result = await Utility.callEndpoint<{identifier: string}>(
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
    await Utility.callEndpoint<{
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

  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier
  )}`
  const body = {
    enrollmentFilter: enrollmentType,
    includeTesters: includeTesters || false,
    pageSize: pageSize,
    offsetBy: offsetBy ? offsetBy : 0,
  }
  const result = await Utility.callEndpoint<{
    items: EnrolledAccountRecord[]
    total: number
  }>(endpoint, 'GET', body, token)
  return {items: result.data.items, total: result.data.total}
}

async function getNumEnrolledParticipants(
  studyIdentifier: string,
  token: string
) {
  const endpoint = `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyIdentifier
  )}`
  const body = {
    enrollmentFilter: 'enrolled',
  }
  const result = await Utility.callEndpoint<{total: number}>(
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
  try {
    const participant = await getUserEnrollmentInfo(
      studyIdentifier,
      participantId,
      token
    )
    const recordFromParticipantApi = await getActiveParticipantById(
      studyIdentifier,
      token,
      participant.participant.identifier
    )

    const isWithdrawn = participant.withdrawnOn !== undefined
    const isTestUser =
      recordFromParticipantApi?.dataGroups?.includes('test_user')
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
      return mapWithdrawnParticipant(participant, studyIdentifier)
    } else {
      return getActiveParticipantById(
        studyIdentifier,
        token,
        participant.participant.identifier
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

async function getUserEnrollmentInfo(
  studyIdentifier: string,
  participantId: string,
  token: string
) {
  const endpoint = constants.endpoints.enrollmentsForUser
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)
  const result = await Utility.callEndpoint<{items: EnrolledAccountRecord[]}>(
    endpoint,
    'GET',
    {},
    token
  )
  const filteredRows = result.data.items.filter(
    p => p.studyId === studyIdentifier
  )

  if (_.isEmpty(filteredRows)) {
    return {} as EnrolledAccountRecord
  }
  return filteredRows[0]
}

async function participantSearch(
  studyIdentifier: string,
  token: string,
  queryValue: string,
  participantType: ParticipantActivityType,
  searchType: 'EXTERNAL_ID' | 'PHONE_NUMBER'
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
  const allOfGroups = []
  if (participantType !== 'TEST') {
    noneOfGroups.push('test_user')
  } else {
    allOfGroups.push('test_user')
  }
  let body = {
    enrollment: queryFilter,
    noneOfGroups: noneOfGroups,
    allOfGroups: allOfGroups,
    externalIdFilter: queryValue || undefined,
    phoneFilter: queryValue || undefined,
  }
  if (searchType === 'EXTERNAL_ID') {
    delete body.phoneFilter
  } else {
    delete body.externalIdFilter
  }
  const participantAccountSummaryResult = await Utility.callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', body, token)

  // get withdrawn info if the participant is withdrawn, only get the note otherwise
  let resultItems: ParticipantAccountSummary[] =
    participantAccountSummaryResult.data.items
  if (queryFilter === 'withdrawn') {
    const participantEnrollmentPromises =
      participantAccountSummaryResult.data.items.map(participant => {
        return getUserEnrollmentInfo(studyIdentifier, participant.id, token)
      })
    const enrollments = await Promise.all(participantEnrollmentPromises)
    resultItems = enrollments.map(p =>
      mapWithdrawnParticipant(p, studyIdentifier)
    )
  } else if (queryFilter === 'enrolled') {
    const participantPromises = participantAccountSummaryResult.data.items.map(
      i => getActiveParticipantById(studyIdentifier, token, i.id)
    )
    const resolvedParticipants = await Promise.all(participantPromises)
    resultItems = resolvedParticipants.filter(
      p => p !== null
    ) as ParticipantAccountSummary[]
  }
  return {items: resultItems, total: resultItems.length}
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

  const result = await Utility.callEndpoint<{identifier: string}>(
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

  const result = await Utility.callEndpoint<{identifier: string}>(
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
    appId: Utility.getAppId(),
  }

  data.phone = options.phone
  data.note = options.note

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

  const result = await Utility.callEndpoint<{identifier: string}>(
    endpoint,
    'POST',
    data,
    token
  )

  const userId = result.data.identifier
  //update custom evnts date
  if (options.events) {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', userId)

    const updatePromises = options.events.map(e => {
      const data = {
        eventId: EventService.prefixCustomEventIdentifier(e.eventId),
        timestamp: e.timestamp
          ? new Date(e.timestamp).toISOString()
          : undefined,
      }
      Utility.callEndpoint<{identifier: string}>(endpoint, 'POST', data, token)
    })

    const result = await Promise.all(updatePromises)
    console.log(result.length)
  }

  return userId
}

// used for the preview screen in study builder
async function addTestParticipant(
  studyIdentifier: string,
  token: string
): Promise<string> {
  const participantId = Utility.generateNonambiguousCode(6)
  await addParticipant(
    studyIdentifier,
    token,
    {
      externalId: participantId,
      events: [],
    },

    true
  )
  return participantId
}

async function updateParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string,
  updatedFields: {
    [Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]
  }
) {
  const getParticipantEndpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )}/${participantId}`
  const participantInfo = await Utility.callEndpoint<ParticipantAccountSummary>(
    getParticipantEndpoint,
    'GET',
    {},
    token
  )
  // updated participant object
  const data = {
    ...participantInfo.data,
    ...updatedFields,
  }
  const updateParticipantEndpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyIdentifier
  )}/${participantId}`
  await Utility.callEndpoint<ParticipantAccountSummary>(
    updateParticipantEndpoint,
    'POST',
    data,
    token
  )
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

  const info = await Utility.callEndpoint<{signedInOn: any}>(
    endpoint,
    'GET',
    {},
    token
  )
  return info.data
}

const ParticipantService = {
  addParticipant,
  addTestParticipant,
  deleteParticipant,
  formatExternalId,
  // getRelevantEventsForParticipants,
  getNumEnrolledParticipants,
  getAllParticipantsInEnrollmentType,
  getEnrollmentById,
  getActiveParticipantById,
  getParticipants,
  participantSearch,
  getRequestInfoForParticipant,
  updateParticipantGroup,
  updateParticipant,
  // updateParticipantCustomEvents,
  withdrawParticipant,
  //prefixCustomEventIdentifier,
  //formatCustomEventIdForDisplay,
}

export default ParticipantService
