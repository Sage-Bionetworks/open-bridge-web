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
  StartDate as StartDateType,
  HDWMEnum,
} from '../../../types/scheduling'
import SchedulingFormSection from './SchedulingFormSection'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import SmallTextBox from './SmallTextBox'
import Duration from './Duration'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface StartDateProps {
  startDate: StartDateType
  onChange: Function
}

const StartDate: React.FunctionComponent<StartDateProps> = ({
  startDate,
  onChange,
}: StartDateProps) => {
  const classes = useStyles()


  const changeStartDate = (type: SessionScheduleStartType) => {
    if (type === 'DAY1') {

      onChange({ type: 'DAY1', offset: undefined })
    } else {
      onChange({ ...startDate, type })
    }
  }

  

  return (
    <SchedulingFormSection label={'Session Starts On:'}>
      <RadioGroup
        aria-label="Start Date"
        name="startDate"
        value={startDate.type}
        onChange={e =>
          changeStartDate(e.target.value as SessionScheduleStartType)
        }
      >
        <FormControlLabel value={'DAY1'} control={<Radio />} label="Day 1" />
        <FormControlLabel
          control={
            <>
              <Radio value={'NDAYS_DAY1'} />{' '}
              <Duration
                onFocus={() => changeStartDate('NDAYS_DAY1')}
                onChange={e => {
                  onChange({
                    ...startDate,
                    offset: e,
                  })
                }}
                durationString={startDate.offset}
                unitLabel="Repeat Every"
                numberLabel="frequency number"
                unitData={HDWMEnum}
              ></Duration>
            </>
          }
          label="from Day 1"
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default StartDate
