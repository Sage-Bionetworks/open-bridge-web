import { TextField, TextFieldProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  text: {
    width: '50px',

    '& input': {
      padding: theme.spacing(1),
      width: theme.spacing(6),
    },
  },
}))

export interface SmallTextBoxProps {
  isLessThanOneAllowed?: boolean
}

const SmallTextBox: React.FunctionComponent<
  SmallTextBoxProps & TextFieldProps
> = ({ isLessThanOneAllowed, onChange, ...other }) => {
  const classes = useStyles()

  const change = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    if (!onChange) {
      return
    }
    const type = other.type

    if (e.target.value.length === 0) {
      onChange(e)
    }

    if (
      type === 'number' &&
      (isNaN(Number.parseInt(e.target.value)) ||
        (Number.parseInt(e.target.value) < 1 && !isLessThanOneAllowed))
    ) {
      return
    }

    onChange(e)
  }

  return (
    <TextField
      className={classes.text}
      {...other}
      onChange={e => change(e)}
      variant="outlined"
    />
  )
}

export default SmallTextBox
