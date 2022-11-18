import {
  Button,
  FormControlLabel,
  InputBase,
  InputLabel,
  Select,
  styled,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import Alert from '@mui/material/Alert'
import withStyles from '@mui/styles/withStyles'
import {latoFont, poppinsFont} from '../../style/theme'

export const ButtonWithSelectButton = withStyles(theme => ({
  root: {
    height: '40px',
    marginBottom: theme.spacing(1),
    color: 'black',
    backgroundColor: theme.palette.primary.dark,
    '&:disabled': {
      boxShadow: '1px 2px 2px rgb(0 0 0 / 25%)',
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      boxShadow: `1px 2px 2px rgba(0, 0, 0, 0.25)`,
      fontWeight: 'bolder',
    },
    fontFamily: 'Lato',
    boxShadow: `1px 2px 2px rgba(0, 0, 0, 0.25)`,
    borderRadius: '0 2px 2px 0',
  },
}))(Button)

export const ButtonWithSelectSelect = withStyles(theme => ({
  select: {
    marginTop: 0,

    padding: '12px 16px',
    fontSize: '14px',
    height: '40px',
    borderRadius: '2px 0 0 2px',

    boxShadow: `1px 2px 2px rgba(0, 0, 0, 0.25)`,
    outline: 'none',
    // boxSizing: 'border-box',
    backgroundColor: '#F2F2F2',
    fontFamily: 'Lato',
    cursor: 'pointer',
  },
}))(Select)

export const BlueButton = withStyles(theme => ({
  root: {
    borderRadius: '0px',

    height: '40px',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: 'black',
    border: 'none',

    backgroundColor: theme.palette.primary.dark,
    '&:hover': {
      fontWeight: 'bolder',
      backgroundColor: theme.palette.primary.dark,
    },
    fontFamily: 'Lato',
  },
}))(Button)

export const RedButton = withStyles(theme => ({
  root: {
    borderRadius: '0px',

    height: '40px',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: 'black',
    backgroundColor: theme.palette.error.light,
    '&:hover': {
      fontWeight: 'bolder',
      backgroundColor: theme.palette.primary.dark,
    },
    fontFamily: 'Lato',
  },
}))(Button)

export const WhiteButton = withStyles(theme => ({
  root: {
    borderRadius: '0px',
    padding: theme.spacing(1.5),
    color: 'black',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '&:hover': {
      fontWeight: 'bolder',
      backgroundColor: '#fff',
    },
    fontFamily: 'Lato',

    '& svg': {
      marginRight: theme.spacing(1.5),
    },
  },
}))(Button)

export const DialogButtonSecondary = withStyles(theme => ({
  root: {
    border: '1px solid black',
    background: '#FCFCFC',
    color: 'black',
    borderRadius: '0',
    fontFamily: latoFont,
    fontSize: '14px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '&:hover': {
      fontWeight: 'bolder',
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    },
  },
}))(Button)

export const DialogButtonPrimary = withStyles(theme => ({
  root: {
    border: '1px solid black',
    background: theme.palette.error.light,
    color: 'black',
    borderRadius: '0',
    fontFamily: latoFont,
    fontSize: '14px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',

    '&:not(:first-child)': {
      marginLeft: theme.spacing(1),
    },

    '&:hover': {
      fontWeight: 'bolder',
      background: theme.palette.error.light,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    },
  },
}))(Button)

export const SimpleTextLabel = styled(InputLabel, {label: 'SimpleTextLabel'})(({theme}) => ({
  fontFamily: [poppinsFont, 'Roboto'].join(','),
  fontWeight: 500,
  fontSize: '14px',
  transform: 'none',
  maxWidth: '100%',
  paddingLeft: theme.spacing(0),

  '&.error': {
    color: theme.palette.error.main,
  },
}))

export const SimpleTextInput = styled(InputBase, {label: 'SimpleTextInput'})(({theme}) => ({
  border: `1px solid ${theme.palette.text.secondary}`,
  backgroundColor: '#fff',
  'label + &': {
    marginTop: theme.spacing(2.5),
  },
  '&.Mui-focused': {
    borderColor: theme.palette.primary.light,
  },
  '.error > &': {
    borderColor: theme.palette.error.main,
  },
  '&.Mui-error': {
    borderColor: theme.palette.error.main,
  },

  '&:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },

  multiline: {
    padding: 0,
  },

  '& input, textarea': {
    borderRadius: '1px',
    // borderRadius: 0,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    fontSize: '14px',
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [latoFont, 'Roboto'].join(','),
    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active': {
      ' -webkit-box-shadow': '0 0 0 30px white inset !important',
    },
    '&.Mui-disabled': {
      backgroundColor: 'rgba(239, 239, 239, 0.3)',
    },
  },
  fullWidth: {
    '& input': {width: '100%'},
  },
}))

export const FormControlLabelHidden = withStyles(theme => ({
  root: {
    margin: 0,
    '& > span[class*=MuiFormControlLabel-]': {
      display: 'none',
    },
  },
}))(FormControlLabel)

export const AlertWithText = withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.error.main,
    backgroundColor: 'transparent',
    fontSize: '15px',
    fontFamily: latoFont,
  },
}))(Alert)
export const PrevButton = withStyles(theme => ({
  root: {
    '& svg': {
      marginRight: theme.spacing(2),
      '& path': {
        fill: '#2a2a2a',
      },
    },
  },
}))(Button)

export const NextButton = withStyles(theme => ({
  root: {
    '& svg': {
      marginLeft: theme.spacing(2),
      transform: 'scaleX(-1)',
      '& path': {
        fill: '#fcfcfc',
      },
    },
  },
}))(Button)

export const StyledToggleButtonGroup = styled(ToggleButtonGroup, {
  label: 'StyledToggleButtonGroup',
  shouldForwardProp: prop => prop !== 'width',
})<{width?: number}>(({theme, width}) => ({
  background: '#EDEDED',
  justifyContent: 'space-between',
  boxShadow: 'inset 0px 1px 4px rgba(0, 0, 0, 0.25)',
  width: `${width || 255}px`,
  borderRadius: '25px',
  padding: theme.spacing(0.25),
}))

export const StyledToggleButton = styled(ToggleButton)(({theme}) => ({
  padding: theme.spacing(0.25, 1),
  borderRadius: '25px',
  fontFamily: latoFont,
  fontSize: '14px',
  border: 'none',
  '&.MuiToggleButtonGroup-grouped:not(:last-of-type), &.MuiToggleButtonGroup-grouped:not(:first-of-type), &.MuiToggleButtonGroup-grouped:not(:first-of-type)':
    {
      borderRadius: '25px',
      '&.Mui-selected': {
        backgroundColor: '#fff',
        color: '##565656',
        borderRadius: '25px',
      },
      '&:hover': {
        borderRadius: '25px',
      },
    },
}))

export const getStyledToolbarLinkStyle = (theme: Theme) => ({
  padding: theme.spacing(2, 0, 1.5, 0),
  margin: theme.spacing(0, 3),

  display: 'flex',
  alignItems: 'center',
  fontFamily: latoFont,
  flexGrow: 1,

  fontSize: '16px',
  fontWeight: 900,

  textDecoration: 'none',
  color: 'inherit',
  flexShrink: 0,
  '& svg': {
    marginRight: theme.spacing(1),
    fontSize: '20px',
  },

  '&:last-child': {
    paddingRight: theme.spacing(0.5),
    paddingLeft: theme.spacing(0.5),
  },

  '& .selectedLink': {
    borderBottom: '4px solid #9499C7',
    paddingBottom: theme.spacing(2),
  },
})
