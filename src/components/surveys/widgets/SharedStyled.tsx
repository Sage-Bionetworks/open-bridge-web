import {Button, styled} from '@mui/material'
import {poppinsFont} from '@style/theme'

export const ActionButton = styled(Button)(({theme}) => ({
  '&:hover': {
    backgroundColor: 'transparent',
    fontWeight: 900,
  },
}))

export const StyledLabel14 = styled('label')(({theme}) => ({
  display: 'block',
  fontFamily: poppinsFont,
  fontWeight: 400,
  fontSize: '14px',
  marginBottom: theme.spacing(1),
}))
