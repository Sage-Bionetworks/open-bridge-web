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
  relevantReportStartDate?: string
  border?: boolean
  todayStyle?: boolean
}> = ({
  entry,
  isCompliant,
  timeZone,
  numOfWin,
  sessionSymbol,
  dayWidth,
  todayStyle,
  relevantReportStartDate,
  border = true,
}) => {
  const classes = {...useCommonStyles()}

  let divStyle: React.CSSProperties = {
    width: `${dayWidth}px`,
    borderRight: border ? '1px solid black' : 'none',
  }
  const weeklyTodayStyle: React.CSSProperties = {
    paddingTop: '10px',
    backgroundColor: '#FFFF54',
    paddingBottom: '10px',
    marginLeft: '-1px',
    //marginRight: '-1px',
    borderLeft: '1px solid black',
  }

  if (todayStyle && entry?.today) {
    divStyle = {...divStyle, ...weeklyTodayStyle}
  }
  if (!entry) {
    return <div className={clsx(classes.dayCell)} style={divStyle}></div>
  }

  //we have a carry over from previous week if it's the first day and the date is diff. from the report start date
  const carryOver = relevantReportStartDate && entry.startDate !== relevantReportStartDate

  if (carryOver) {
    return (
      <div
        className={clsx(classes.dayCell)}
        style={{
          ...divStyle,
          fontSize: '9px',
          fontStyle: 'italic',
          paddingLeft: '4px',
        }}>
        continued from previous week
      </div>
    )
  }

  return (
    <div className={clsx(classes.dayCell, entry.today && 'today')} style={divStyle}>
      {entry.timeWindows.map((tw, itw) => (
        <TimeWindowPlotElement
          key={`${tw.timeWindowGuid}_window_all`}
          maxNumberOfWindows={numOfWin}
          windowIndex={itw}
          startDate={entry!.startDate}
          startTime={tw.startTime}
          endDate={tw.endDate}
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
