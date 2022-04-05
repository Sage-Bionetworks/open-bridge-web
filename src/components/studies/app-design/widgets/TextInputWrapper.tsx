import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx'
import React, {ChangeEventHandler} from 'react'
import {playfairDisplayFont} from '../../../../style/theme'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../../widgets/StyledComponents'

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
        onChange={onChange}
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
