import Box from '@mui/material/Box'
import {styled, SxProps} from '@mui/material/styles'
import React, {FunctionComponent, ReactNode} from 'react'

const PhoneDiv = styled('div', {label: 'phoneDiv'})(({theme}) => ({
  position: 'relative',
  height: '504px',
  width: '264px',
  border: '3px solid #2A2A2A',
  background: '#f9f9f9',
  borderRadius: '25px',
  padding: theme.spacing(3),
  boxShadow: '-27px 23px 18px rgba(42, 42, 42, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: '40px',
  margin: '64px auto 0 auto',
}))

type PhoneDisplayProps = {
  sx?: SxProps

  phoneBottom?: ReactNode
}

const PhoneDisplay: FunctionComponent<PhoneDisplayProps> = ({children, phoneBottom, sx}) => {
  return (
    <PhoneDiv sx={sx}>
      <Box height="100%" pb={5}>
        {children}
      </Box>
      {phoneBottom}
    </PhoneDiv>
  )
}
export default PhoneDisplay
