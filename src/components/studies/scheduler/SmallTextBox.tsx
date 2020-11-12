import React, { ChangeEvent, ReactNode } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { useErrorHandler } from 'react-error-boundary'
import { Box, FormControl, FormLabel, TextField, TextFieldProps } from '@material-ui/core'
import { poppinsFont } from '../../../style/theme'

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

}

const SmallTextBox: React.FunctionComponent<SmallTextBoxProps & TextFieldProps> = (
  props: SmallTextBoxProps,
) => {
  const classes = useStyles()
  const { ...other } = props

  return (
    <TextField
      className={classes.text}
      {...other}
      variant="outlined"
    />
  )
}

export default SmallTextBox
