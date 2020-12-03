export type SessionScheduleStartType =
  | 'DAY1'
  | 'NDAYS_DAY1'



export enum HSsEnum {
  h = 'Hours',
  d = 'Days'
  }


export type SessionScheduleEndType = 'END_STUDY' | 'N_OCCURENCES'

export enum DWMYEnum {
  d = 'Day',
  w = 'Week',
 M = 'Month',
  y = 'Year'

}

export enum DWMYsEnum {
  d = 'Days',
  w = 'Weeks',
  M = 'Months',
  y = 'Years'
}

export enum HDWMEnum {
  h= 'Hour',
  d = 'Day',
  w = 'Week',
  M = 'Month'
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

export type WindowEndType = {
    endQuantity: number,
    endUnit:  keyof typeof  HSsEnum
}

export type WindowReminderType = {
  interval:  keyof typeof  ReminderIntervalEnum
  type: ReminderIntervalType
}

export type AssessmentWindow = {
  startHour: number
  end: WindowEndType,

  isAllowAnyFrequency?: boolean,
  notification?: NotificationFreqEnum
  isAllowSnooze?: boolean

  reminder?: WindowReminderType

}

export type Reoccurance = string/*{
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





export type StudyDuration =  string/*{
  unit:  keyof typeof DWMYsEnum
  quantity: number
}*/

export type SessionSchedule = {

  startDate: StartDate
  reoccurance: Reoccurance
  windows: AssessmentWindow[]
  endDate: EndDate
  isGroupAssessments?: boolean
  order: AssessmentOrder
}
