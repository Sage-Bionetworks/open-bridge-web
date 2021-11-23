import _ from 'lodash'
import Utility from '../helpers/utility'
import constants from '../types/constants'
import {
  EditableParticipantData,
  EnrolledAccountRecord,
  ExtendedError,
  ExtendedParticipantAccountSummary,
  ParticipantAccountSummary,
  ParticipantActivityType,
  StringDictionary,
} from '../types/types'
import EventService from './event.service'

export const EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING = 'withdrawn'

function getStudyEnrollmentEndpoint(studyId: string) {
  return `${constants.endpoints.enrollments.replace(':studyId', studyId)}`
}

function getParticipantEnrollmentEndpoint(
  studyId: string,
  participantId: string
) {
  return `${constants.endpoints.enrollments.replace(
    ':studyId',
    studyId
  )}/${participantId}`
}

//formats participant in the format required by datagrid
function mapWithdrawnParticipant(
  p: EnrolledAccountRecord,
  studyId: string
): ExtendedParticipantAccountSummary {
  return {
    ...p.participant,
    externalId: formatExternalId(studyId, p.externalId),
    id: p.participant.identifier,
    dateWithdrawn: p.withdrawnOn,
    withdrawalNote: p.withdrawalNote,
    events: [],
    externalIds: {
      [studyId]: formatExternalId(studyId, p.externalId),
    },
  }
}

//backendExternalId = studyId:externalId
function makeBackendExternalId(studyId: string, externalId: string) {
  return `${externalId}:${studyId}`
}

export function formatExternalId(
  studyId: string,
  externalId: string,
  isKeepBlank?: boolean
) {
  if (!externalId) {
    return isKeepBlank ? '' : EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING
  }
  let forDisplay = externalId.replace(`:${studyId}`, '')
  return forDisplay
  //AGENDEL - we are not formatting external ids any more 8/24
  /*return forDisplay.length !== 6
    ? forDisplay
    : `${forDisplay.substr(0, 3)}-${forDisplay.substr(3, 3)}`*/
}

async function updateEnrollmentNote(
  studyId: string,
  participantId: string,
  note: string,
  token: string
): Promise<string> {
  //we update the enrollment note record

  const enrollmentInfo = await getUserEnrollmentInfo(
    studyId,
    participantId,
    token
  )

  const data = {
    note: note,
    withdrawalNote: enrollmentInfo.note,
  }

  await Utility.callEndpoint<EnrolledAccountRecord>(
    getParticipantEnrollmentEndpoint(studyId, participantId),
    'POST',
    data,
    token
  )

  return participantId
}

async function enrollParticipant(
  studyId: string,
  participantId: string,
  note: string | undefined,
  token: string,
  backEndFormatExternalId: string | undefined
): Promise<string> {
  const data = {
    userId: participantId,
    externalId: backEndFormatExternalId,
    note,
  }

  const result = await Utility.callEndpoint<{identifier: string}>(
    getStudyEnrollmentEndpoint(studyId),
    'POST',
    data,
    token
  )
  return result.data.identifier
}

// get participants
//if page and offset not specified - get all
async function getTestParticipants(
  studyId: string,
  token: string,
  pageSize?: number,
  offsetBy?: number
): Promise<{
  items: ParticipantAccountSummary[]
  total: number
}> {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':studyId',
    studyId
  )

  const data = {
    pageSize: pageSize,
    offsetBy: offsetBy,
    enrolledInStudyId: studyId,
    allOfGroups: ['test_user'],
  }

  const result = await Utility.callEndpoint<{
    items: ParticipantAccountSummary[]
    total: number
  }>(endpoint, 'POST', data, token)

  const mappedData = result.data.items.map(p => ({
    ...p,
    externalId: formatExternalId(studyId, p.externalIds[studyId]),
  }))

  return {items: mappedData, total: result.data.total}
}

async function getActiveParticipantById(
  studyId: string,
  token: string,
  participantId: string
): Promise<ParticipantAccountSummary | null> {
  const endpoint = constants.endpoints.participant.replace(':id', studyId)
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
        studyId,
        result.data.externalIds[studyId],
        true
      ),
    }
  } catch (error) {
    // If the participant is not found, return null.
    if ((error as ExtendedError).statusCode === 404) {
      return null
    }
    throw new Error((error as ExtendedError).message)
  }
}

