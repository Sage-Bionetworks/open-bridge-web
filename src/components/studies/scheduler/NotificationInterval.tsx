import {Checkbox, FormControlLabel} from '@mui/material'
import React from 'react'
import {MHDsEnum} from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

export interface NotificationIntervalProps {
  repeatInterval?: string
  onChange: (interval: string | undefined) => void
}

const NotificationInterval: React.FunctionComponent<NotificationIntervalProps> = ({
  repeatInterval,
  onChange,
}: NotificationIntervalProps) => {
  const [hasInterval, setHasInterval] = React.useState(repeatInterval !== undefined)

  return (
    <SchedulingFormSection label={''} style={{paddingTop: 0, paddingBottom: 0, marginBottom: 0}} border={false}>
      {' '}
      <div style={{flexBasis: '100%', display: 'block'}}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasInterval}
              onChange={e => {
                if (!e.target.checked) {
                  onChange(undefined)
                }
                setHasInterval(e.target.checked)
              }}
              name="hasInterval"
              color="primary"
            />
          }
          label="Repeat:"
        />
        {hasInterval && (
          <div style={{display: 'flex', alignItems: 'center'}}>
            every&nbsp;&nbsp;
            <Duration
              onChange={e => {
                onChange(e.target.value)
              }}
              unitDefault={MHDsEnum.M}
              durationString={repeatInterval || ''}
              unitLabel="Repeat Every"
              numberLabel="frequency number"
              unitData={MHDsEnum}></Duration>
            until Session expires
          </div>
        )}
      </div>
    </SchedulingFormSection>
  )
}

export default NotificationInterval
