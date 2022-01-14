import {AdherenceByDayEntries} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import TimeWindowPlotElement from './TimeWindowPlotElement'

const DayDisplayForSessions: FunctionComponent<{
  dayWidthInPx: number
  sequentialDayNumber: number
  byDayEntries: AdherenceByDayEntries
  maxNumberOfTimeWindows: number
  sessionGuid: string
  isCompliant: boolean
}> = ({
  byDayEntries,
  sessionGuid,
  maxNumberOfTimeWindows,
  sequentialDayNumber,
  isCompliant,
}) => {
  if (!byDayEntries[sequentialDayNumber]) {
    return <></>
  }

  return (
    <>
      {byDayEntries[sequentialDayNumber].map(
        entry =>
          entry.sessionGuid === sessionGuid && (
            <>
              {entry.timeWindows.map((tw, itw) => (
                <TimeWindowPlotElement
                  maxNumberOfWindows={maxNumberOfTimeWindows}
                  windowIndex={itw}
                  startDate={entry.startDate}
                  windowState={tw.state}
                  sessionSymbol={entry.sessionSymbol}
                  isCompliant={isCompliant}
                />
              ))}
            </>
          )
      )}
    </>
  )
}

export default DayDisplayForSessions
