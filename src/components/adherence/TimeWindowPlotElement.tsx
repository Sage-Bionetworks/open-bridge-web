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
}> = ({
  startDate,
  windowIndex,
  sessionSymbol,
  windowState,
  maxNumberOfWindows,
  isCompliant,
}) => {
  return (
    <Tooltip title={AdherenceUtility.getDateForDisplay(startDate)}>
      <div
        id={'window_' + windowIndex}
        style={{
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