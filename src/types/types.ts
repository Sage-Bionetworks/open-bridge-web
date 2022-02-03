import constants from './constants'
import {Schedule, ScheduleNotification, SchedulingEvent} from './scheduling'

/* *** General Types ********************************/
//usage example type JsonPrimitive = SubType<Person, number | string>;
export type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
  }[keyof Base]
>
export interface StringDictionary<T> {
  [key: string]: T
}

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T
}

export interface Response<T> {
  status: number
  ok: boolean
  data: T
}

export interface ExtendedError extends Error {
  errors?: any
  statusCode?: number
  entity?: any
}

export type RequestStatus = 'IDLE' | 'PENDING' | 'RESOLVED' | 'REJECTED'

/*
'legacy	If not set, the study is in the LEGACY phase, and no domain logic will be applied to the study, enrollments, etc.
'design	Study is being designed and tested and has not begun. All accounts created in this phase are marked as test accounts, and schedules are still mutable. The study is not visible in public registries.
'recruitment	Study has launched and is visible in public registries, and accepting new participants through some form of enrollment. The schedule is published when the study is transitioned to this phase, and can no longer change.
'in_flight	The study is no longer accepting new participants, but participants are still active in the study. The study is no longer visible in public registries and will no longer accept new sign ups.
'analysis	All participants have completed the study protocol, and the data is being analyzed. For IRBs, this study is still open and it should still be available in administrative UIs for reporting, but no mobile or desktop participant-facing client should be engaged with the study.
'completed	Analysis has been completed and the study has been reported to the IRB. The study can now be logically deleted.
'withdrawn'*/

/* ***  User Types ********************************/

export type UserSessionData = {
  token: string | undefined
  orgMembership: string | undefined
  dataGroups?: string[]
  roles: AdminRole[]
  firstName?: string
  lastName?: string
  userName?: string
  alert?: string
  id: string
  appId: string
  demoExternalId?: string
}

export type AdminRole = typeof constants.org_roles[number]

export interface UserData {
  username?: string
  firstName: string
  lastName: string
  id: string
  // email?: string
}

export type LoggedInUserClientData = {demoExternalId?: string}

export interface LoggedInUserData extends UserData {
  sessionToken: string
  orgMembership: string
  dataGroups?: string[]
  roles: AdminRole[]
  clientData?: LoggedInUserClientData
}

export interface OrgUser extends LoggedInUserData {
  status: string
  email?: string
  synapseUserId: string
}

/* *** Assessment ********************************/
export type ResourceFormat = 'image/png'
export type AssessmentCategory = 'screenshot' | 'icon'
export type AssessmentResource = {
  category: AssessmentCategory
  deleted: boolean
  format: ResourceFormat
  guid: string
  language: string
  minRevision: 1
  modifiedOn: string
  title: string
  upToDate: boolean
  url: string
  version: number
}
export type Assessment = {
  createdOn: string
  customizationFields: object
  deleted: boolean
  guid: string
  identifier: string
  modifiedOn?: string
  normingStatus: string
  osName: string //iPhone OS"
  ownerId: string //sage-bionetworks"
  revision: number
  summary: string
  tags: string[]
  title: string
  type: string
  version: number
  validationStatus: string
  minutesToComplete: number
  resources?: any[]
  originGuid?: string
}

/* *** Study ********************************/
export type SignInType = 'phone_password' | 'external_id_password'
export type StudyPhase =
  | 'legacy'
  | 'design'
  | 'recruitment'
  | 'in_flight'
  | 'analysis'
  | 'completed'
  | 'withdrawn'
export type DisplayStudyPhase = 'DRAFT' | 'LIVE' | 'COMPLETED' | 'WITHDRAWN'
export type StudyDesignType = 'observation' | 'intervention'
export type Study = {
  identifier: string
  phase: StudyPhase
  version: number
  // name of the study
  name: string
  // this is the body text
  details?: string
  subtitle?: string
  description?: string
  customEvents?: SchedulingEvent[]
  studyLogoUrl?: string
  colorScheme?: ColorScheme
  irbProtocolId?: string
  contacts?: Contact[]
  studyDesignTypes?: StudyDesignType[]
  institutionId?: string
  diseases?: string[]
  keywords?: string
  signInTypes: SignInType[]
  clientData: {
    generateIds?: boolean
    backgroundRecorders?: BackgroundRecorders
    welcomeScreenData: WelcomeScreenData
    notifications?: StringDictionary<ScheduleNotification[]>
  }
  createdOn?: Date
  modifiedOn?: Date
  // date string
  irbExpiresOn?: string
  // date string
  irbDecisionOn?: string
  irbDecisionType?: 'exempt' | 'approved'
  irbName?: string
}

export type WelcomeScreenData = {
  welcomeScreenHeader: string
  welcomeScreenBody: string
  welcomeScreenFromText: string
  welcomeScreenSalutation: string
  useOptionalDisclaimer: boolean
  isUsingDefaultMessage: boolean
}

