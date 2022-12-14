import SessionIcon from '@components/widgets/SessionIcon'
import {Box, styled, Tooltip} from '@mui/material'
import {shouldForwardProp} from '@style/theme'
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

const StyledDayContainer = styled(Box, {label: 'StyledDayContainer', shouldForwardProp: shouldForwardProp})<{
  $unitPixelWidth: number
  $hasTopBorder: boolean
}>(({theme, $unitPixelWidth, $hasTopBorder}) => ({
  width: $unitPixelWidth + 'px',
  //borderBottom: '1px solid black',
  borderLeft: '1px solid #EAECEE',
  display: 'flex',
  justifyContent: 'space-around',
  borderTop: $hasTopBorder ? '1px solid #EAECEE' : 'none',
  // borderRight: index === 6 ? '1px solid black' : 'none',
  height: '38px',
  padding: 0,
  position: 'relative',
}))

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

  const table = [...new Array(7)].map((_i, index) => {
    const coords = xCoords.filter(c => Math.floor(c.c) === index)

    return (
      <StyledDayContainer $unitPixelWidth={unitPixelWidth} $hasTopBorder={weekSessionNumber > 0} key={_i}>
        {coords.map(({c: i, expiration}) => (
          <Tooltip
            title={expiration}
            placement="top"
            key={`session${i}_${unitPixelWidth * i}_${sessionIndex}_${lineNumber}`}>
            <div
              id={`session_${i}`}
              style={{
                position: 'absolute',
                zIndex: 100,

                top: `${topOffset}px`,
                left: `${(i - index) * unitPixelWidth - 6}px`,
              }}>
              {/*i*/}
              <SessionIcon symbolKey={sessionSymbol} index={sessionIndex}></SessionIcon>
            </div>
          </Tooltip>
        ))}
      </StyledDayContainer>
    )
  })

  return <div style={{position: 'relative', height: '100%', width: '100%', display: 'flex'}}>{table}</div>
}

export default React.memo(SessionPlot)
