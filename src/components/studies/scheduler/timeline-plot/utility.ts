import {TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'

const Utility = {
  getGroupedDaysForSessionWeek,
  getDaysFractionForSingleSessionWeek,
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

function getGroupedDaysForSessionWeek(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  weekNumber: number
) {
  const interval = {start: weekNumber * 7, end: (weekNumber + 1) * 7}
  const i = schedulingItems.filter(
    i => i.startDay >= interval.start && i.startDay < interval.end
  )

  const grouppedStartDays = _.groupBy(
    getStartDaysForSession(studySessionGuid, i),
    Math.floor
  )

  const startEventId = _.first(i)?.startEventId
  const startDaysWithinInterval = grouppedStartDays

  return {startDays: startDaysWithinInterval, startEventId: startEventId}
}

function getDaysFractionForSingleSessionWeek(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  weekNumber: number,

  maxWindowNumber: number
): {startEventId: string | undefined; coords: number[]} {
  let result: number[] = []
  const {startDays, startEventId} = getGroupedDaysForSessionWeek(
    studySessionGuid,
    schedulingItems,
    weekNumber
  )

  Object.values(startDays).forEach(groupArray => {
    const fraction = 1 / (maxWindowNumber || groupArray.length)
    groupArray.forEach((item, index) => {
      let val = item + fraction * index

      val = val + 0.5 / (maxWindowNumber || groupArray.length)
      val = val - weekNumber * 7

      result.push(val)
    })
  })

  return {startEventId, coords: result}
}

export default Utility
