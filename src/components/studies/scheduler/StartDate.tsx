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
      onChange({ type: 'DAY1' })
    } else {
      onChange({ ...startDate, type })
    }
  }

  const changeStartDateOffsetNumber = (days: string) => {

    if (isNaN(Number.parseInt(days))|| parseInt(days) < 1) {
      return
    }

    onChange({
      ...startDate,
      offsetNumber: Number(days),
    })
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
              <SmallTextBox
                type="number"
                onChange={(e: any) =>
                  changeStartDateOffsetNumber(e.target.value)
                }
                value={startDate.offsetNumber || ''}
                onFocus={() => changeStartDate('NDAYS_DAY1')}
              />
              
              <SelectWithEnum
                value={startDate.offsetUnit}
                sourceData={HDWMEnum}
                id="offsetUnit"
                onFocus={() => changeStartDate('NDAYS_DAY1')}
                onChange={e =>
                  onChange({
                    ...startDate,
                    offsetUnit: e.target.value,
                  })
                }
              ></SelectWithEnum>
            </>
          }
          label="from Day 1"
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default StartDate
