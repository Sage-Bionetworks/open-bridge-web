import {ToggleKey} from '@helpers/FeatureToggle'
import constants from './constants'
import {Schedule, ScheduleNotification, SchedulingEvent} from './scheduling'

/* *** General Types ********************************/
//usage example type JsonPrimitive = SubType<Person, number | string>;

export type Language = 'en' | 'es_es'
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

export type ViewType = 'LIST' | 'GRID'

export type OauthEnvironment = {
  client: string
  vendor: string
  redirect: string
  appId: string
  oneSageAppId: string
}

export type NavRouteType = {
  path: string
  name: string
  Component: React.FunctionComponent<any>
  exact?: boolean
  isRhs?: boolean
  toggle?: ToggleKey
}

/*
'legacy	If not set, the study is in the LEGACY phase, and no domain logic will be applied to the study, enrollments, etc.
'design	Study is being designed and tested and has not begun. All accounts created in this phase are marked as test accounts, and schedules are still mutable. The study is not visible in public registries.
'recruitment	Study has launched and is visible in public registries, and accepting new participants through some form of enrollment. The schedule is published when the study is transitioned to this phase, and can no longer change.
'in_flight	The study is no longer accepting new participants, but participants are still active in the study. The study is no longer visible in public registries and will no longer accept new sign ups.
'analysis	All participants have completed the study protocol, and the data is being analyzed. For IRBs, this study is still open and it should still be available in administrative UIs for reporting, but no mobile or desktop participant-facing client should be engaged with the study.
'completed	Analysis has been completed and the study has been reported to the IRB. The study can now be logically deleted.
'withdrawn'*/

/* ***  User Types ********************************/

export type AdminRole = typeof constants.org_roles[number]

export interface UserData {
  username?: string
  firstName?: string
  lastName?: string
  id: string
  orgMembership: string | undefined
  dataGroups?: string[]
  roles: AdminRole[]
  synapseUserId: string | undefined
  isVerified?: boolean

  // email?: string
}

export type LoggedInUserClientData = {demoExternalId?: string}

export interface LoggedInUserData extends UserData {
  sessionToken: string
  validated?: boolean
  email?: string
  clientData?: LoggedInUserClientData
}

export interface UserSessionData extends UserData {
  token: string | undefined
  alert?: string
  appId: string

  demoExternalId?: string
}

/* *** Assessment ********************************/
export type AssessmentsType = 'SURVEY' | 'OTHER'
export type ResourceFormat = 'image/png'
export type AssessmentCategory = 'screenshot' | 'icon' | 'website'
export type AssessmentResource = {
  category: AssessmentCategory
  deleted?: boolean
  format?: ResourceFormat
  guid?: string
  language?: string
  minRevision?: 1
  modifiedOn?: string
  title: string
  upToDate?: boolean
  creators?: string[]
  url: string
  version?: number
}
export type Assessment = {
  appId?: string
  labels?: string[]
  identifier: string
  revision: number
  osName?: 'Android' | 'iPhone OS' | 'Both' | 'Universal' //iPhone OS"
  ownerId?: string //sage-bionetworks"
  title: string

  createdOn?: string
  customizationFields?: object
  deleted?: boolean
  guid?: string

  modifiedOn?: string
  normingStatus?: string

  summary?: string
  tags: string[]

  version?: number
  validationStatus?: string
  minutesToComplete?: number
  resources?: AssessmentResource[]
  originGuid?: string
  imageResource?: AssessmentImageResource
}

export type AssessmentConfig = {
  guid: string
  config: JSON
}
export type AssessmentImageResource = {
  name: string

  module: 'sage_survey'
  labels: {
    lang: Language
    value: string
  }[]
  type: 'ImageResource'
}

/* *** Study ********************************/
export type SignInType = 'phone_password' | 'external_id_password'
export type StudyPhase = 'legacy' | 'design' | 'recruitment' | 'in_flight' | 'analysis' | 'completed' | 'withdrawn'
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
  studyStartEventId?: string
  exporter3Enabled?: boolean
  exporter3Configuration?: {}
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
  clientTimeZone?: string
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