//deletes single participant. NOTE: this is delete and NOT withdraw. Currently only works on test users
async function deleteParticipant(
  studyId: string,
  token: string,
  participantId: string
): Promise<string> {
  const endpoint = `${constants.endpoints.participant.replace(
    ':id',
    studyId
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
  studyId: string,
  token: string,
  participantType: ParticipantActivityType,
  pageSize: number,
  offsetBy: number
): Promise<{items: ExtendedParticipantAccountSummary[]; total: number}> {
  // get enrollment for non test account
  if (!pageSize) {
    return Utility.getAllPages<ParticipantAccountSummary>(getParticipants, [
      studyId,
      token,
      participantType,
    ])
  }

  if (participantType === 'TEST') {
    return getTestParticipants(studyId, token, pageSize, offsetBy)
  }

  const queryFilter =
    participantType === 'ACTIVE'
      ? 'enrolled'
      : participantType === 'WITHDRAWN'
      ? 'withdrawn'
      : 'all'

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
    }>(getStudyEnrollmentEndpoint(studyId), 'GET', data, token)
  ).data

  let resultItems: ParticipantAccountSummary[] = []
  if (queryFilter === 'withdrawn') {
    resultItems = result.items.map(p => mapWithdrawnParticipant(p, studyId))
  }
  if (queryFilter === 'enrolled') {
    const participantPromises = result.items.map(i =>
      getActiveParticipantById(studyId, token, i.participant.identifier)
    )
    const resolvedParticipants = await Promise.all(participantPromises)
    resultItems = resolvedParticipants.filter(
      p => p !== null
    ) as ParticipantAccountSummary[]

    resultItems.forEach(i => {
      i.note =
        result.items.find(p => p.participant.identifier === i.id)?.note || ''
    })
  }

  return {items: resultItems, total: result.total}
}

async function getAllParticipantsInEnrollmentType(
  studyId: string,
  token: string,
  enrollmentType: string,
  includeTesters?: boolean,
  pageSize?: number,
  offsetBy?: number
) {
  if (!pageSize) {
    return Utility.getAllPages<EnrolledAccountRecord>(
      getAllParticipantsInEnrollmentType,
      [studyId, token, enrollmentType, includeTesters || false]
    )
  }

  const body = {
    enrollmentFilter: enrollmentType,
    includeTesters: includeTesters || false,
    pageSize: pageSize,
    offsetBy: offsetBy ? offsetBy : 0,
  }
  const result = await Utility.callEndpoint<{
    items: EnrolledAccountRecord[]
    total: number
  }>(getStudyEnrollmentEndpoint(studyId), 'GET', body, token)
  return {items: result.data.items, total: result.data.total}
}

async function getNumEnrolledParticipants(studyId: string, token: string) {
  const body = {
    enrollmentFilter: 'enrolled',
  }
  const result = await Utility.callEndpoint<{total: number}>(
    getStudyEnrollmentEndpoint(studyId),
    'GET',
    body,
    token
  )
  return result.data.total
}

async function getEnrollmentById(
  studyId: string,
  token: string,
  participantId: string,
  participantType: ParticipantActivityType
) {
  try {
    const participant = await getUserEnrollmentInfo(
      studyId,
      participantId,
      token
    )
    const recordFromParticipantApi = await getActiveParticipantById(
      studyId,
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
      return mapWithdrawnParticipant(participant, studyId)
    } else {
      return getActiveParticipantById(
        studyId,
        token,
        participant.participant.identifier
      )
    }
  } catch (error) {
    // If the participant is not found, return null.
    if ((error as ExtendedError).statusCode === 404) {
      return null
    }
    throw new Error((error as ExtendedError).message)
  }
}

async function getUserEnrollmentInfo(
  studyId: string,
  participantId: string,
  token: string
) {
  const endpoint = constants.endpoints.enrollmentsForUser
    .replace(':studyId', studyId)
    .replace(':userId', participantId)
  const result = await Utility.callEndpoint<{items: EnrolledAccountRecord[]}>(
    endpoint,
    'GET',
    {},
    token
  )
  const filteredRows = result.data.items.filter(p => p.studyId === studyId)

  if (_.isEmpty(filteredRows)) {
    return {} as EnrolledAccountRecord
  }
  return filteredRows[0]
}

async function participantSearch(
  studyId: string,
  token: string,
  queryValue: string,
  participantType: ParticipantActivityType,
  searchType: 'EXTERNAL_ID' | 'PHONE_NUMBER'
) {
  const endpoint = constants.endpoints.participantsSearch.replace(
    ':studyId',
    studyId
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
        return getUserEnrollmentInfo(studyId, participant.id, token)
      })
    const enrollments = await Promise.all(participantEnrollmentPromises)
    resultItems = enrollments.map(p => mapWithdrawnParticipant(p, studyId))
  } else if (queryFilter === 'enrolled') {
    const participantPromises = participantAccountSummaryResult.data.items.map(
      i => getActiveParticipantById(studyId, token, i.id)
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
  studyId: string,
  token: string,
  participantId: string,
  note?: string
): Promise<string> {
  const endpoint = `${getParticipantEnrollmentEndpoint(
    studyId,
    participantId
  )}${note ? '?withdrawalNote=' + encodeURIComponent(note) + '' : ''}`

  const result = await Utility.callEndpoint<{identifier: string}>(
    endpoint,
    'DELETE',
    {},
    token
  )

  return result.data.identifier
}

//signsup researcher as participant for assessmentdemostudy
async function signUpForAssessmentDemoStudy(token: string): Promise<string> {
  const studyId = constants.constants.ASSESSMENT_DEMO_STUDY_ID
  const participantId = Utility.generateNonambiguousCode(6)
  const endpoint = constants.endpoints.signUp

  const backEndFormatExternalId = makeBackendExternalId(studyId, participantId)

  const data: StringDictionary<any> = {
    appId: Utility.getAppId(),
    externalIds: {[studyId]: backEndFormatExternalId},
    password: backEndFormatExternalId,
    dataGroups: ['test_user'],
  }

  const result = await Utility.callEndpoint<any>(endpoint, 'POST', data, token)
  if (result.ok) {
    return backEndFormatExternalId
  } else {
    throw result.status
  }
}

//adds a participant
async function addParticipant(
  studyId: string,
  token: string,
  options: EditableParticipantData,
  isTestUser?: boolean
): Promise<string> {
  const participantEndpoint = constants.endpoints.participant.replace(
    ':id',
    studyId
  )

  let data: StringDictionary<any> = {
    appId: Utility.getAppId(),
  }

  data.phone = options.phone

  if (isTestUser) {
    data.dataGroups = ['test_user']
  }
  let backEndFormatExternalId = undefined
  if (options.externalId) {
    backEndFormatExternalId = makeBackendExternalId(studyId, options.externalId)
  }
  if (backEndFormatExternalId) {
    data.externalIds = {[studyId]: backEndFormatExternalId}
    data.password = backEndFormatExternalId
  }
  if (options.clientTimeZone) {
    data.clientTimeZone = options.clientTimeZone
  }
  let userId = undefined

  try {
    const result = await Utility.callEndpoint<{identifier: string}>(
      participantEndpoint,
      'POST',
      {...data, note: undefined},
      token
    )
    userId = result.data.identifier

    if (options.note) {
      await enrollParticipant(
        studyId,
        userId,
        options.note,
        token,
        backEndFormatExternalId
      )
    }
  } catch (error) {
    //user already exists
    if (
      (error as ExtendedError).statusCode !== 409 ||
      !(error as ExtendedError).entity?.userId
    ) {
      throw error
    }
    userId = (error as ExtendedError).entity.userId
    await enrollParticipant(
      studyId,
      userId,
      options.note,
      token,
      backEndFormatExternalId
    )
  }

  //update custom evnts date
  if (options.events) {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyId)
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
  studyId: string,
  token: string
): Promise<string> {
  const participantId = Utility.generateNonambiguousCode(6)
  await addParticipant(
    studyId,
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

  const updatedParticipantFields = {...updatedFields}
  delete updatedParticipantFields.note

  // updated participant object
  const data = {
    ...participantInfo.data,
    ...updatedParticipantFields,
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

  if (updatedFields.note !== undefined) {
    //we update the enrollment note record
    await updateEnrollmentNote(
      studyIdentifier,
      participantId,
      updatedFields.note,
      token
    )
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

  getNumEnrolledParticipants,
  getAllParticipantsInEnrollmentType,
  getEnrollmentById,
  getActiveParticipantById,
  getParticipants,
  participantSearch,
  getRequestInfoForParticipant,
  signUpForAssessmentDemoStudy,
  updateParticipant,

  withdrawParticipant,
}

export default ParticipantService
