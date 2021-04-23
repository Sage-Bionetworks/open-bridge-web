import { Schedule, StartEventId } from './scheduling'

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
export type StudyStatus = 'DRAFT' | 'ACTIVE' | 'COMPLETED'
export type Study = {
  identifier: string
  status: StudyStatus
  version: number
  // name of the study
  name: string
  // this is the body text
  details?: string

  subtitle?: string
  description?: string
  scheduleGuid?: string

  studyLogoUrl?: string
  colorScheme?: string
  irbProtocolId?: string
  contacts?: Contact[]
  clientData: {
    enrollmentType?: EnrollmentType
    generateIds?: boolean
    backgroundRecorders?: BackgroundRecorders
    welcomeScreenData?: WelcomeScreenData
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
  backgroundColor: string
  welcomeScreenInfo: WelcomeScreenData
  studyTitle: string
  studySummaryBody: string
  irbProtocolId: string
  leadPrincipleInvestigatorInfo: Contact | undefined
  contactLeadInfo: Contact | undefined
  ethicsBoardInfo: Contact | undefined
  funder: Contact | undefined
}

export type BackgroundRecorders = {
  accelGyro: boolean
  backgroundNoise: boolean
  weatherPolution: boolean
  passiveGaitDisplacement: boolean
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
