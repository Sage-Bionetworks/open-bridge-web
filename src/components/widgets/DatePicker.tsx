// pick a date util library
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'
//import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {FormControl} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, {FunctionComponent} from 'react'
import {SimpleTextInput, SimpleTextLabel} from './StyledComponents'

const useStyles = makeStyles(theme => ({
  datePicker: {
    '& input': {
      backgroundColor: 'transparent',
      padding: theme.spacing(1.5, 2, 1.5, 1),
    },
  },
}))

type DatePickerProps = {
  onChange: (p: Date | null) => void
  label?: React.ReactNode
  onFocus?: Function
  onBlur?: Function
  value: Date | null
  id: string
  disabled?: boolean
  isYearOnly?: boolean
}

const DatePicker: FunctionComponent<DatePickerProps> = ({onChange, value, label, id, disabled, isYearOnly}) => {
  const classes = useStyles()

  const handleDateChange = (date: Date | null) => {
    onChange(date)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FormControl>
        <SimpleTextLabel htmlFor={id}>{label}</SimpleTextLabel>
        <DesktopDatePicker
          clearable={true}
          value={value}
          onChange={e => handleDateChange(e || null)}
          renderInput={params => (
            <SimpleTextInput
              {...params}
              sx={{width: 'fit-content'}}
              id={id}
              disabled={disabled}
              className={classes.datePicker}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  )
}

export default DatePicker
