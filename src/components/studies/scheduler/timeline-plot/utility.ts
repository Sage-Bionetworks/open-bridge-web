import _ from 'lodash'
import moment from 'moment'
import {
  daysPage,
  TimelineScheduleItem,
  TimelineZoomLevel,
  unitPixelWidth,
} from './types'

function getZoomLevel(scheduleDuration: string): {
  lengthInDays: number
  periods: TimelineZoomLevel[]
} {
  const periods: TimelineZoomLevel[] = [
    'Daily',
    'Weekly',
    'Monthly',
    'Quarterly',
  ]
  const duration = moment.duration(scheduleDuration)

  const lengthInDays = duration.asDays()

  if (lengthInDays < 2) {
    periods.splice(1)
  } else if (lengthInDays < 31) {
    periods.splice(2)
  } else if (lengthInDays < 92) {
    periods.splice(3)
  }
  return {lengthInDays, periods}
}

function getContainerWidth(lengthInDays: number, zoomLevel: TimelineZoomLevel) {
  const minWidth = unitPixelWidth[zoomLevel] * daysPage[zoomLevel]
  const realWidth = unitPixelWidth[zoomLevel] * lengthInDays
  return Math.max(realWidth, minWidth)
}

const Utility = {
  getZoomLevel,
  getContainerWidth,
  getGroupedDaysForSession,
  getDaysFractionForSingleSession,
}
function getTimesForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[]
): number[] {
  return schedulingItems
    .filter(i => i.refGuid === sessionGuid)
    .map(i => i.startDay)
}

function getGroupedDaysForSession(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number}
) {
  const grouppedStartDays = _.groupBy(
    getTimesForSession(studySessionGuid, schedulingItems),
    Math.floor
  )
  const startDays = interval
    ? _.pickBy(grouppedStartDays, function (value, key) {
        return Number(key) >= interval.start && Number(key) < interval.end
      })
    : grouppedStartDays

  return startDays
}

function getDaysFractionForSingleSession(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number}
): number[] {
  let result: number[] = []
  const startDays = getGroupedDaysForSession(
    studySessionGuid,
    schedulingItems,
    interval
  )

  Object.values(startDays).forEach(groupArray => {
    const fraction = 1 / groupArray.length
    groupArray.forEach((item, index) => {
      let val = item + fraction * index
      if (interval) {
        val = val + 0.5 / groupArray.length
        val = val - interval.start
      }
      result.push(val)
    })
  })

  return result
}

export default Utility
