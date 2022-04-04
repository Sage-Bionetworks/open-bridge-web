// pick a date util library
import AdapterMoment from '@mui/lab/AdapterMoment'
import DesktopDatePicker from '@mui/lab/DesktopDatePicker'
//import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import {FormControl, TextField} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React, {FunctionComponent} from 'react'
import {SimpleTextLabel} from './StyledComponents'

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

// -----------------  Add participant control
const DatePicker2: FunctionComponent<DatePickerProps> = ({
  onChange,
  value,
  label,
  id,
  disabled,
  isYearOnly,
}) => {
  const classes = useStyles()
  const [isDateControlFocused, setIsDateControlFocused] = React.useState(false)

  const getView = (): ('year' | 'date')[] => {
    return isYearOnly ? ['year'] : ['date']
  }

  const handleDateChange = (date: Date | null) => {
    onChange(date)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <FormControl>
        <SimpleTextLabel
          htmlFor={id}
          className={isDateControlFocused ? 'Mui-focused' : ''}>
          {label}
        </SimpleTextLabel>
        <DesktopDatePicker
          clearable={true}
          value={value}
          onChange={e => handleDateChange(e || null)}
          renderInput={params => (
            <TextField
              {...params}
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

export default DatePicker2
