// pick a date util library

import Utility from '@helpers/utility'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import ParticipantService from '@services/participants.service'
import {
  EditableParticipantData,
  ExtendedParticipantAccountSummary,
  ParticipantActivityType,
  ParticipantEvent,
  SelectionType,
} from '@typedefs/types'
import moment from 'moment'
import {jsonToCSV} from 'react-papaparse'
import {
  addParticipantById,
  addParticipantByPhone,
} from '../add/AddSingleParticipant'
import ParticipantUtility, {ParticipantData} from '../participantUtility'

const CSV_BY_ID_IMPORT_KEY: Map<keyof EditableParticipantData, string> =
  new Map([
    ['externalId', 'Participant ID'],
    ['timeZone', 'Time Zone'],
    ['clientTimeZone', 'Participant Time Zone'],
    ['note', 'Notes'],
  ])

const CSV_BY_PHONE_IMPORT_KEY: Map<keyof EditableParticipantData, string> =
  new Map([
    ['phoneNumber', 'Phone#'],
    ['timeZone', 'Time Zone'],
    ['externalId', 'Reference ID'],
    ['clientTimeZone', 'Participant Time Zone'],
    ['note', 'Notes'],
  ])

const CSV_EXPORT_ADDITIONAL_KEYS: Map<
  keyof ExtendedParticipantAccountSummary,
  string
> = new Map([
  ['healthCode', 'Health Code'],
  ['joinedDate', 'Joined'],
  ['dateWithdrawn', 'Withdrew'],
  ['withdrawalNote', 'Withdrawal Note'],
])

const getImportColumns = (isEnrolledById: boolean) => {
  const columns = isEnrolledById
    ? CSV_BY_ID_IMPORT_KEY
    : CSV_BY_PHONE_IMPORT_KEY
  return columns
}

const getExportColumns = (isEnrolledById: boolean) => {
  const columns = isEnrolledById
    ? CSV_BY_ID_IMPORT_KEY
    : CSV_BY_PHONE_IMPORT_KEY
  return new Map([...columns, ...CSV_EXPORT_ADDITIONAL_KEYS])
}

function getDownloadTemplateRow(
  isEnrolledById: boolean,
  scheduleEventIds: string[]
): Record<string, string> {
  const columns = getImportColumns(isEnrolledById)
  let templateData: {[key: string]: string}[] = []
  columns.forEach((v, k) => {
    templateData.push({[v]: ''})
  })
  scheduleEventIds?.forEach((eventId, index) => {
    templateData.splice(1 + index, 0, {
      [EventService.formatEventIdForDisplay(eventId)]: '',
    })
  })
  return Object.assign({}, ...templateData)
}

function isImportFileValid(
  isEnrolledById: boolean,
  scheduleEventIds: string[],
  firstRow: object
): boolean {
  //expected columns
  const templateKeys = Object.keys(
    getDownloadTemplateRow(isEnrolledById, scheduleEventIds)
  )
    .sort()
    .join(',')
  //real columns - remove empty
  const keysString = Object.keys(firstRow)
    .sort()
    .filter(v => !!v)
    .join(',')
  const isValid = templateKeys === keysString
  return isValid
}

async function uploadCsvRow(
  data: Record<string, string>,
  customParticipantEvents: ParticipantEvent[],
  isEnrolledById: boolean,
  studyIdentifier: string,
  token: string
) {
  const pEvents = customParticipantEvents
    .map(e => ({
      ...e,
      timestamp: data[e.eventId] ? new Date(data[e.eventId]) : undefined,
    }))
    .filter(e => e.timestamp)
  const columns = getImportColumns(isEnrolledById)

  const options: EditableParticipantData = {
    externalId: data[columns.get('externalId')!],
    note: data[columns.get('note')!],
    events: pEvents,
  }
  let result
  if (isEnrolledById) {
    if (!options.externalId) {
      throw new Error('no id')
    } else {
      result = await addParticipantById(studyIdentifier, token, options)
    }
  } else {
    const phoneNumber = data[columns.get('phoneNumber')!]?.toString()
    if (!phoneNumber) {
      throw new Error('need phone')
    }
    if (Utility.isInvalidPhone(phoneNumber)) {
      throw new Error('phone is in invalid format')
    } else {
      const phone = Utility.makePhone(phoneNumber)
      result = await addParticipantByPhone(
        studyIdentifier,
        token,
        phone,
        options
      )
    }
  }
  return result
}

const getJoinedEventDateString = (events?: ParticipantEvent[]) => {
  if (!events || events.length === 0) {
    return ''
  }
  const joinedEvent = events?.find(event => event.eventId === JOINED_EVENT_ID)
  return joinedEvent?.timestamp
    ? new Date(joinedEvent.timestamp).toDateString()
    : ''
}

async function getParticipantDataForDownload(
  studyId: string,
  token: string,
  tab: ParticipantActivityType,
  scheduleEventIds: string[] | null,
  selectionType: SelectionType,
  isEnrolledById: boolean,
  selectedParticipantData: ParticipantData = {items: [], total: 0}
): Promise<Blob> {
  //if getting all participants
  const participantsData: ParticipantData =
    selectionType === 'ALL'
      ? await ParticipantUtility.getParticipants(studyId, 0, 0, tab, token)
      : selectedParticipantData
  //massage data
  const columns = getExportColumns(isEnrolledById)
  const dateToString = (d?: Date | string): string =>
    d ? new Date(d).toString() : ''
  const transformedParticipantsData = participantsData.items.map(
    (p: ExtendedParticipantAccountSummary) => {
      const participant: Record<string, string | undefined> = {
        [columns.get('externalId')!]: ParticipantService.formatExternalId(
          studyId,
          p.externalIds[studyId] || ''
        ),
        [columns.get('healthCode')!]: p.healthCode,

        // LEON TODO: Revisit when we have smsDate
        [columns.get('joinedDate')!]: getJoinedEventDateString(p.events),

        [columns.get('note')!]:
          tab !== 'WITHDRAWN' ? p.note || '' : p.withdrawalNote,
      }

      if (tab === 'WITHDRAWN') {
        participant[columns.get('dateWithdrawn')!] = dateToString(
          p.dateWithdrawn
        )
      }
      if (columns.get('phoneNumber')) {
        participant[columns.get('phoneNumber')!] = p.phone?.nationalFormat
      }
      participant[columns.get('clientTimeZone')!] = p.clientTimeZone

      scheduleEventIds?.forEach(eventId => {
        const matchingEvent = p.events?.find(pEvt => pEvt.eventId === eventId)
        participant[EventService.formatEventIdForDisplay(eventId)] =
          matchingEvent?.timestamp
            ? moment(matchingEvent?.timestamp).format('l')
            : ''
      })

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

const CsvUtility = {
  getDownloadTemplateRow,
  isImportFileValid,
  uploadCsvRow,
  getParticipantDataForDownload,
}

export default CsvUtility
