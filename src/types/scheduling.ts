export type SessionScheduleStartType =
  | 'DAY1'
  | 'NDAYS_DAY1'

export enum UnitHDWMEnum {
DAY = 'Day',
HOUR = 'Hour',
WEEK = 'Week',
MONTH = 'Month'
}

export enum UnitEndWindowEnum {
  HOUR = 'Hours',
  DAYS = 'Days'

  }


export type SessionScheduleEndType = 'END_STUDY' | 'N_OCCURENCES'

export enum ReoccuranceUnitEnum {
  DAY = 'Day',

  WEEK = 'Week',
  MONTH = 'Month',
  YEAR = 'Year'
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

export type AssessmentOrderType = 'SEQUENTIAL' | 'RANDOM'

export type WindowEndType = {

    endNumber: number,
    endUnit: UnitEndWindowEnum
}

export type WindowReminderType = {
  interval: ReminderIntervalEnum
  type: ReminderIntervalType
}

export type AssessmentWindowType = {
  start: number
  end: WindowEndType,

  allowAnyFrequency?: boolean,
  notification?: NotificationFreqEnum
  allowSnooze?: boolean

  reminder?: WindowReminderType

}

export type ReoccuranceType = {
  unit: keyof typeof ReoccuranceUnitEnum
  frequency: number
 // days?: WeekdaysEnum[]
}

export type StartDateType = {
  type: SessionScheduleStartType
  offsetNumber?: number
  offsetUnit?: UnitHDWMEnum
}

export type EndDateType = {
  type: SessionScheduleEndType
  days?: number

}

export type SessionSchedule = {
  startDate: StartDateType
  reoccurance: ReoccuranceType
  windows: AssessmentWindowType[]
  endDate: EndDateType
  isGroupAssessments?: boolean
  order: AssessmentOrderType
}
