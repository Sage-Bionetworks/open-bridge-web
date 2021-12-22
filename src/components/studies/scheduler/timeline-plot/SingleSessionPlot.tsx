import SessionIcon from '@components/widgets/SessionIcon'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {CoordItem} from './utility'

const useStyles = makeStyles(theme => ({}))

export interface SingleSessionPlotProps {
  lineNumber?: number
  sessionIndex?: number
  sessionGuid: string

  unitPixelWidth: number
  topOffset?: number
  sessionSymbol?: string
  xCoords: CoordItem[]
}

const SessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  sessionIndex,
  topOffset = 2,
  unitPixelWidth,
  sessionSymbol,
  lineNumber,
  xCoords,
}) => {
  const dayDividers = [...new Array(8)].map((i, index) => (
    <div
      key={`day_${index}`}
      style={{
        width: '1px',
        height: '16px',
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 100,
        top: `0`,
        left: `${index * unitPixelWidth}px`,
      }}></div>
  ))
  const sessionGraph = xCoords.map(({c: i, expiration}) => (
    <Tooltip
      title={expiration}
      placement="top"
      key={`session${i}_${unitPixelWidth * i}_${sessionIndex}_${lineNumber}`}>
      <div
        style={{
          position: 'absolute',
          zIndex: 100,

          top: `${topOffset}px`,
          left: `${i * unitPixelWidth - 6}px`,
        }}>
        <SessionIcon
          symbolKey={sessionSymbol}
          index={sessionIndex}></SessionIcon>
      </div>
    </Tooltip>
  ))
  return (
    <div style={{position: 'relative', height: '18px'}}>
      {dayDividers}
      {sessionGraph}
    </div>
  )
}

export default React.memo(SessionPlot)
