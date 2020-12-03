import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import {
  createStyles,
  Theme,
  FormGroup,
  Checkbox,
  FormControlLabel,
} from '@material-ui/core'

import { getEnumKeys } from '../../../helpers/utility'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import { DWMYEnum, Reoccurance } from '../../../types/scheduling'
import SchedulingFormSection from './SchedulingFormSection'
import SmallTextBox from './SmallTextBox'
import moment, { DurationInputObject } from 'moment'
import Duration from './Duration'

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
    <SchedulingFormSection label={'Repeat session every:'}>
      <FormControlLabel
        control={
          <Duration
            onChange={e => {console.log(e); onChange(e)}}
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
