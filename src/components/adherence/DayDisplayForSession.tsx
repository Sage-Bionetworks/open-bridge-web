import {
  AdherenceByDayEntries,
  WeeklyAdherenceByDayEntries,
} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import TimeWindowPlotElement from './participant-detail/TimeWindowPlotElement'

const DayDisplayForSession: FunctionComponent<{
  sequentialDayNumber: number
  byDayEntries: WeeklyAdherenceByDayEntries | AdherenceByDayEntries
  maxNumberOfTimeWindows: number
  propertyValue: string
  isCompliant: boolean
  propertyName: string
}> = ({
  byDayEntries,
  propertyValue,
  maxNumberOfTimeWindows,
  sequentialDayNumber,
  isCompliant,
  propertyName,
}) => {
  if (!byDayEntries[sequentialDayNumber]) {
    return <></>
  }

  return (
    <>
      {byDayEntries[sequentialDayNumber].map(
        entry =>
          //@ts-ignore
          entry[propertyName] === propertyValue && (
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

export default DayDisplayForSession