export type FileRevision = {
  name: string
  mimeType: string
  fileGuid?: string
  description?: string
  // date-time
  createdOn?: string
  size?: number
  uploadURL?: string
  downloadURL?: string
  status?: 'pending' | 'available'
  type?: string
}

export type Contact = {
  name: string
  role: string
  position?: string
  affiliation?: string
  address?: string
  email?: string
  phone?: Phone
  jurisdiction?: string
}

export type ColorScheme = {
  foreground?: string
  background?: string
  activated?: string
  inactivated?: string
  type?: string
}

export type BackgroundRecorders = {
  microphone?: boolean
  weather?: boolean
  motion?: boolean
}

export type StudyBuilderInfo = {
  schedule: Schedule
  study: Study
}

export type StudyBuilderComponentProps = {
  onUpdate: Function
  children?: React.ReactNode
  isReadOnly?: boolean
  hasObjectChanged: boolean
  saveLoader: boolean
}

export type SelectionType = 'ALL' | 'PAGE' | 'SOME' | 'NONE'

export type ParticipantActivityType = 'ACTIVE' | 'WITHDRAWN' | 'TEST'
export type ParticipantEvent = {
  eventId: string
  timestamp?: Date
}
export type EditableParticipantData = {
  events?: ParticipantEvent[]
  note?: string
  externalId?: string
  phone?: Phone
  phoneNumber?: string
  clientTimeZone?: string
  timeZone?: string
}

type EnrolledSubrecord = {
  externalId: string
  enrolledOn: string
}

export type ParticipantAccountSummary = {
  // isSelected?: boolean
  healthCode?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: Phone
  id: string
  studyIds?: string[]
  enrollments?: Record<string, EnrolledSubrecord>
  externalIds: StringDictionary<string>
  externalId?: string
  studyExternalId?: string
  status?: 'unverified' | 'pending' | 'verified'
  createdOn?: string
  note?: string
  dataGroups?: string[]
  clientTimeZone?: string
}

export type ExtendedParticipantAccountSummary = ParticipantAccountSummary & {
  events?: ParticipantEvent[]
  joinedDate?: Date | string
  // smsDate?: Date | string
  dateWithdrawn?: Date | string
  withdrawalNote?: string
  studyId?: string
}

export type EnrolledAccountRecord = {
  enrolledBy: OrgUser
  enrolledOn: Date
  externalId: string
  participant: {
    identifier: string
    phone: Phone
  }
  studyId: string
  withdrawalNote?: string
  withdrawnBy: OrgUser
  withdrawnOn: Date
  note?: string
}

export type Phone = {
  number: string
  regionCode: string
  nationalFormat?: string
}

/* ----------------  Adherence Types ------------------ */
export type AdherenceWindowState =
  | 'not_applicable'
  | 'not_yet_available'
  | 'unstarted'
  | 'started'
  | 'completed'
  | 'abandoned'
  | 'expired'
  | 'not_yet_available'
  | 'unstarted'
  | 'declined'

export type AdherenceSessionInfo = {
  sessionGuid: string
  sessionName: string
  sessionSymbol: string
  week: number
  studyBurstId: string
  studyBurstNum: number
  startDate: string
}

export type EventStreamDay = AdherenceSessionInfo & {
  startDay: number
  timeWindows: {
    sessionInstanceGuid: string
    timeWindowGuid: string
    state: AdherenceWindowState
    endDay: number
    endDate: string
  }[]
}

export type AdherenceByDayEntries = Record<string, EventStreamDay[]>

export type WeeklyAdherenceByDayEntries = Record<
  string,
  (EventStreamDay & {label: string})[]
>

export type AdherenceEventStream = {
  startEventId: string
  eventTimestamp: string
  sessionGuids: [string]
  byDayEntries: AdherenceByDayEntries
  type: 'EventStream'
}

export type EventStreamAdherenceReport = {
  timestamp: string
  clientTimeZone: string
  adherencePercent: number
  dayRangeOfAllStreams: {
    min: number
    max: number
  }
  streams: AdherenceEventStream[]
}

export type SessionDisplayInfo = {
  sessionName: string
  sessionGuid: string
  sessionSymbol: string
}

export type RowLabel = {
  label: string
  searchableLabel: string
  sessionGuid: string
  sessionName: string
  sessionSymbol: string
  week: number
  studyBurstId?: string
  studyBurstNum?: number
  type: string
}

export type AdherenceWeeklyReport = {
  participant: {identifier: string; externalId: string}
  //rowLabels: string[]
  rows: RowLabel[]
  weeklyAdherencePercent: number
  clientTimeZone: string
  createdOn: string
  byDayEntries: WeeklyAdherenceByDayEntries
  nextActivity?: AdherenceSessionInfo
}

// POST MVP

export type StudyArm = {
  id: string
  name: string
  studyId: string
  startEventId?: string
  schedule?: Schedule
  active?: boolean
}
