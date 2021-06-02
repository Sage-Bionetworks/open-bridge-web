import { Schedule, ScheduleNotification, StartEventId } from './scheduling'

/* *** General Types ********************************/
export interface StringDictionary<T> {
  [key: string]: T
}

export interface Response<T> {
  status: number
  ok: boolean
  data: T
}

export type RequestStatus = 'IDLE' | 'PENDING' | 'RESOLVED' | 'REJECTED'

export type StudyPhase = 'legacy'| 'design'| 'recruitment'| 'in_flight'|'analysis'|'completed'|'withdrawn'
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
  roles: AdminRoles[]
  firstName?: string
  lastName?: string
  userName?: string
  alert?: string
  id: string
}

export type AdminRoles =
  | 'developer'
  | 'researcher'
  | 'study_coordinator'
  | 'admin'
  | 'org_admin'
  | 'worker'

export interface UserData {
  username?: string
  firstName: string
  lastName: string
  id: string
  // email?: string
}

export interface LoggedInUserData extends UserData {
  sessionToken: string
  orgMembership: string
  dataGroups?: string[]
  roles: AdminRoles[]
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
export type EnrollmentType = 'ID' | 'PHONE'
//export type StudyStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED'
export type StudyDesignType='observation' | 'intervention'
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
  scheduleGuid?: string

  studyLogoUrl?: string
  colorScheme?: ColorScheme
  irbProtocolId?: string
  contacts?: Contact[]
  studyDesignType?: StudyDesignType
  institutionId?: string
  disease?: string,
  clientData: {
    enrollmentType?: EnrollmentType
    generateIds?: boolean
    backgroundRecorders?: BackgroundRecorders
    welcomeScreenData?: WelcomeScreenData
    notifications?: StringDictionary<ScheduleNotification[]>
    keywords?: string
  }
  createdOn?: Date
  modifiedOn?: Date
}

export type WelcomeScreenData = {
  welcomeScreenHeader: string
  welcomeScreenBody: string
  welcomeScreenFromText: string
  welcomeScreenSalutation: string
  useOptionalDisclaimer: boolean
  isUsingDefaultMessage: boolean
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

export type StudyAppDesign = {
  logo: string
  backgroundColor: ColorScheme
  welcomeScreenInfo: WelcomeScreenData
  studyTitle: string
  studySummaryBody: string
  irbProtocolId: string
  leadPrincipleInvestigatorInfo: Contact | undefined
  contactLeadInfo: Contact | undefined
  ethicsBoardInfo: Contact | undefined
  funder: Contact | undefined
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
  hasObjectChanged: boolean
  saveLoader: boolean
}

export type ParticipantActivityType = 'ACTIVE' | 'WITHDRAWN'
export type EditableParticipantData = {
  clinicVisitDate?: Date
  notes?: string
  externalId?: string
  phone?: Phone
  phoneNumber?: string
}

export type ParticipantAccountSummary = {
  // isSelected?: boolean
  firstName?: string
  lastName?: string
  email?: string
  phone?: Phone
  id: string
  studyIds?: string[]
  externalIds: StringDictionary<string>
  externalId?: string
  studyExternalId?: string
  status?: 'unverified' | 'pending' | 'verified'
  createdOn?: string
  notes?: string
}

export type ExtendedParticipantAccountSummary = ParticipantAccountSummary & {
  clinicVisit?: Date | string
  dateJoined?: Date | string
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
}

export type Phone = {
  number: string
  regionCode: string
  nationalFormat?: string
}

// POST MVP

export type StudyArm = {
  id: string
  name: string
  studyId: string
  startEventId?: StartEventId
  schedule?: Schedule
  active?: boolean
}