export type ProgressionStatus = 'done' | 'in_progress' | 'unstarted' | 'no_schedule'

export type ParticipantClientData = {
  hasMigratedToV2?: boolean
  sessionStartLocalTimes?: {
    guid: string
    start: string // "09:30"
  }[]
  availability?: {
    wake: string // "09:30",
    bed: string //"17:30"
  }
  earnings: string[] /* [
      "$6.00",
      "$29.00"]*/
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
  clientData?: ParticipantClientData
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
  enrolledBy: LoggedInUserData
  enrolledOn: Date
  externalId: string
  participant: {
    identifier: string
    phone: Phone
  }
  studyId: string
  withdrawalNote?: string
  withdrawnBy: LoggedInUserData
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
  | 'declined'

export type AdherenceSessionInfo = {
  sessionGuid: string
  sessionName: string
  sessionSymbol: string
  weekInStudy: number
  studyBurstId: string
  studyBurstNum: number
  startDate: string
}

export type EventStreamDayTimeWindow = {
  sessionInstanceGuid: string
  timeWindowGuid: string
  state: AdherenceWindowState
  startTime?: string
  endTime?: string
  endDay: number
  endDate: string
}
export type EventStreamDay = AdherenceSessionInfo & {
  today?: boolean
  startDay: number
  timeWindows: EventStreamDayTimeWindow[]
}

export type AdherenceByDayEntries = Record<string, EventStreamDay[]>

export type AdherenceDetailReportWeek = {
  weekInStudy: number

  startDate: string
  adherencePercent: number
  rows: RowLabel[]
  byDayEntries: AdherenceByDayEntries
}

export type AdherenceDetailReport = {
  participant: {identifier: string; externalId: string}

  testAccount?: boolean
  progression: ProgressionStatus
  dateRange: {
    startDate: string //YYYY-MM-DD
    endDate: string
  }

  adherencePercent: number
  clientTimeZone: string
  createdOn: string
  weeks: AdherenceDetailReportWeek[]

  nextActivity: AdherenceSessionInfo
  unsetEventIds: string[]
  unscheduledSessions: string[]
  eventTimestamps: Record<string, string>
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
  startEventId: string
  weekInStudy: number
}

export type AdherenceWeeklyReport = {
  participant: {identifier: string; externalId: string}

  weekInStudy: number
  startDate: string

  testAccount?: boolean
  progression: ProgressionStatus
  rows: RowLabel[]
  weeklyAdherencePercent: number
  clientTimeZone: string
  createdOn: string
  byDayEntries: AdherenceByDayEntries
  nextActivity?: AdherenceSessionInfo
}

/* Adherence statistics*/

export type AdherenceStatisticsEntry = {
  label: string
  searchableLabel: string
  sessionName: string
  weekInStudy: number
  studyBurstId: string
  studyBurstNum: number
  totalActive: number
}

export type AdherenceStatistics = {
  adherenceThresholdPercentage: number
  compliant: number
  noncompliant: number
  totalActive: number
  entries: AdherenceStatisticsEntry[]
}

export type AdherenceAlertCategory =
  | 'new_enrollment'
  | 'timeline_accessed'
  | 'low_adherence'
  | 'upcoming_study_burst'
  | 'study_burst_change'

export type AdherenceAlert = {
  id: string
  createdOn: string
  participant: {identifier: string; externalId: string}
  category: AdherenceAlertCategory
  data: string
}

export type ParticipantRequestInfo = {
  userId: string
  clientInfo: {
    appName: string
    appVersion: number
    deviceName: string
    osName: string
    osVersion: string
    sdkName: string
    sdkVersion: number
  }
  userAgent: string
  languages: string[]
  userDataGroups: string[]
  userStudyIds: string[]
  signedInOn: string
  uploadedOn: string //eg "2022-04-02T04:44:20.086Z",
  timeZone: string
  timelineAccessedOn: string
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
