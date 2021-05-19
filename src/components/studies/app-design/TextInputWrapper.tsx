import React from 'react'
import { makeStyles } from '@material-ui/core'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'
import { playfairDisplayFont } from '../../../style/theme'

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
}) => {
  const classes = useStyles()
  return (
    <>
      <SimpleTextLabel htmlFor={id}>{titleText}</SimpleTextLabel>
      <SimpleTextInput
        className={classes.informationRowStyle}
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
      />
    </>
  )
}

export default TextInputWrapper
