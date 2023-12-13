import {styled, TextField, TextFieldProps} from '@mui/material'
import React from 'react'

const StyledTextField = styled(TextField, {label: 'StyledTextField'})<{
  width: number
}>(({theme, width}) => ({
  marginBottom: theme.spacing(2),
  width: theme.spacing(width),

  '& input': {
    padding: theme.spacing(1),
    width: theme.spacing(width),
  },
}))

export interface SmallTextBoxProps {
  isLessThanOneAllowed?: boolean
  inputWidth?: number
}

const SmallTextBox: React.FunctionComponent<SmallTextBoxProps & TextFieldProps> = ({
  isLessThanOneAllowed,
  inputWidth = 6,
  onChange,
  ...other
}) => {
  const change = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (!onChange) {
      return
    }
    const type = other.type

    if (e.target.value.length === 0) {
      onChange(e)
    }

    if (
      type === 'number' &&
      (isNaN(Number.parseInt(e.target.value)) || (Number.parseInt(e.target.value) < 1 && !isLessThanOneAllowed))
    ) {
      return
    }

    onChange(e)
  }

  return <StyledTextField width={inputWidth} {...other} onChange={e => change(e)} variant="outlined" />
}

export default SmallTextBox
