import {
  AdherenceByDayEntries,
  WeeklyAdherenceByDayEntries,
} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import TimeWindowPlotElement from './TimeWindowPlotElement'

const DayDisplayForSession: FunctionComponent<{
  sequentialDayNumber: number
  byDayEntries: WeeklyAdherenceByDayEntries | AdherenceByDayEntries
  maxNumberOfTimeWindows: number
  propertyValue: string
  isCompliant: boolean
  propertyName: 'sessionGuid' | 'label'
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
  const parsedValue =
    propertyName === 'sessionGuid' ? propertyValue : propertyValue.split(':')[2]
  return (
    <>
      {byDayEntries[sequentialDayNumber].map(
        entry =>
          //@ts-ignore
          entry[propertyName].includes(parsedValue) && (
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
