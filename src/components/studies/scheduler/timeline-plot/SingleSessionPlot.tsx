import SessionIcon from '@components/widgets/SessionIcon'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles(theme => ({}))

export interface SingleSessionPlotProps {
  // sessionIndex: number
  sessionGuid: string

  unitPixelWidth: number
  displayIndex: number
  sessionSymbol?: string
  xCoords: number[]
}

const SessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  // sessionIndex,
  displayIndex,
  unitPixelWidth,
  sessionSymbol,
  xCoords,
}) => {
  const days = [...new Array(8)].map((i, index) => (
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
  const sessionGraph = xCoords.map(i => (
    <SessionIcon
      key={`session${i}`}
      // index={sessionIndex}
      symbolKey={sessionSymbol}
      style={{
        position: 'absolute',
        zIndex: 100,
        top: `${displayIndex}px`,
        left: `${i * unitPixelWidth - 6}px`,
      }}></SessionIcon>
  ))
  return (
    <div style={{position: 'relative', height: '18px'}}>
      {days}
      {sessionGraph}
    </div>
  )
}

export default SessionPlot
