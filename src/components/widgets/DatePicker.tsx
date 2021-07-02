// pick a date util library
import MomentUtils from '@date-io/moment'
import {FormControl} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {KeyboardDatePicker, MuiPickersUtilsProvider} from '@material-ui/pickers'
import React, {FunctionComponent} from 'react'
import {latoFont} from '../../style/theme'
import {SimpleTextLabel} from './StyledComponents'

const useStyles = makeStyles(theme => ({
  dateAdornment: {
    position: 'absolute',
    right: '0px',
    top: '20px',
    zIndex: 10,
    ' & button': {
      padding: theme.spacing(1),
      '&:hover': {
        backgroundColor: 'transparent',
        color: theme.palette.primary.light,
      },
    },
  },
  datePicker: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      paddingRight: 0,
      boxShadow: 'none',
      display: 'block',
      position: 'relative',
      border: '1px solid #ced4da',

      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderStyle: 'none',
      },

      '& .MuiOutlinedInput-notchedOutline': {
        borderStyle: 'none',
      },

      '&.Mui-focused': {
        borderColor: theme.palette.primary.light,
      },
    },
    '& input': {
      borderRadius: 0,
      position: 'relative',
      backgroundColor: theme.palette.common.white,
      borderStyle: 'none',
      fontSize: '14px',
      width: 'auto',
      padding: '10px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      fontFamily: [latoFont, 'Roboto'].join(','),

      '&:-webkit-autofill, &:-webkit-autofill:hover, &:-webkit-autofill:focus, &:-webkit-autofill:active':
        {
          ' -webkit-box-shadow': '0 0 0 30px white inset !important',
        },
    },
  },
}))

type DatePickerProps = {
  onChange: (p: Date | null) => void
  label?: string
  onFocus?: Function
  onBlur?: Function
  value: Date | null
  id: string
  disabled?: boolean
}

// -----------------  Add participant control
const DatePicker: FunctionComponent<DatePickerProps> = ({
  onChange,
  value,
  label,
  id,
  disabled,
}) => {
  const classes = useStyles()
  const [isDateControlFocused, setIsDateControlFocused] = React.useState(false)

  const handleDateChange = (date: Date | null) => {
    onChange(date)
  }

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <FormControl>
        <SimpleTextLabel
          htmlFor={id}
          className={isDateControlFocused ? 'Mui-focused' : ''}>
          {label}
        </SimpleTextLabel>
        <KeyboardDatePicker
          className={classes.datePicker}
          onFocus={_ => setIsDateControlFocused(true)}
          onBlur={_ => setIsDateControlFocused(false)}
          InputAdornmentProps={{
            position: 'end',
            className: classes.dateAdornment,
          }}
          clearable={true}
          format="MM/DD/yyyy"
          autoOk={true}
          disableToolbar={true}
          inputVariant="outlined"
          margin="normal"
          id={id}
          value={value}
          onChange={e => handleDateChange(e?.toDate() || null)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          disabled={disabled}
        />
      </FormControl>
    </MuiPickersUtilsProvider>
  )
}

export default DatePicker
