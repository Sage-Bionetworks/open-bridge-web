import { FormControlLabel } from '@material-ui/core'
import React from 'react'
import { DWMYEnum } from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

export interface RepeatFrequencyProps {
  interval: string | undefined //string($ISO 8601
  onChange: Function
}

const RepeatFrequency: React.FunctionComponent<RepeatFrequencyProps> = ({
  interval,
  onChange,
}: RepeatFrequencyProps) => {
  return (
    <SchedulingFormSection label={'Run this session every:'}>
      <FormControlLabel
        style={{ marginLeft: '0' }}
        control={
          <Duration
            onChange={e => {
              console.log(e)
              onChange(e)
            }}
            durationString={interval || ''}
            unitLabel="Repeat Every"
            numberLabel="frequency number"
            unitData={DWMYEnum}
          ></Duration>
        }
        label=""
      />
    </SchedulingFormSection>
  )
}

export default RepeatFrequency
