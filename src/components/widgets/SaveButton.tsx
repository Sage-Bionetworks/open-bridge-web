import { Button, ButtonProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ReactComponent as SaveIcon } from '../../assets/save_icon.svg'
import { latoFont, ThemeType } from '../../style/theme'

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

}))

export interface ButtonStyleProps {
  inputWidth?: number
}

const SaveButton: React.FunctionComponent<ButtonProps & ButtonStyleProps> = ({
  inputWidth = 6,
  onClick,
  ...other
}) => {
  const classes = useStyles({ width: inputWidth })

  return (
    <Button
    className={classes.root}
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<SaveIcon />}
    >
      Save changes
    </Button>
  )
}

export default SaveButton
