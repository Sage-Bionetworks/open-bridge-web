import { Button, InputBase, InputLabel, Select } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { latoFont, poppinsFont } from '../../style/theme'

export const ButtonWithSelectButton = withStyles(theme => ({
  root: {
    height: '40px',
    marginBottom: theme.spacing(1),
    color: 'black',
    backgroundColor: theme.palette.primary.dark,
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

export const SimpleTextLabel = withStyles(theme => ({
  root: {
    fontFamily: [poppinsFont, 'Roboto'].join(','),
    fontWeight: 500,
    fontSize: '14px',
    transform: 'none',
  },
}))(InputLabel)

export const SimpleTextInput = withStyles(theme => ({
  root: {
    border: '1px solid #ced4da',
    'label + &': {
      marginTop: theme.spacing(2),
    },
    '&.Mui-focused': {
      borderColor: theme.palette.primary.light,
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
  },
}))(InputBase)
