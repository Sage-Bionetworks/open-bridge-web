import {FormControlLabel} from '@material-ui/core'
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
  const label = occurrences
    ? ` for ${occurrences} times`
    : 'until the end of study'
  const disabled = occurrences == 1
  return (
    <SchedulingFormSection
      label={'Run this session every:'}
      style={{
        opacity: disabled ? 0.3 : 1,
        pointerEvents: disabled ? 'none' : 'all',
      }}>
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
            unitData={DWsEnum}></Duration>
        }
        label={label}
      />
    </SchedulingFormSection>
  )
}

export default RepeatFrequency
