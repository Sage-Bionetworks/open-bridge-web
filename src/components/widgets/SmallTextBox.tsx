import { TextField, TextFieldProps } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ThemeType } from '../../style/theme'

interface StyleProps {
  width: number
}

const useStyles = makeStyles<ThemeType, StyleProps>(theme => ({
  root: {
    marginBottom: theme.spacing(2),
  },
  text: props => ({
    width: theme.spacing(props.width),

    '& input': {
      padding: theme.spacing(1),
      width: theme.spacing(props.width),

    },
  }),
}))

export interface SmallTextBoxProps {
  isLessThanOneAllowed?: boolean,
  inputWidth?: number
}

const SmallTextBox: React.FunctionComponent<
  SmallTextBoxProps & TextFieldProps
> = ({ isLessThanOneAllowed, inputWidth=6, onChange, ...other }) => {


  const classes = useStyles({width: inputWidth})

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
