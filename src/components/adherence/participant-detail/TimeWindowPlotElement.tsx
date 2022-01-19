import {Tooltip} from '@material-ui/core'
import {AdherenceWindowState} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import AdherenceSessionIcon from './AdherenceSessionIcon'

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
    <Tooltip title={startDate}>
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
