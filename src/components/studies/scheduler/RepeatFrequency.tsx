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
    <SchedulingFormSection label={"Repeat session every:"}>
      <FormControlLabel
        control={
          <>
            <SmallTextBox
              value={repeatFrequency.frequency}
              type="number"
              id="frequency"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...repeatFrequency,
                  frequency: Number(e.target.value as string),
                })
              }
            ></SmallTextBox>

            <SelectWithEnum
              aria-label="Repeat Every"
              value={repeatFrequency.unit}
              sourceData={DWMYEnum}
              id="frequencyunit"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...repeatFrequency,
                  unit: e.target.value as keyof typeof DWMYEnum,
                })
              }
            ></SelectWithEnum>
          </>
        }
        label=""
      />
    </SchedulingFormSection>
  )
}

export default RepeatFrequency
