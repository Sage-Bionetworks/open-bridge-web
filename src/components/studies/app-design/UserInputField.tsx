import React from 'react'
import { FormControl, FormControlLabel } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { JsxAttribute } from 'typescript'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'

const useStyles = makeStyles(theme => {})

type UserInputFieldProps = {
  headerText: string
  id: string
  value: any
  onChange: Function
  onBlur: Function
  multiline: boolean
  rows: number
  rowsMax: number
  placeholder: string
  inputProps: JsxAttribute
  formControlStyle?: string
  simpleTextLabelClassname?: string
}

const UserInputField: React.FunctionComponent<UserInputFieldProps> = ({
  headerText,
  id,
  value,
  onChange,
  onBlur,
  multiline,
  rows,
  rowsMax,
  placeholder,
  inputProps,
  formControlStyle,
  simpleTextLabelClassname,
}) => {
  return (
    <FormControl className={formControlStyle || ''}>
      <SimpleTextLabel>{headerText}</SimpleTextLabel>
      <SimpleTextInput
        id={id}
        value={value}
        onChange={e => onChange(e)}
        onBlur={e => onBlur(e)}
        multiline={multiline}
        rows={rows}
        rowsMax={rowsMax}
        placeholder={placeholder}
        inputProps={inputProps}
        className={simpleTextLabelClassname || ''}
      />
    </FormControl>
  )
}

export default UserInputField
