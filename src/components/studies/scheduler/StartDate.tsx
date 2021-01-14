import {
  createStyles,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import {
  HDWMEnum,
  SessionScheduleStartType,
  StartDate as StartDateType
} from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

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
  console.log('startDate' + startDate.offset)
  const [x, setX] = React.useState(startDate.offset)

  React.useEffect(() => {
    setX(startDate.offset)
  }, [startDate.offset])

  const changeStartDate = (type: SessionScheduleStartType) => {
    if (type === 'DAY1') {
      onChange({ type: 'DAY1', offset: undefined })
    } else {
      if (startDate.type !== 'NDAYS_DAY1') {
        onChange({ ...startDate, type })
      }
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
                  setX(e.toString())
                  onChange({
                    ...startDate,
                    offset: e,
                  })
                }}
                durationString={x}
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
