import {TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'
import moment from 'moment'

function getScheduleDurationInDays(scheduleDuration: string): number {
  const duration = moment.duration(scheduleDuration)
  const lengthInDays = duration.asDays()
  return lengthInDays
}

const Utility = {
  getScheduleDurationInDays,

  getGroupedDaysForSession,
  getDaysFractionForSingleSession,
}
function getStartDaysForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  includeBurst?: boolean
): number[] {
  function filterItem(timelineItem: TimelineScheduleItem) {
    //if study burst -- only return first burst
    if (includeBurst) {
      return timelineItem.refGuid === sessionGuid
    } else {
      return (
        timelineItem.refGuid === sessionGuid &&
        (!/study_burst:/.test(timelineItem.startEventId) ||
          /study_burst:(\w+):01/.test(timelineItem.startEventId))
      )
    }
  }

  return schedulingItems.filter(i => filterItem(i)).map(i => i.startDay)
}

function getGroupedDaysForSession(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number},
  includeBurst?: boolean
) {
  const i = interval
    ? schedulingItems.filter(
        i => i.startDay >= interval.start && i.endDay < interval.end
      )
    : schedulingItems
  const grouppedStartDays = _.groupBy(
    getStartDaysForSession(studySessionGuid, i, includeBurst),
    Math.floor
  )
  /* const startDaysWithinInterval = interval
    ? _.pickBy(grouppedStartDays, function (value, key) {
        return Number(key) >= interval.start && Number(key) < interval.end
      })
    : grouppedStartDays*/
  const startEventId = _.first(i)?.startEventId
  const startDaysWithinInterval = grouppedStartDays

  return {startDays: startDaysWithinInterval, startEventId: startEventId}
}

function getDaysFractionForSingleSession(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number},
  includeBurst?: boolean,
  maxWindowNumber?: number
): {startEventId: string | undefined; coords: number[]} {
  let result: number[] = []
  const {startDays, startEventId} = getGroupedDaysForSession(
    studySessionGuid,
    schedulingItems,
    interval,
    includeBurst
  )

  Object.values(startDays).forEach(groupArray => {
    const fraction = 1 / (maxWindowNumber || groupArray.length)
    groupArray.forEach((item, index) => {
      let val = item + fraction * index
      if (interval) {
        val = val + 0.5 / (maxWindowNumber || groupArray.length)
        val = val - interval.start
      }
      result.push(val)
    })
  })

  return {startEventId, coords: result}
}

export default Utility
