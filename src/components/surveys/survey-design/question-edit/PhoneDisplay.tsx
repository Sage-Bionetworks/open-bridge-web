import PhoneBg from '@assets/surveys/phone_bg.svg'
import Box from '@mui/material/Box'
import {styled, SxProps} from '@mui/material/styles'
import {theme} from '@style/theme'
import {FunctionComponent, ReactNode} from 'react'

const PhoneDiv = styled('div', {label: 'phoneDiv'})(({theme}) => ({
  position: 'relative',
  height: '528px',
  width: '285px',

  backgroundImage: 'url(' + PhoneBg + ')',
  backgroundRepeat: 'no-repeat',
  borderRadius: '25px',
  padding: theme.spacing(3),

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',

  margin: '64px auto 60px auto',
}))

type PhoneDisplayProps = {
  sx?: SxProps

  phoneBottom?: ReactNode
}

const PhoneDisplay: FunctionComponent<PhoneDisplayProps> = ({children, phoneBottom, sx}) => {
  return (
    <PhoneDiv sx={sx}>
      <Box sx={{height: '100%', paddingBottom: theme.spacing(5)}}>{children}</Box>
      {phoneBottom}
    </PhoneDiv>
  )
}
export default PhoneDisplay
