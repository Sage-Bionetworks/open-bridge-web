import Utility from '../helpers/utility'
import constants from '../types/constants'
import {ParticipantEvent, StringDictionary} from '../types/types'
import ScheduleService from './schedule.service'

export const JOINED_EVENT_ID = 'timeline_retrieved'
export const LINK_SENT_EVENT_ID = 'install_link_sent'
export const EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING = 'withdrawn'
export const BURST_EVENT_PATTERN = 'study_burst:[burst_id]:[0-9]+'
export const BURST_EVENT_REGEX_PATTERN = /study_burst:([^:]+):([0-9]+)/
export const BURST_START_EVENT_ID_REGEX_PATTERN =
  /(?<=study_burst:custom_)[^:]+(?=_burst:[0-9]+)/

function getBurstNumberFromEventId(eventIdentifier: string): number {
  return Number(eventIdentifier.match(/([0-9]+)\b/)?.[0] || '-1')
}

function isEventBurstEvent(eventIdentifier: string) {
  return new RegExp(BURST_EVENT_REGEX_PATTERN).test(eventIdentifier)
}
//study_burst:custom_Custom2_burst:01

function prefixCustomEventIdentifier(eventIdentifier: string) {
  var isBurst = new RegExp(BURST_EVENT_REGEX_PATTERN).test(eventIdentifier)
  return eventIdentifier.includes(constants.constants.CUSTOM_EVENT_PREFIX) ||
    isBurst
    ? eventIdentifier
    : constants.constants.CUSTOM_EVENT_PREFIX + eventIdentifier
}

function formatEventIdForDisplay(eventIdentifier: string) {
  if (isEventBurstEvent(eventIdentifier)) {
    var burstNumber = getBurstNumberFromEventId(eventIdentifier)

    return `Burst ${burstNumber}`
  } else {
    return eventIdentifier === JOINED_EVENT_ID
      ? 'Initial Login'
      : eventIdentifier.replace(constants.constants.CUSTOM_EVENT_PREFIX, '')
  }
}

// gets clinic visits and join events for participants with the specified ids
async function getRelevantEventsForParticipants(
  studyIdentifier: string,
  token: string,
  participantId: string[]
): Promise<
  StringDictionary<{
    timeline_retrieved: Date | undefined
    customEvents: ParticipantEvent[]
  }>
> {
  const customEventsForStudy =
    await ScheduleService.getAllEventsForTimelineByStudyId(
      studyIdentifier,
      token
    )

  const customEventIdsForStudy = customEventsForStudy.map(e => e.eventId)
  const promises = participantId.map(async pId => {
    const endpoint = constants.endpoints.events
      .replace(':studyId', studyIdentifier)
      .replace(':userId', pId)

    const apiCall = await Utility.callEndpoint<{items: any[]}>(
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
      const relevantEvents = item.apiCall.data.items.filter(event => {
        return customEventIdsForStudy.includes(event.eventId)
      })
      let joinedDate = item.apiCall.data.items.find(
        event => event.eventId === JOINED_EVENT_ID
      )

      // let smsDate = item.apiCall.data.items.find(
      //  event => event.eventId === `custom:${LINK_SENT_EVENT_ID}` //TODO: this will not be custom
      // )
      return {
        ...acc,
        [item.participantId]: {
          timeline_retrieved: joinedDate?.timestamp,
          customEvents: relevantEvents.filter(
            e => e.eventId !== JOINED_EVENT_ID
          ),
        },
      }
    }, {})
    return items
  })
}

//we can't 'update' the events, so we delete them and then recreate them with the new info
async function updateParticipantCustomEvents(
  studyIdentifier: string,
  token: string,
  participantId: string,
  eventsToUpdate: ParticipantEvent[]
) {
  let eventEndpoint = constants.endpoints.events
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  // get Events for schedule  - we need this in order to possibly delete userEvents
  const schedulingEventIds =
    await ScheduleService.getAllEventsForTimelineByStudyId(
      studyIdentifier,
      token
    )

  //ag: why date?  const customEventWithDate = eventsToUpdate.filter(event => !!event.timestamp)
  const customEventsToUpdate = eventsToUpdate.filter(
    e => e.eventId !== JOINED_EVENT_ID
  )

  customEventsToUpdate.forEach(async event => {
    const d = await Utility.callEndpoint<{identifier: string}>(
      eventEndpoint + '/' + event.eventId,
      'DELETE',
      {},
      token
    )
    console.log('deleted' + event.eventId)
    if (event.timestamp) {
      const data = {
        eventId: event.eventId,
        timestamp: new Date(event.timestamp!).toISOString(),
      }

      const z = Utility.callEndpoint<{identifier: string}>(
        `${eventEndpoint}?showError=true&updateBursts=false`,
        'POST',
        data,
        token
      )
      console.log('added' + event.eventId)
    }
  })

  return participantId
}

const EventService = {
  getRelevantEventsForParticipants,
  updateParticipantCustomEvents,
  prefixCustomEventIdentifier,
  formatEventIdForDisplay,
  getBurstNumberFromEventId,
  isEventBurstEvent,
}

export default EventService
