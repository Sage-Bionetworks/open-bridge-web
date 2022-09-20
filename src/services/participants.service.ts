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
  ParticipantRequestInfo,
  StringDictionary,
} from '../types/types'
import AdherenceService from './adherence.service'
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
  if (!pageSize) {
    return Utility.getAllPages<ParticipantAccountSummary>(getTestParticipants, [
      studyId,
      token,
    ])
  }

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
  // participantId: string | string[] // check if anywhere else uses this function if not change to array
  participantId: string[]
): Promise<string[]> {
  const promises = participantId.map(async pId => {
    const endpoint = `${constants.endpoints.participant.replace(
      ':id',
      studyId
    )}/${pId}`
    const apiCall = await Utility.callEndpoint<{items: any[]}>(
      endpoint,
      'DELETE',
      {},
      token
    )
    return {participantId: pId, apiCall: apiCall}
  })

  return Promise.all(promises).then(result => {
    return result.map(item => item.participantId)
  })
}

async function getActiveParticipants(
  studyId: string,
  token: string,
  pageSize: number,
  offsetBy: number
): Promise<{items: ExtendedParticipantAccountSummary[]; total: number}> {
  // get enrollment for non test account
  if (!pageSize) {
    return Utility.getAllPages<ParticipantAccountSummary>(
      getActiveParticipants,
      [studyId, token]
    )
  }

  const data = {
    enrollmentFilter: 'enrolled',
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

  return {items: resultItems, total: result.total}
}

async function getWithdrawnParticipants(
  studyId: string,
  token: string,
  pageSize: number,
  offsetBy: number
): Promise<{items: ExtendedParticipantAccountSummary[]; total: number}> {
  // get enrollment for non test account
  if (!pageSize) {
    return Utility.getAllPages<ParticipantAccountSummary>(
      getWithdrawnParticipants,
      [studyId, token]
    )
  }

  const data = {
    enrollmentFilter: 'withdrawn',
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

  resultItems = result.items.map(p => mapWithdrawnParticipant(p, studyId))

  return {items: resultItems, total: result.total}
}

async function getParticipants(
  studyId: string,
  token: string,
  participantType: ParticipantActivityType,
  pageSize: number,
  offsetBy: number
): Promise<{items: ExtendedParticipantAccountSummary[]; total: number}> {
  if (participantType === 'TEST') {
    return getTestParticipants(studyId, token, pageSize, offsetBy)
  } else {
    return participantType === 'ACTIVE'
      ? getActiveParticipants(studyId, token, pageSize, offsetBy)
      : getWithdrawnParticipants(studyId, token, pageSize, offsetBy)
  }
  // get enrollment for non test account
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
  const participantEnrollmentPromises =
    participantAccountSummaryResult.data.items.map(participant => {
      return getUserEnrollmentInfo(studyId, participant.id, token)
    })
  const enrollments = await Promise.all(participantEnrollmentPromises)
  if (queryFilter === 'withdrawn') {
    resultItems = enrollments.map(p => mapWithdrawnParticipant(p, studyId))
  } else if (queryFilter === 'enrolled') {
    const participantPromises = resultItems.map(i =>
      getActiveParticipantById(studyId, token, i.id)
    )
    const resolvedParticipants = await Promise.all(participantPromises)
    resultItems.forEach(i => {
      i.note =
        enrollments.find(p => p.participant.identifier === i.id)?.note || ''
      i.healthCode =
        resolvedParticipants.find(p => p?.id === i.id)?.healthCode || ''
    })
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
    dataGroups: ['preview_user'],
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
  isTestUser?: boolean,
  isPreview?: boolean
): Promise<string> {
  const participantEndpoint = constants.endpoints.participant.replace(
    ':id',
    studyId
  )

  let data: StringDictionary<any> = {
    appId: Utility.getAppId(),
  }

  data.phone = options.phone

  if (isPreview) {
    data.dataGroups = ['preview_user'] //
  } else {
    data.sharingScope = 'sponsors_and_partners'
    if (isTestUser) {
      data.dataGroups = ['test_user']
    }
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
      return Utility.callEndpoint<{identifier: string}>(
        endpoint,
        'POST',
        data,
        token
      )
    })

    const result = await Promise.all(updatePromises)
    console.log(result.length)
  }
  //prime adherence. We are not waiting -- just firing it up
  AdherenceService.getAdherenceForWeekForUsers(studyId, [userId], token)
  return userId
}

// used for the preview screen in study builder
async function addPreviewTestParticipant(
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

    true,
    true
  )
  return participantId
}

