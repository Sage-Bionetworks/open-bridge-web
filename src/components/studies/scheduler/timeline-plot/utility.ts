import {TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'

const Utility = {
  getGroupedDaysForSession,
  getDaysFractionForSingleSession,
}
function getStartDaysForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[]
): number[] {
  function filterItem(timelineItem: TimelineScheduleItem) {
    return timelineItem.refGuid === sessionGuid
  }

  return schedulingItems.filter(i => filterItem(i)).map(i => i.startDay)
}

function getGroupedDaysForSession(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number}
) {
  const i = interval
    ? schedulingItems.filter(
        i => i.startDay >= interval.start && i.endDay < interval.end
      )
    : schedulingItems
  const grouppedStartDays = _.groupBy(
    getStartDaysForSession(studySessionGuid, i),
    Math.floor
  )

  const startEventId = _.first(i)?.startEventId
  const startDaysWithinInterval = grouppedStartDays

  return {startDays: startDaysWithinInterval, startEventId: startEventId}
}

function getDaysFractionForSingleSession(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  interval: {start: number; end: number},

  maxWindowNumber: number
): {startEventId: string | undefined; coords: number[]} {
  let result: number[] = []
  const {startDays, startEventId} = getGroupedDaysForSession(
    studySessionGuid,
    schedulingItems,
    interval
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
