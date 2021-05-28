import {
  Button,
  FormControlLabel,
  InputBase,
  InputLabel,
  Select,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { withStyles } from '@material-ui/core/styles'
import { latoFont, poppinsFont } from '../../style/theme'

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
  root: {
    marginTop: 0,
    padding: '12px 16px',
    fontSize: '14px',
    borderRadius: '2px 0 0 2px',
    height: '40px',
    boxShadow: `1px 2px 2px rgba(0, 0, 0, 0.25)`,
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#F2F2F2',
    fontFamily: 'Lato',
    cursor: 'pointer',
  },
  selectMenu: {},
}))(Select)

export const BlueButton = withStyles(theme => ({
  root: {
    borderRadius: '0px',

    height: '40px',
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: 'black',
    backgroundColor: theme.palette.primary.dark,
    '&:hover': {
      fontWeight: 'bolder',
      backgroundColor: theme.palette.primary.dark,
    },
    fontFamily: 'Lato',
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

export const SimpleTextLabel = withStyles(theme => ({
  root: {
    fontFamily: [poppinsFont, 'Roboto'].join(','),
    fontWeight: 500,
    fontSize: '14px',
    transform: 'none',
    paddingLeft: theme.spacing(1),

    '.error > &': {
      color: theme.palette.error.main,
    },
  },
}))(InputLabel)

export const SimpleTextInput = withStyles(theme => ({
  root: {
    border: `1px solid ${theme.palette.text.secondary}`,
    borderRadius: '1px',

    'label + &': {
      marginTop: theme.spacing(2),
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
  },
  multiline: {
    padding: 0,
  },
  input: {
    borderRadius: 0,
    position: 'relative',
    backgroundColor: theme.palette.common.white,
    fontSize: '14px',
    width: 'auto',
    padding: '10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    fontFamily: [latoFont, 'Roboto'].join(','),
    '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
      {
        ' -webkit-box-shadow': '0 0 0 30px white inset !important',
      },
  },
}))(InputBase)

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
