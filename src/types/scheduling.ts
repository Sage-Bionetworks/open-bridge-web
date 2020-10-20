export type SessionScheduleStartType =
  | 'OPEN_APP'
  | 'BASELINE_DATE'
  | 'NDAYS_BASELINE'
  | 'DATE'

export type SessionScheduleEndType = 'END_STUDY' | 'DATE' | 'N_OCCURENCES'


export enum ReoccuranceUnitEnum {
  'DAILY' = 'Every Day',
  'WEEKLY' = 'Every Week',
}

export enum WeekdaysEnum {
  'Su' = '0',
  'M' = '1',
  'T' = '2',
  'W' = '3',
  'TH' = '4',
  'F' = '5',
  'S' = '6',
}

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

export type ReminderIntervalType ='BEFORE' | 'AFTER'

export type AssessmentOrderType = 'SEQUENTIAL' | 'RANDOM'

export type WindowReminderType = {
  interval: ReminderIntervalEnum
  type: ReminderIntervalType
}

export type AssessmentWindowType = {
  start: number
  end: number
  allowSnooze?: boolean
  reminder?: WindowReminderType
  notification?: NotificationFreqEnum
}

export type ReoccuranceType = {
  unit: keyof typeof ReoccuranceUnitEnum
  frequency: number
  days?: WeekdaysEnum[]
}

export type StartDateType = {
  type: SessionScheduleStartType
  days?: number
  date?: Date
}

export type EndDateType = {
  type: SessionScheduleEndType
  days?: number
  date?: Date
}

export type SessionSchedule = {
  startDate: StartDateType
  reoccurance: ReoccuranceType
  windows: AssessmentWindowType[]
  endDate: EndDateType
  isGroupAssessments?: boolean
  order: AssessmentOrderType
}
