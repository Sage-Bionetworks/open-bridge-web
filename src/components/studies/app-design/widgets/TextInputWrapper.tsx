import {FormControl} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React, {ChangeEventHandler} from 'react'
import {SimpleTextInput, SimpleTextLabel} from '../../../widgets/StyledComponents'

const useStyles = makeStyles(theme => ({
  errorText: {
    color: theme.palette.error.main,
  },
  errorInput: {
    borderColor: theme.palette.error.main,
  },
}))

type TextInputWrapperProps = {
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>
  onBlur?: Function
  id: string
  placeholder: string
  value: string
  multiline?: boolean
  rows?: number
  rowsMax?: number
  SimpleTextInputStyles: React.CSSProperties
  titleText: string

  readOnly?: boolean
  maxWordCount?: number

  hasError?: boolean
}

const TextInputWrapper: React.FunctionComponent<TextInputWrapperProps> = ({
  onChange,
  onBlur,
  id,
  placeholder,
  value,
  multiline,
  rows,
  rowsMax,
  SimpleTextInputStyles,
  titleText,

  readOnly,
  maxWordCount,

  hasError,
}) => {
  const classes = useStyles()

  return (
    <FormControl fullWidth>
      {titleText && (
        <SimpleTextLabel htmlFor={id} className={clsx(hasError && classes.errorText)}>
          {titleText}
        </SimpleTextLabel>
      )}
      <SimpleTextInput
        className={clsx(
          //   extraClassname && extraClassname,
          //    alternativeTextInputClassName && alternativeTextInputClassName,
          hasError && classes.errorInput
        )}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={e => (onBlur ? onBlur(e) : null)}
        multiline={multiline}
        rows={rows ? rows : 1}
        maxRows={rowsMax ? rowsMax : 1}
        inputProps={{
          style: SimpleTextInputStyles,
          maxLength: maxWordCount,
        }}
        $readOnly={readOnly}
      />
    </FormControl>
  )
}

export default TextInputWrapper
