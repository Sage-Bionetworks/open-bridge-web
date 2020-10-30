import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
  Box,
  FormControl,
  createStyles,
  Theme,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from '@material-ui/core'

import { EndDateType, SessionScheduleEndType } from '../../../types/scheduling'

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

export interface EndDateProps {
  endDate: EndDateType
  onChange: Function
}

const EndDate: React.FunctionComponent<EndDateProps> = ({
  endDate,
  onChange,
}: EndDateProps) => {
  const classes = useStyles()

  const changeEndDateType = (type: SessionScheduleEndType) => {
    onChange({ ...endDate, type })
  }

  const changeEndDateDays = (days: string) => {
    if (isNaN(Number.parseInt(days))) {
      throw new Error('Number!')
    }

    onChange({
      ...endDate,
      days: Number(days),
    })
  }

  return (
    <FormControl component="fieldset">
      <FormLabel component="label">Repeat session until:</FormLabel>
      <RadioGroup
        aria-label="End Date"
        name="endDate"
        value={endDate.type}
        onChange={e =>
          changeEndDateType(e.target.value as SessionScheduleEndType)
        }
      >
        <FormControlLabel
          value={'END_STUDY'}
          control={<Radio />}
          label="End of study "
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
                value={endDate.date}
              />
            </>
          }
          label=" "
        />

        <FormControlLabel
          control={
            <>
              <Radio value={'N_OCCURENCES'} />{' '}
              <TextField
                id="standard-basic"
                onChange={e => changeEndDateDays(e.target.value)}
                value={endDate.days || ''}
              />
            </>
          }
          label="Occurrences"
        />
      </RadioGroup>
    </FormControl>
  )
}

export default EndDate
