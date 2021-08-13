import React from 'react'
import {makeStyles} from '@material-ui/core'
import {SimpleTextInput, SimpleTextLabel} from '../../widgets/StyledComponents'
import {playfairDisplayFont} from '../../../style/theme'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
  errorText: {
    color: theme.palette.error.main,
  },
  errorInput: {
    borderColor: theme.palette.error.main,
  },
}))

type TextInputWrapperProps = {
  onChange: Function
  onBlur?: Function
  id: string
  placeholder: string
  value: string
  multiline?: boolean
  rows?: number
  rowsMax?: number
  SimpleTextInputStyles: React.CSSProperties
  titleText: string
  extraClassname?: string
  readOnly?: boolean
  maxWordCount?: number
  alternativeTextInputClassName?: string
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
  extraClassname,
  readOnly,
  maxWordCount,
  alternativeTextInputClassName,
  hasError,
}) => {
  const classes = useStyles()
  return (
    <>
      {titleText && (
        <SimpleTextLabel
          htmlFor={id}
          className={clsx(hasError && classes.errorText)}>
          {titleText}
        </SimpleTextLabel>
      )}
      <SimpleTextInput
        className={clsx(
          !alternativeTextInputClassName && classes.informationRowStyle,
          extraClassname && extraClassname,
          alternativeTextInputClassName && alternativeTextInputClassName,
          hasError && classes.errorInput
        )}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e)}
        onBlur={e => (onBlur ? onBlur(e) : null)}
        multiline={multiline}
        rows={rows ? rows : 1}
        rowsMax={rowsMax ? rowsMax : 1}
        inputProps={{
          style: SimpleTextInputStyles,
          maxLength: maxWordCount,
        }}
        readOnly={readOnly}
      />
    </>
  )
}

export default TextInputWrapper
