import { Assessment, StringDictionary } from './types'

export enum HSsEnum {
  H = 'hours',
  D = 'days',
}

export enum DWMYEnum {
  D = 'day',
  W = 'week',
  M = 'month',
  Y = 'year',
}

export enum DWMYsEnum {
  D = 'days',
  W = 'weeks',
  M = 'months',
  Y = 'years',
}

export enum HDWMEnum {
  H = 'hour',
  D = 'day',
  W = 'week',
  M = 'month',
}

export enum NotificationFreqEnum {
  'start_of_window' = 'At start of window',
  'participant_choice' = 'Participant Choice',
  'random' = 'Random within window',
}

export type ReminderIntervalType = 'before_window_end' | 'after_window_start'

export type PerformanceOrder =
  | 'sequential'
  | 'randomized'
  | 'participant_choice' //done

export type StartEventId = 'activities_retrieved' | 'study_start_date'

export type NotificationMessage = {
  lang?: string
  subject: string
  message: string
}

export type AssessmentWindow = {
  guid?: string
  startTime: string //(HH:MM)
  expiration: string //"P7D"
  persistent?: boolean
}

export type SessionSchedule = {
  delay?: string //PD
  interval?: string //PD
  occurrences?: number
  performanceOrder: PerformanceOrder
  timeWindows?: AssessmentWindow[]
  assessments?: Assessment[]
  notifyAt?: keyof typeof NotificationFreqEnum
  remindAt?: ReminderIntervalType
  reminderPeriod?: string //PT10M
  allowSnooze?: boolean
  messages?: NotificationMessage[]
}

export type StudySessionGeneral = {
  name: string
  labels?: StringDictionary<string>[]
  guid: string
  startEventId?: StartEventId
}

export type StudySession = StudySessionGeneral & SessionSchedule

export type Schedule = {
  name: string
  ownerId?: string //todo
  guid: string
  sessions: StudySession[]
  duration?: string //iso
  version?: number
  clientData?: any
}
