import {EventStreamDay} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {useCommonStyles} from './styles'
import TimeWindowPlotElement from './TimeWindowPlotElement'

const DayDisplay: FunctionComponent<{
  entry: EventStreamDay
  isCompliant: boolean
  timeZone: string
  numOfWin: number
  sessionSymbol: string
  dayWidth: number
  border?: boolean
}> = ({
  entry,
  isCompliant,
  timeZone,
  numOfWin,
  sessionSymbol,
  dayWidth,
  border = true,
}) => {
  const classes = {...useCommonStyles()}

  return (
    <div
      className={clsx(classes.dayCell, entry.today && 'today')}
      style={{
        width: `${dayWidth}px`,
        borderRight: border ? '1px solid black' : 'none',
      }}>
      {entry.timeWindows.map((tw, itw) => (
        <TimeWindowPlotElement
          key={`${tw.timeWindowGuid}_window_all`}
          maxNumberOfWindows={numOfWin}
          windowIndex={itw}
          startDate={entry!.startDate}
          windowState={tw.state}
          sessionSymbol={sessionSymbol!}
          isCompliant={isCompliant}
          timeZone={timeZone}
        />
      ))}
    </div>
  )
}

export default DayDisplay
