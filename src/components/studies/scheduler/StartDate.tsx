import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
  FormControl,
  createStyles,
  Theme,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'

import {
  SessionScheduleStartType,
  StartDateType,
} from '../../../types/scheduling'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
)

export interface StartDateProps {
  startDate: StartDateType
  onChange: Function
}

const StartDate: React.FunctionComponent<StartDateProps> = ({
  startDate,
  onChange,
}: StartDateProps) => {
  const classes = useStyles()

  const changeStartDateType = (type: SessionScheduleStartType) => {
    onChange({ ...startDate, type })
  }

  const changeStartDateDays = (days: string) => {
    if (isNaN(Number.parseInt(days))) {
      throw new Error('Number!')
    }

    onChange({
      ...startDate,
      days: Number(days),
    })
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="label">Start Date:</FormLabel>
      <RadioGroup
        aria-label="Start Date"
        name="startDate"
        value={startDate.type}
        onChange={e =>
          changeStartDateType(e.target.value as SessionScheduleStartType)
        }
      >
        <FormControlLabel
          value={'OPEN_APP'}
          control={<Radio />}
          label="When participant opens app"
        />

        <FormControlLabel
          value={'BASELINE_DATE'}
          control={<Radio />}
          label="Study Start Date defined in participant manager"
        />
        <FormControlLabel
          control={
            <>
              <Radio value={'NDAYS_BASELINE'} />{' '}
              <TextField
                id="standard-basic"
                onChange={e => changeStartDateDays(e.target.value)}
                value={startDate.days || ''}
              />
            </>
          }
          label="days since Study Start Date"
        />
        <FormControlLabel
          control={
            <>
              <Radio
                value={'DATE'}
                inputProps={{ 'aria-label': 'Particular Date' }}
              />
              <TextField
                type="date"
                label="Date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={startDate.date}
              />
            </>
          }
          label=" "
        />
      </RadioGroup>
    </FormControl>
  )
}

export default StartDate
