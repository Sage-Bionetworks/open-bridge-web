import Utility from '@helpers/utility'
import EventService from '@services/event.service'
import ParticipantService from '@services/participants.service'
import {SchedulingEvent} from '@typedefs/scheduling'
import {
  ExtendedParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  SelectionType,
  StringDictionary,
} from '@typedefs/types'
import moment from 'moment'
import {jsonToCSV} from 'react-papaparse'

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
      joinedDate: events.timeline_retrieved,
      events: events.customEvents,
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
  searchOptions?: {
    searchParam: 'EXTERNAL_ID' | 'PHONE_NUMBER'
    searchValue: string
  }
): Promise<ParticipantData> {
  const offset = (currentPage - 1) * pageSize
  const token = Utility.getSession()?.token
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
        offset
      )

  if (items && total) {
    const result = await getRelevantParticipantInfo(studyId, token, items)
    return {items: result, total}
  } else {
    return {items: [], total: 0}
  }
}

async function getParticipantDataForDownload(
  studyId: string,
  tab: ParticipantActivityType,
  studyEvents: SchedulingEvent[] | null,
  selectionType: SelectionType,
  isEnrolledById: boolean,
  selectedParticipantData: ParticipantData = {items: [], total: 0}
): Promise<Blob> {
  //if getting all participants
  const participantsData: ParticipantData =
    selectionType === 'ALL'
      ? await getParticipants(studyId, 0, 0, tab)
      : selectedParticipantData
  //massage data
  const transformedParticipantsData = participantsData.items.map(
    (p: ExtendedParticipantAccountSummary) => {
      const participant: Record<string, string | undefined> = {
        participantId: ParticipantService.formatExternalId(
          studyId,
          p.externalIds[studyId] || ''
        ),
        healthCode: p.id,
        phoneNumber: p.phone?.nationalFormat,
        // LEON TODO: Revisit when we have smsDate
        joinedDate: p.joinedDate
          ? new Date(p.joinedDate).toLocaleDateString()
          : '',
        note: p.note || '',
      }
      studyEvents?.forEach(currentEvent => {
        const matchingEvent = p.events?.find(
          pEvt => pEvt.eventId === currentEvent.identifier
        )
        participant[
          EventService.formatCustomEventIdForDisplay(currentEvent.identifier)
        ] = matchingEvent?.timestamp
          ? moment(matchingEvent?.timestamp).format('l')
          : ''
      })
      if (isEnrolledById) {
        delete participant.phoneNumber
      }
      return participant
    }
  )

  //csv and blob it
  const csvData = jsonToCSV(transformedParticipantsData)
  const blob = new Blob([csvData], {
    type: 'text/csv;charset=utf8;',
  })
  return blob
}

const ParticipantUtility = {
  getParticipantDataForDownload,
  // getRelevantParticipantInfo,
  getParticipants,
}

export default ParticipantUtility
