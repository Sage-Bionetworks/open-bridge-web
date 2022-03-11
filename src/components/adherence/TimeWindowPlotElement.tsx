import {Tooltip} from '@material-ui/core'
import {AdherenceWindowState} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from './adherenceUtility'
import AdherenceSessionIcon from './participant-detail/AdherenceSessionIcon'

const TimeWindowPlotElement: FunctionComponent<{
  windowIndex: number

  sessionSymbol: string
  windowState: AdherenceWindowState
  startDate: string
  maxNumberOfWindows: number
  isCompliant: boolean
  timeZone?: string
}> = ({
  startDate,
  windowIndex,
  sessionSymbol,
  windowState,
  maxNumberOfWindows,
  isCompliant,
  timeZone,
}) => {
  const tooltipTitle = (
    <>
      {timeZone && (
        <>
          {timeZone} <br />
        </>
      )}{' '}
      {AdherenceUtility.getDateForDisplay(startDate)}
    </>
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
