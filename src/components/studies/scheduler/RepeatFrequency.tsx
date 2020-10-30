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
import {
  ReoccuranceUnitEnum,
  ReoccuranceType,
  WeekdaysEnum,
} from '../../../types/scheduling'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
)

export interface RepeatFrequencyProps {
  repeatFrequency: ReoccuranceType
  onChange: Function
}

const RepeatFrequency: React.FunctionComponent<RepeatFrequencyProps> = ({
  repeatFrequency,
  onChange,
}: RepeatFrequencyProps) => {
  const classes = useStyles()

  return (
    <>
      <SelectWithEnum
        label="Repeat Every"
        className={classes.formControl}
        value={repeatFrequency.unit}
        sourceData={ReoccuranceUnitEnum}
        id="frequencyunit"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...repeatFrequency,
            unit: e.target.value as keyof typeof ReoccuranceUnitEnum,
          })
        }
      ></SelectWithEnum>

      <SelectWithEnum
        label="Number of times"
        className={classes.formControl}
        value={repeatFrequency.frequency}
        sourceData={[...Array(5)]}
        id="frequencyunit"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...repeatFrequency,
            frequency: Number(e.target.value as string),
          })
        }
      ></SelectWithEnum>

      <FormGroup aria-label="position" row>
        {getEnumKeys(WeekdaysEnum).map(item => (
          <FormControlLabel
            value="top"
            key={item}
            control={
              <Checkbox
                checked={
                  repeatFrequency.days?.indexOf(WeekdaysEnum[item]) != -1
                }
                onChange={e => {
                  if (e.target.checked) {
                    onChange({
                      ...repeatFrequency,
                      days: repeatFrequency.days
                        ? [...repeatFrequency.days, WeekdaysEnum[item]]
                        : [WeekdaysEnum[item]],
                    })
                  } else {
                    onChange({
                      ...repeatFrequency,
                      days: repeatFrequency.days!.filter(
                        day => day !== WeekdaysEnum[item],
                      ),
                    })
                  }
                }}
              />
            }
            label={item}
            labelPlacement="top"
          />
        ))}
      </FormGroup>
    </>
  )
}

export default RepeatFrequency
