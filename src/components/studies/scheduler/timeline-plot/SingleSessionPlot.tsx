import SessionIcon from '@components/widgets/SessionIcon'
import {Tooltip} from '@mui/material'
import React from 'react'
import {CoordItem} from './utility'
export interface SingleSessionPlotProps {
  lineNumber?: number
  sessionIndex?: number
  sessionGuid: string
  unitPixelWidth: number
  topOffset?: number
  sessionSymbol?: string
  weekSessionNumber: number
  xCoords: CoordItem[]
}

const SessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  sessionIndex,
  topOffset = 14,
  unitPixelWidth,
  sessionSymbol,
  lineNumber,
  weekSessionNumber,
  xCoords,
}) => {
  const dayDividers = [...new Array(8)].map((i, index) => (
    <div
      key={`day_${index}`}
      id={`day_${index}`}
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

  const table = (
    <table style={{borderCollapse: 'collapse', width: '100%'}}>
      <tr>
        {[...new Array(7)].map((i, index) => (
          <td
            style={{
              width: unitPixelWidth + 'px',
              //borderBottom: '1px solid black',
              borderLeft: '1px solid #EAECEE',

              borderTop: weekSessionNumber > 0 ? '1px solid #EAECEE' : 'none',
              // borderRight: index === 6 ? '1px solid black' : 'none',
              height: '38px',
              padding: 0,
            }}></td>
        ))}
      </tr>
    </table>
  )
  const sessionGraph = xCoords.map(({c: i, expiration}) => (
    <Tooltip title={expiration} placement="top" key={`session${i}_${unitPixelWidth * i}_${sessionIndex}_${lineNumber}`}>
      <div
        id={`session_${i}`}
        style={{
          position: 'absolute',
          zIndex: 100,

          top: `${topOffset}px`,
          left: `${i * unitPixelWidth - 6}px`,
        }}>
        {/*i*/}
        <SessionIcon symbolKey={sessionSymbol} index={sessionIndex}></SessionIcon>
      </div>
    </Tooltip>
  ))
  return (
    <div style={{position: 'relative', height: '100%', width: '100%'}}>
      {table}
      {/*dayDividers*/}
      {sessionGraph}
    </div>
  )
}

export default React.memo(SessionPlot)
