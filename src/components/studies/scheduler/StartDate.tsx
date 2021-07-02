import {FormControlLabel, Radio, RadioGroup} from '@material-ui/core'
import React from 'react'
import {HDWMEnum} from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

export type SessionScheduleStartType = 'DAY1' | 'NDAYS_DAY1'
export interface StartDateProps {
  delay?: string //ISO6801
  sessionName: string
  onChange: Function
}

const StartDate: React.FunctionComponent<StartDateProps> = ({
  delay,
  onChange,
  sessionName,
}: StartDateProps) => {
  const [startType, setStartType] = React.useState<SessionScheduleStartType>(
    delay ? 'NDAYS_DAY1' : 'DAY1'
  )

  const changeStartDate = (type: SessionScheduleStartType) => {
    setStartType(type)

    if (type === 'DAY1') {
      onChange(undefined)
    }
  }

  return (
    <SchedulingFormSection label={`${sessionName} starts on:`}>
      <RadioGroup
        aria-label="Session Starts On"
        name="startDate"
        value={startType}
        onChange={e =>
          changeStartDate(e.target.value as SessionScheduleStartType)
        }>
        <FormControlLabel value={'DAY1'} control={<Radio />} label="Day 1" />
        <FormControlLabel
          control={
            <>
              <Radio value={'NDAYS_DAY1'} />{' '}
              <Duration
                onFocus={() => changeStartDate('NDAYS_DAY1')}
                onChange={e => {
                  onChange(e.target.value)
                }}
                durationString={delay}
                unitLabel="Repeat Every"
                numberLabel="frequency number"
                unitDefault={HDWMEnum.D}
                unitData={HDWMEnum}></Duration>
            </>
          }
          label="from Day 1"
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default StartDate
