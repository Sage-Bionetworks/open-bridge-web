import {TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'
import {getFormattedTimeDateFromPeriodString} from '../utility'

const Utility = {
  getDaysFractionForSingleSessionWeek,
  getSchedulingItemsForWeek,
}

export type CoordItem = {
  c: number
  expiration: string
}

function getSchedulingItemsForWeek(
  schedulingItems: TimelineScheduleItem[],
  weekNumber: number
): TimelineScheduleItem[] {
  return schedulingItems.filter(i => i.startDay >= weekNumber * 7 && i.startDay < (weekNumber + 1) * 7)
}

function getDaysFractionForSingleSessionWeek(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  weekNumber: number,
  maxWindowNumber: number
): {
  startEventId: string | undefined
  coords: CoordItem[]
} {
  let result: CoordItem[] = []
  const itemsForSessionWithinInterval = getSchedulingItemsForWeek(schedulingItems, weekNumber).filter(
    i => i.refGuid === studySessionGuid
  )

  const grouppedStartDays = _.groupBy(itemsForSessionWithinInterval, i => Math.floor(i.startDay))

  const startEventId = _.first(itemsForSessionWithinInterval)?.startEventId

  Object.values(grouppedStartDays).forEach(groupArray => {
    const fraction = 1 / maxWindowNumber
    groupArray.forEach((item, index) => {
      let val = item.startDay + fraction * index

      val = val + 0.5 / maxWindowNumber
      val = val - weekNumber * 7

      result.push({
        c: val,
        expiration: getFormattedTimeDateFromPeriodString(item.expiration),
      })
    })
  })

  return {startEventId, coords: result}
}

export default Utility
