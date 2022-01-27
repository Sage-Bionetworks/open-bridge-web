import {
  AdherenceEventStream,
  AdherenceWeeklyReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import _ from 'lodash'

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
  return new Date(result).toLocaleDateString()
}

function getUniqueSessionsInfo(
  streams: (AdherenceEventStream | AdherenceWeeklyReport)[]
): SessionDisplayInfo[] {
  var result: SessionDisplayInfo[] = []

  for (var stream of streams) {
    const dayEntries = _.flatten(Object.values(stream.byDayEntries))
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
  return date
    ? new Date(date).toLocaleDateString()
    : 'Event date is not defined'
}

const AdherenceUtility = {
  getMaxNumberOfTimeWindows,
  getUniqueSessionsInfo,
  getDateForDisplay,
  getLastSchedleDate,
}

export default AdherenceUtility
