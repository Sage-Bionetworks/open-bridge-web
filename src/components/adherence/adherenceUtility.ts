import {
  AdherenceDetailReportWeek,
  AdherenceEventStream,
  AdherenceWeeklyReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import _ from 'lodash'
import moment from 'moment'

function getMaxNumberOfTimeWindows(
  streams: (AdherenceEventStream | AdherenceWeeklyReport)[]
): number {
  const maxNumberOfWindowsInStreams = streams.map(stream => {
    const dayEntires = _.flatten(Object.values(stream.byDayEntries))
    const maxWindowsInStream = Math.max(
      ...dayEntires.map(entry => entry.timeWindows.length)
    )
    return maxWindowsInStream
  })

  return Math.max(...maxNumberOfWindowsInStreams)
}

function getLastSchedleDate(
  streams: (AdherenceEventStream | AdherenceWeeklyReport)[]
): string {
  const maxNumberOfWindowsInStreams = streams.map(stream => {
    const dayEntires = _.flatten(Object.values(stream.byDayEntries))
    const windowEndDates = _.flatten(
      dayEntires.map(entry => entry.timeWindows.map(tw => tw.endDate))
    )
    const latestWindow = _.last(windowEndDates.sort()) || ''
    return latestWindow
  })

  var result = _.last(maxNumberOfWindowsInStreams.sort()) || ''
  return new Date(result).toDateString()
}

function getDisplayFromLabel(
  label: string,
  burstNumber: number | undefined,
  isReturnArray?: boolean
): string | string[] {
  const arr = label.split('/')
  const returnLabel =
    burstNumber !== undefined
      ? `${arr[1].trim()}/Burst ${burstNumber}`
      : `${arr[1].trim()}/${arr[0].trim()}`

  return isReturnArray ? returnLabel.split('/') : returnLabel
}

function getUniqueSessionsInfo(
  weeks: AdherenceDetailReportWeek[]
): SessionDisplayInfo[] {
  var result: SessionDisplayInfo[] = []

  for (var week of weeks) {
    const dayEntries = _.flatten(Object.values(week.byDayEntries)).filter(
      day => day.sessionGuid
    )
    for (var dayEntry of dayEntries) {
      if (!result.find(s => s.sessionGuid === dayEntry.sessionGuid)) {
        result.push({
          sessionGuid: dayEntry.sessionGuid,
          sessionName: dayEntry.sessionName,
          sessionSymbol: dayEntry.sessionSymbol,
        })
      }
    }
  }

  return result
}

function getDateForDisplay(date?: string) {
  return date ? moment(date).format('MM/DD/YYYY') : 'Event date is not defined'
}

const AdherenceUtility = {
  getMaxNumberOfTimeWindows,
  getUniqueSessionsInfo,
  getDateForDisplay,
  getLastSchedleDate,
  getDisplayFromLabel,
}

export default AdherenceUtility
