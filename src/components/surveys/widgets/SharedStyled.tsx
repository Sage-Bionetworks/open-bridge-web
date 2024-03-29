import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import {Button, Checkbox, CheckboxProps, FormControl, OutlinedInput, styled} from '@mui/material'
import {latoFont} from '@style/theme'

export const ActionButton = styled(Button)(({theme}) => ({
  '&:hover': {
    backgroundColor: 'transparent',
    fontWeight: 900,
  },
}))

export const StyledLabel14 = styled('label')<{mb?: number}>(({theme, mb = 1}) => ({
  display: 'block',

  fontWeight: 700,
  fontSize: '14px',
  marginBottom: theme.spacing(mb),
}))

export const StyledLabel12 = styled('label')<{mb?: number}>(({theme, mb = 1}) => ({
  display: 'block',
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  marginBottom: theme.spacing(mb),
}))

export const StyledFormControl = styled(FormControl)<{mb?: number}>(({theme, mb = 5}) => ({
  marginBottom: theme.spacing(mb),
  display: 'flex',
}))

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

export const StyledCheckbox = styled((props: CheckboxProps) => (
  <Checkbox size="medium" checkedIcon={<CheckBoxOutlinedIcon />} {...props} />
))(({theme}) => ({
  '& svg': {
    fontSize: '24px',
  },
  '&.Mui-checked': {
    position: 'relative',
    '& svg': {
      color: 'black',
    },
  },
}))

export const FakeInput = styled('div', {label: 'FakeInput'})<{
  width?: number
  height?: number
}>(({theme, width = 92, height = 40}) => ({
  width: `${width}px`,
  height: `${height}px`,
  lineHeight: `${height}px`,
  margin: '0 auto 24px auto',
  background: '#F1F3F5',
  //border: '1px solid #2A2A2A',
}))
/*
export const QuestionEditToolbarContainer = styled('div', {label: 'QuestionEditToolbarContainer'})(({theme}) => ({
  bottom: '0',
  position: 'fixed',
  height: '54px',
  display: 'flex',
  backgroundColor: 'blue',
  flexDirection: 'row',
  alignItems: 'center',
  width: '425px',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2.5),
  margin: theme.spacing(3, 0),
}))


const QuestionEditToolbarContainer = styled('div')(({theme}) => ({
  bottom: '0',
  // position: 'fixed',
  height: '54px',
  display: 'flex',
  backgroundColor: 'blue',
  flexDirection: 'row',
  alignItems: 'center',
  width: '425px',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 2.5),
  margin: theme.spacing(3, 0),
}))*/
