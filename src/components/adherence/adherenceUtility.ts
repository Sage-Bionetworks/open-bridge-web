import {
  AdherenceByDayEntries,
  AdherenceDetailReportWeek,
  AdherenceWeeklyReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import _ from 'lodash'
import moment from 'moment'

function getMaxNumberOfTimeWindows(
  streams: (AdherenceDetailReportWeek | AdherenceWeeklyReport)[]
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
/*
// agendel: seems like this is retruned by the server
function getLastSchedleDate(
  streams: (AdherenceDetailReportWeek | AdherenceWeeklyReport)[]
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
}*/

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
  items: AdherenceWeeklyReport[] | AdherenceDetailReportWeek[]
): SessionDisplayInfo[] {
  const labels = _.flatten(items.map(i => i.rows))
  const result: SessionDisplayInfo[] = labels
    .filter(label => !!label)
    .map(label => ({
      sessionGuid: label.sessionGuid,
      sessionName: label.sessionName,
      sessionSymbol: label.sessionSymbol,
    }))

  return _.uniqBy(result, 'sessionGuid')
}

function getDateForDisplay(date?: string) {
  return date ? moment(date).format('MM/DD/YYYY') : 'Event date is not defined'
}

function getItemFromByDayEntries(
  byDayEntries: AdherenceByDayEntries,
  dayIndex: number,
  rowIndex: number
) {
  return byDayEntries[dayIndex][rowIndex]
}

const AdherenceUtility = {
  getMaxNumberOfTimeWindows,
  getUniqueSessionsInfo,
  getDateForDisplay,

  getDisplayFromLabel,
  getItemFromByDayEntries,
}

export default AdherenceUtility