async function getParticipant(
  studyIdentifier: string,
  participantId: string,
  token: string
): Promise<ParticipantAccountSummary> {
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
  return participantInfo.data
}

async function updateParticipant(
  studyIdentifier: string,
  token: string,
  participantId: string[],
  updatedFields: {
    [Property in keyof ParticipantAccountSummary]?: ParticipantAccountSummary[Property]
  },
  isAllSelected?: boolean
): Promise<string[]> {
  if (isAllSelected) {
    const resultEnrolled = await getEnrollmentByEnrollmentType(
      studyIdentifier,
      token,
      'enrolled',
      false
    )
    const enrolledNonTestParticipants = resultEnrolled.items
    participantId = enrolledNonTestParticipants.map(
      el => el.participant.identifier
    )
  }
  if (
    updatedFields.clientTimeZone === '' ||
    updatedFields.clientTimeZone === '-'
  ) {
    updatedFields.clientTimeZone = undefined
  }

  const updatedParticipantFields = {...updatedFields}
  delete updatedParticipantFields.note

  if (participantId.length === 1 && updatedFields.note !== undefined) {
    //we update the enrollment note record
    await updateEnrollmentNote(
      studyIdentifier,
      participantId[0], // updating single participants
      updatedFields.note,
      token
    )
  }

  //what about multiple notes

  const updateParticipantPromises = participantId?.map(pId =>
    getParticipant(studyIdentifier, pId, token).then(participant => {
      const updatedParticipant = {
        ...participant,
        ...updatedParticipantFields,
      }
      const endpoint = `${constants.endpoints.participant.replace(
        ':id',
        studyIdentifier
      )}/${pId}`

      return Utility.callEndpoint<ParticipantAccountSummary>(
        endpoint,
        'POST',
        updatedParticipant,
        token
      ).then(p => {
        return {participantId: pId, result: p}
      })
    })
  )

  const result = await Promise.all(updateParticipantPromises).then(result => {
    return result.map(item => item.participantId)
  })
  //we want to ping adherence to make sure data is refreshed
  AdherenceService.getAdherenceForWeekForUsers(
    studyIdentifier,
    participantId,
    token
  )
  return result
}

async function getRequestInfoForParticipant(
  studyIdentifier: string,
  participantId: string,
  token: string
): Promise<ParticipantRequestInfo> {
  //transform ids into promises
  const endpoint = constants.endpoints.requestInfo
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  const info = await Utility.callEndpoint<ParticipantRequestInfo>(
    endpoint,
    'GET',
    {},
    token
  )
  return info.data
}

async function getEnrollmentByEnrollmentType(
  studyId: string,
  token: string,
  enrollmentType: string,
  includeTesters?: boolean,
  pageSize?: number,
  offsetBy?: number
) {
  if (!pageSize) {
    return Utility.getAllPages<EnrolledAccountRecord>(
      getEnrollmentByEnrollmentType,
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

const ParticipantService = {
  getActiveParticipants,
  getWithdrawnParticipants,
  getUserEnrollmentInfo,
  addParticipant,
  getParticipant,
  addPreviewTestParticipant,
  deleteParticipant,
  formatExternalId,

  getNumEnrolledParticipants,
  getEnrollmentByEnrollmentType,

  getActiveParticipantById,
  getParticipants,
  participantSearch,
  getRequestInfoForParticipant,
  signUpForAssessmentDemoStudy,
  updateParticipant,

  withdrawParticipant,
}

export default ParticipantService
