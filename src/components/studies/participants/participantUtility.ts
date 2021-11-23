import Utility from '@helpers/utility'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import ParticipantService from '@services/participants.service'
import {
  ExtendedParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  StringDictionary,
} from '@typedefs/types'

//[database, column header]
const TEMPLATE_FIELDS = {
  phone: ['phoneNumber', 'Phone Number'],
  healthCode: ['healthCode', 'Health Code'],
}

export type ParticipantData = {
  items: ExtendedParticipantAccountSummary[]
  total: number
}

async function getRelevantParticipantInfo(
  studyId: string,
  token: string,
  participants: ExtendedParticipantAccountSummary[]
) {
  const eventsMap: StringDictionary<{
    timeline_retrieved: Date | undefined
    customEvents: ParticipantEvent[]
  }> = await EventService.getRelevantEventsForParticipants(
    studyId,
    token,
    participants.map(p => p.id)
  )
  const result = participants!.map(participant => {
    const id = participant.id as string
    const events = eventsMap[id]
    if (participant.externalId) {
      const splitExternalId = participant.externalId.split(':')
      let id = ''
      if (splitExternalId.length === 1) {
        id = splitExternalId[0]
      } else {
        id = splitExternalId[splitExternalId[0] === studyId ? 1 : 0]
      }
      participant.externalId = Utility.formatStudyId(id)
    }
    const updatedParticipant = {
      ...participant,
      // joinedDate: events.timeline_retrieved,
      events: [
        ...events.customEvents,
        {eventId: JOINED_EVENT_ID, timestamp: events.timeline_retrieved},
      ],
      //   smsDate: event.smsDate,
    }
    return updatedParticipant
  })
  return result
}

async function getParticipants(
  studyId: string,
  currentPage: number,
  pageSize: number, // set to 0 to get all the participants
  tab: ParticipantActivityType,
  token: string,
  searchOptions?: {
    searchParam: 'EXTERNAL_ID' | 'PHONE_NUMBER'
    searchValue: string
  }
): Promise<ParticipantData> {
  const offset = (currentPage - 1) * pageSize
  //const token = Utility.getSession()?.token
  if (!token) {
    throw Error('Need token')
  }
  const {items, total} = searchOptions?.searchValue
    ? await ParticipantService.participantSearch(
        studyId,
        token,
        searchOptions.searchValue,
        tab,
        searchOptions.searchParam
      )
    : await ParticipantService.getParticipants(
        studyId,
        token,
        tab,
        pageSize,
        offset < 0 ? 0 : offset
      )
  if (items && total) {
    const result = await getRelevantParticipantInfo(studyId, token, items)
    return {items: result, total}
  } else {
    return {items: [], total: 0}
  }
}

const ParticipantUtility = {
  getParticipants,
}

export default ParticipantUtility
