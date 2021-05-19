import React from 'react'
import { makeStyles } from '@material-ui/core'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import { playfairDisplayFont } from '../../../style/theme'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  informationRowStyle: {
    fontFamily: playfairDisplayFont,
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '18px',
  },
}))

type TextInputWrapperProps = {
  onChange: Function
  onBlur: Function
  id: string
  placeholder: string
  value: string
  multiline: boolean
  rows: number
  rowsMax: number
  SimpleTextInputStyles: React.CSSProperties
  titleText: string
  extraClassname?: string
  readOnly?: boolean
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
}) => {
  const classes = useStyles()
  return (
    <>
      {titleText && <SimpleTextLabel htmlFor={id}>{titleText}</SimpleTextLabel>}
      <SimpleTextInput
        className={clsx(
          classes.informationRowStyle,
          extraClassname && extraClassname,
        )}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e)}
        onBlur={e => onBlur(e)}
        multiline={multiline}
        rows={rows}
        rowsMax={rowsMax}
        inputProps={{
          style: SimpleTextInputStyles,
        }}
        readOnly={readOnly}
      />
    </>
  )
}

export default TextInputWrapper
