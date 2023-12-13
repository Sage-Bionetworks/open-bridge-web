import {BorderedTableCell} from '@components/widgets/StyledComponents'
import {Box, Typography} from '@mui/material'
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
  }
  const weeklyTodayStyle: React.CSSProperties = {
    paddingTop: '10px',
    backgroundColor: 'rgba(148, 153, 199, 0.15)',
    paddingBottom: '10px',
  }

  if (todayStyle && entry?.today) {
    divStyle = {...divStyle, ...weeklyTodayStyle}
  }
  if (!entry) {
    return <BorderedTableCell className={clsx(classes.dayCell)} style={divStyle}></BorderedTableCell>
  }

  //we have a carry over from previous week if it's the first day and the date is diff. from the report start date
  const carryOver = relevantReportStartDate && entry.startDate !== relevantReportStartDate

  if (carryOver) {
    return (
      <BorderedTableCell
        className={clsx(classes.dayCell)}
        style={{
          ...divStyle,
        }}>
        <Typography sx={{paddingLeft: '4px', fontSize: '9px', fontStyle: 'italic'}}>
          continued from previous week
        </Typography>
      </BorderedTableCell>
    )
  }

  return (
    <BorderedTableCell className={clsx(classes.dayCell, entry.today && 'today')} style={divStyle}>
      <Box sx={{display: 'flex'}}>
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
      </Box>
    </BorderedTableCell>
  )
}

export default DayDisplay
