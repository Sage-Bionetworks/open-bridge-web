import { Assessment } from "./types"

export type SessionScheduleStartType = 'DAY1' | 'NDAYS_DAY1'

export enum HSsEnum {
  H = 'Hours',
  D = 'Days',
}

export type SessionScheduleEndType = 'END_STUDY' | 'N_OCCURENCES'

export enum DWMYEnum {
  D = 'Day',
  W = 'Week',
  M = 'Month',
  Y = 'Year',
}

export enum DWMYsEnum {
  D = 'Days',
  W = 'Weeks',
  M = 'Months',
  Y = 'Years',
}

export enum HDWMEnum {
  H = 'Hour',
  D = 'Day',
  W = 'Week',
  M = 'Month',
}

/*export enum WeekdaysEnum {
  'Su' = '0',
  'M' = '1',
  'T' = '2',
  'W' = '3',
  'TH' = '4',
  'F' = '5',
  'S' = '6',
}*/

export enum NotificationFreqEnum {
  'START_OF_WINDOW' = 'Start of window',
  'RANDOM' = 'Random within window',
}

export enum ReminderIntervalEnum {
  NONE = 'none',
  MIN_5 = '5 min',
  MIN_10 = '10 min',
  MIN_15 = '15 min',
  MIN_30 = '30 min',
  HR_1 = '1hr. ',
}

export type ReminderIntervalType = 'BEFORE' | 'AFTER'

export type AssessmentOrder = 'SEQUENTIAL' | 'RANDOM'

export type StartEventId = 'ONBOARDING' | 'START_DATE'

export type WindowEndType = string /*{
    //endQuantity: number,
    //endUnit:  keyof typeof  HSsEnum
}*/

export type NotificationReminder = {
  interval: keyof typeof ReminderIntervalEnum
  type?: ReminderIntervalType
}

export type AssessmentWindow = {
  startHour: number
  end: WindowEndType

  isAllowAnyFrequency?: boolean
}

export type Reoccurance = string /*{
  unit: keyof typeof DWMYEnum
  frequency: number
 // days?: WeekdaysEnum[]
}*/

export type StartDate = {
  type: SessionScheduleStartType
  // offsetNumber?: number
  // offsetUnit?: HDWMEnum
  offset?: string
}

export type EndDate = {
  type: SessionScheduleEndType
  days?: number
}

export type StudyDuration = string /*{
  unit:  keyof typeof DWMYsEnum
  quantity: number
}*/

export type SessionSchedule = {
  startDate: StartDate
  reoccurance: Reoccurance
  notification?: keyof typeof NotificationFreqEnum
  isAllowSnooze?: boolean

  reminder?: NotificationReminder
  windows: AssessmentWindow[]
  endDate: EndDate
  isGroupAssessments?: boolean
  order: AssessmentOrder
  subjectLine?: string
  bodyText?: string
}



export type StudySession = {
  id: string
  active?: boolean
  studyId: string
  //duration: number
  name: string
  assessments: Assessment[]
  order?: number
  sessionSchedule?: SessionSchedule
  // Guid: string
  /*Name: string
Bundled: boolean
Randomized: boolean
Delay: number
Interval: number
Duration: number(period
Expires number: Period
Occurrences Number*/
}

export type Schedule = {
  studyId?: string, 
  name: string
  startEventId?: StartEventId
  ownerId?: string //todo
  sessions: StudySession[]
}

