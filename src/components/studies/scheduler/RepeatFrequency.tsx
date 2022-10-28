import {FormControlLabel} from '@mui/material'
import React from 'react'
import {DWsEnum} from '../../../types/scheduling'
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
  const label = occurrences ? ` for ${occurrences} times` : 'until the end of study'
  const disabled = occurrences === 1
  return (
    <SchedulingFormSection label={'Run this session every:'} disabled={disabled}>
      <FormControlLabel
        style={{
          marginLeft: '0',
        }}
        control={
          <Duration
            disabled={disabled}
            onChange={e => {
              if (disabled) return
              onChange(e.target.value)
            }}
            durationString={interval || ''}
            unitDefault={DWsEnum.D}
            unitLabel="Repeat Every"
            numberLabel="frequency number"
            placeHolder="days"
            unitData={DWsEnum}></Duration>
        }
        label={disabled ? '' : label}
      />
    </SchedulingFormSection>
  )
}

export default RepeatFrequency
