import { createStyles, FormControlLabel, Theme } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { DWMYEnum, Reoccurance } from '../../../types/scheduling'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles((theme: Theme) => createStyles({}))

export interface RepeatFrequencyProps {
  repeatFrequency: Reoccurance
  onChange: Function
}

const RepeatFrequency: React.FunctionComponent<RepeatFrequencyProps> = ({
  repeatFrequency,
  onChange,
}: RepeatFrequencyProps) => {
  const classes = useStyles()

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
            durationString={repeatFrequency || '    '}
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
