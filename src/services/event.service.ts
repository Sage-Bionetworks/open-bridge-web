import Utility from '../helpers/utility'
import constants from '../types/constants'
import {ParticipantEvent, StringDictionary} from '../types/types'
import ScheduleService from './schedule.service'

export const JOINED_EVENT_ID = 'timeline_retrieved'
export const LINK_SENT_EVENT_ID = 'install_link_sent'
export const EXTERNAL_ID_WITHDRAWN_REPLACEMENT_STRING = 'withdrawn'
export const BURST_EVENT_PATTERN = 'study_burst:[burst_id]:[0-9]+'
export const BURST_EVENT_REGEX_PATTERN = /study_burst:(\w+):([0-9]+)/
//study_burst:custom_Custom2_burst:01

function prefixCustomEventIdentifier(eventIdentifier: string) {
  return eventIdentifier.includes(constants.constants.CUSTOM_EVENT_PREFIX)
    ? eventIdentifier
    : constants.constants.CUSTOM_EVENT_PREFIX + eventIdentifier
}

function formatCustomEventIdForDisplay(eventIdentifier: string) {
  var isBurst = new RegExp(BURST_EVENT_REGEX_PATTERN).test(eventIdentifier)

  if (isBurst) {
    var burstNumber = eventIdentifier.match(/([0-9]+)\b/)?.[0] || '-1'

    return `Burst ${Number(burstNumber)}`
  } else {
    return eventIdentifier.replace(constants.constants.CUSTOM_EVENT_PREFIX, '')
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
  //transform ids into promises
  const eventIdsForSchedule =
    await ScheduleService.getEventIdsForScheduleByStudyId(
      studyIdentifier,
      token
    ).then(result =>
      result.map(eventObject =>
        prefixCustomEventIdentifier(eventObject.eventId)
      )
    )
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
        return eventIdsForSchedule.includes(event.eventId)
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
          customEvents: relevantEvents,
        },
      }
    }, {})
    return items
  })
}

async function updateParticipantCustomEvents(
  studyIdentifier: string,
  token: string,
  participantId: string,
  customEvents: ParticipantEvent[]
) {
  let eventEndpoint = constants.endpoints.events
    .replace(':studyId', studyIdentifier)
    .replace(':userId', participantId)

  // get Events for schedule  - we need this in order to possibly delete userEvents
  const schedulingEventIds =
    await ScheduleService.getEventIdsForScheduleByStudyId(
      studyIdentifier,
      token
    )
  const customEventWithDate = customEvents.filter(event => !!event.timestamp)

  const eventsToDelete = schedulingEventIds.filter(
    event =>
      !customEventWithDate.find(pEvent => event.eventId === pEvent.eventId)
  )

  const eventsToDeletePromises = eventsToDelete.map(eventId =>
    Utility.callEndpoint<{identifier: string}>(
      eventEndpoint + '/' + eventId,
      'DELETE',
      {},
      token
    )
  )
  const eventsToUpdatePromises = customEventWithDate.map(event => {
    const data = {
      eventId: event.eventId,
      timestamp: new Date(event.timestamp!).toISOString(),
    }

    return Utility.callEndpoint<{identifier: string}>(
      eventEndpoint,
      'POST',
      data,
      token
    )
  })

  await Promise.allSettled(eventsToDeletePromises)
  await Promise.allSettled(eventsToUpdatePromises)
  return participantId
}

const EventService = {
  getRelevantEventsForParticipants,
  updateParticipantCustomEvents,
  prefixCustomEventIdentifier,
  formatCustomEventIdForDisplay,
}

export default EventService
