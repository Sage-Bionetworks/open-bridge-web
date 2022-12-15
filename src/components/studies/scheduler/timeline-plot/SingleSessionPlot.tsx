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
  isBurst: boolean
}

const StyledDayContainer = styled(Box, {label: 'StyledDayContainer', shouldForwardProp: shouldForwardProp})<{
  $unitPixelWidth: number
  $hasTopBorder: boolean
  $isBurst: boolean
}>(({theme, $unitPixelWidth, $hasTopBorder, $isBurst}) => ({
  width: $unitPixelWidth + 'px',
  borderLeft: `1px solid ${$isBurst ? '#ddd' : '#EAECEE'} `,
  display: 'flex',
  justifyContent: 'space-around',
  borderTop: $hasTopBorder || true ? `1px solid ${$isBurst ? '#ddd' : '#EAECEE'}` : 'none',
  height: '32px',
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
  isBurst,
}) => {
  const table = [...new Array(7)].map((_i, index) => {
    const coords = xCoords.filter(c => Math.floor(c.c) === index)

    return (
      <StyledDayContainer
        $unitPixelWidth={unitPixelWidth}
        $hasTopBorder={(!isBurst && weekSessionNumber > 0) || (isBurst && (lineNumber || 0) > 0)}
        key={_i}
        $isBurst={isBurst}>
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
