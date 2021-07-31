export type TimelineSession = {
  guid: string
  label: string
  minutesToComplete: number
}

export type TimelineScheduleItem = {
  startDay: number
  endDay: number
  startTime: string
  delayTime: string
  expiration: string
  refGuid: string
  assessments?: any[]
}

/*export const unitPixelWidth: Record<TimelineZoomLevel, number> = {
  Daily: 1020,
  Monthly: 35,
  'Bi-Weekly': 80,
  Weekly: 162,
  Quarterly: 11,
}*/

export const unitPixelWidth: Record<TimelineZoomLevel, number> = {
  Daily: 1020,
  Monthly: 35,
  'Bi-Weekly': 80,
  Weekly: 102,
  Quarterly: 11,
}

export type TimelineZoomLevel =
  | 'Daily'
  | 'Weekly'
  | 'Bi-Weekly'
  | 'Monthly'
  | 'Quarterly'
