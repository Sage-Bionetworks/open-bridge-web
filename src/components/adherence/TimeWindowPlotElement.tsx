import {Tooltip} from '@mui/material'
import {AdherenceWindowState} from '@typedefs/types'
import {FunctionComponent} from 'react'
import AdherenceUtility from './adherenceUtility'
import AdherenceSessionIcon from './participant-detail/AdherenceSessionIcon'

const TimeWindowPlotElement: FunctionComponent<{
  windowIndex: number

  sessionSymbol: string
  windowState: AdherenceWindowState
  startDate: string
  startTime?: string
  endDate: string

  endTime?: string
  maxNumberOfWindows: number
  isCompliant: boolean
  timeZone?: string
}> = ({
  startDate,
  startTime,
  endDate,
  endTime,
  windowIndex,
  sessionSymbol,
  windowState,
  maxNumberOfWindows,
  isCompliant,
  timeZone,
}) => {
  const tooltipTitle = (
    <div>
      {timeZone && <div>{timeZone}</div>}{' '}
      {AdherenceUtility.getDateForDisplay(startDate)}
      {AdherenceUtility.getTimeForDisplay(startTime)}
      <div style={{marginTop: '8px'}}>
        <i>
          Expires on: {AdherenceUtility.getDateForDisplay(endDate)}
          {AdherenceUtility.getTimeForDisplay(endTime)}
        </i>
      </div>
    </div>
  )
  return (
    <Tooltip title={tooltipTitle} arrow={true} placement="top">
      <div
        id={'window_' + windowIndex}
        style={{
          textAlign: 'center',
          width: `${Math.floor(100 / maxNumberOfWindows)}%`,
        }}>
        <AdherenceSessionIcon
          sessionSymbol={sessionSymbol}
          windowState={windowState}
          isRed={!isCompliant}
        />
      </div>
    </Tooltip>
  )
}

export default TimeWindowPlotElement
