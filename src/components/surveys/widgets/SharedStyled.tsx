import {Button, FormControl, OutlinedInput, styled} from '@mui/material'
import {poppinsFont} from '@style/theme'

export const ActionButton = styled(Button)(({theme}) => ({
  '&:hover': {
    backgroundColor: 'transparent',
    fontWeight: 900,
  },
}))

export const StyledLabel14 = styled('label')<{mb?: number}>(
  ({theme, mb = 1}) => ({
    display: 'block',
    fontFamily: poppinsFont,
    fontWeight: 400,
    fontSize: '14px',
    marginBottom: theme.spacing(mb),
  })
)

export const StyledFormControl = styled(FormControl)<{mb?: number}>(
  ({theme, mb = 5}) => ({
    marginBottom: theme.spacing(mb),
    display: 'flex',
  })
)

export const DisappearingInput = styled(OutlinedInput)(({theme}) => ({
  padding: '0px',

  '&.MuiInputBase-multiline': {
    padding: '0px',
    '&:focus-visible': {
      outline: 0,
    },
  },

  '& fieldset.MuiOutlinedInput-notchedOutline': {
    border: '1px solid transparent',
  },
  '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
    border: '1px solid #8FD6FF',
  },

  '& input, textarea': {
    padding: '8px',
    backgroundColor: 'transparent',
  },
}))
