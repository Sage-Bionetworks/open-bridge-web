import {FormControlLabel} from '@material-ui/core'
import React from 'react'
import {DWsEnum} from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'
import {useStyles} from './StartDate'
import {getTimeExpiredAfter} from './utility'
import {HDWMEnum} from '../../../types/scheduling'

export interface RepeatFrequencyProps {
  interval: string | undefined //string($ISO 8601
  occurrences?: number
  onChange: Function
  isReadOnly?: boolean
}

const RepeatFrequency: React.FunctionComponent<RepeatFrequencyProps> = ({
  interval,
  occurrences,
  onChange,
  isReadOnly,
}: RepeatFrequencyProps) => {
  const classes = useStyles()
  const label = occurrences
    ? ` for ${occurrences} times`
    : 'until the end of study'
  let intervalString = ''
  if (interval) {
    const time = getTimeExpiredAfter(interval)
    const unit = interval[interval.length - 1] as keyof typeof HDWMEnum
    const timeUnit = HDWMEnum[unit]
    intervalString = `${time} ${timeUnit}`
  }

  return (
    <SchedulingFormSection label={'Run this session every:'}>
      {!isReadOnly ? (
        <FormControlLabel
          style={{marginLeft: '0'}}
          control={
            <Duration
              onChange={e => {
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
      ) : (
        <strong
          className={
            classes.timeFrameText
          }>{`${intervalString}${label}`}</strong>
      )}
    </SchedulingFormSection>
  )
}

export default RepeatFrequency
