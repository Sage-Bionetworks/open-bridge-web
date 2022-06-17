import {Button} from '@mui/material'
import Box from '@mui/material/Box'
import {styled, SxProps} from '@mui/material/styles'
import {latoFont} from '@style/theme'
import React, {FunctionComponent} from 'react'
import QuestionPhoneBottom from './QuestionPhoneBottom'

const PhoneDiv = styled('div')(({theme}) => ({
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

const StyledButton = styled(Button)(({theme}) => ({
  height: theme.spacing(5),
  // backgroundColor: '#2A2A2A',
  borderRadius: '100px',
  textAlign: 'center',

  fontFamily: latoFont,
  fontWeight: 600,
  fontSize: '16px',
  // color: '#fff',
}))

type PhoneDisplayProps = {
  sx?: SxProps
  isQuestion?: boolean
  onAction?: () => void
}

const PhoneDisplay: FunctionComponent<PhoneDisplayProps> = ({
  isQuestion,
  onAction,
  children,
  sx,
}) => {
  return (
    <PhoneDiv sx={sx}>
      <Box height="100%" pb={5}>
        {children}
      </Box>

      {isQuestion ? (
        <QuestionPhoneBottom />
      ) : (
        <StyledButton color="primary" variant="contained" onClick={onAction}>
          Start
        </StyledButton>
      )}
    </PhoneDiv>
  )
}
export default PhoneDisplay
