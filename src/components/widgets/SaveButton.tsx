import {Button, ButtonProps, Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {ReactComponent as SaveIcon} from '../../assets/save_icon.svg'
import {latoFont, ThemeType} from '../../style/theme'
import {ReactComponent as FloatingSaveIcon} from '../../assets/scheduler/floating_save_icon.svg'
import clsx from 'clsx'

interface StyleProps {
  width: number
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  root: {
    background: theme.palette.error.light,
    color: 'black',
    borderRadius: '0',
    fontFamily: latoFont,
    fontSize: '14px',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    padding: theme.spacing(2),

    '&:hover': {
      fontWeight: 'bolder',
      background: theme.palette.error.light,
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.25)',
    },
  },
  floatingSave: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: latoFont,
    fontSize: '14px',
    padding: theme.spacing(0, 0.75),
  },
  floating: {
    position: 'fixed',
    zIndex: 2000,
    right: '0',
  },
}))

export interface ButtonStyleProps {
  inputWidth?: number
  id?: string
  isFloatingSave?: boolean
}

const SaveButton: React.FunctionComponent<ButtonProps & ButtonStyleProps> = ({
  inputWidth = 6,
  onClick,
  id,
  isFloatingSave,
  ...other
}) => {
  const classes = useStyles({width: inputWidth})
  const verticalIconAndText = (
    <Box className={classes.floatingSave}>
      <FloatingSaveIcon style={{marginBottom: '4px'}} /> Save
    </Box>
  )
  return (
    <Button
      className={clsx(classes.root, isFloatingSave && classes.floating)}
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={!isFloatingSave && <SaveIcon />}
      id={id}>
      {isFloatingSave ? verticalIconAndText : 'Save Changes'}
    </Button>
  )
}

export default SaveButton
