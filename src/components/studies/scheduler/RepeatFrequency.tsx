import { FormControlLabel } from '@material-ui/core'
import React from 'react'
import { DWsEnum } from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

export interface RepeatFrequencyProps {
  interval: string | undefined //string($ISO 8601
  occurrences?: number
  onChange: Function
}

const RepeatFrequency: React.FunctionComponent<RepeatFrequencyProps> = ({
  interval,
  occurrences,
  onChange,
}: RepeatFrequencyProps) => {
  return (
    <SchedulingFormSection label={'Run this session every:'}>
      <FormControlLabel
        style={{ marginLeft: '0' }}
        control={
          <Duration
            onChange={e => {
     
              onChange(e.target.value)
            }}
            durationString={interval || ''}
            unitDefault={DWsEnum.D}
            unitLabel="Repeat Every"
            numberLabel="frequency number"
            unitData={DWsEnum }
          ></Duration>
        }
        label={occurrences? ` for ${occurrences} times`: 'until the end of study'} 
      />
    </SchedulingFormSection>
  )
}

export default RepeatFrequency
