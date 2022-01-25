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
  sessionSymbol?: string
  entryIndex?: number
}> = ({
  byDayEntries,
  propertyValue,
  maxNumberOfTimeWindows,
  sequentialDayNumber,
  isCompliant,
  propertyName,
  sessionSymbol,
  entryIndex,
}) => {
  if (!byDayEntries[sequentialDayNumber]) {
    return <></>
  }

  const parsedValue =
    propertyName === 'sessionGuid' ? propertyValue : propertyValue.split(':')[2]
  let entry =
    entryIndex !== undefined
      ? byDayEntries[sequentialDayNumber][entryIndex]
      : undefined

  return entry ? (
    <>
      {entry.timeWindows.map((tw, itw) => (
        <TimeWindowPlotElement
          key={itw + 'indow'}
          maxNumberOfWindows={maxNumberOfTimeWindows}
          windowIndex={itw}
          startDate={entry!.startDate}
          windowState={tw.state}
          sessionSymbol={sessionSymbol!}
          isCompliant={isCompliant}
        />
      ))}
    </>
  ) : (
    <>
      {byDayEntries[sequentialDayNumber].map(
        entry =>
          //@ts-ignore
          entry[propertyName] &&
          //@ts-ignore
          entry[propertyName].includes(parsedValue) && (
            <>
              {entry.timeWindows.map((tw, itw) => (
                <TimeWindowPlotElement
                  key={itw + 'indow'}
                  maxNumberOfWindows={maxNumberOfTimeWindows}
                  windowIndex={itw}
                  startDate={entry.startDate}
                  windowState={tw.state}
                  sessionSymbol={sessionSymbol || entry.sessionSymbol}
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
