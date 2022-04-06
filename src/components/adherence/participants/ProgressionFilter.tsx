import {Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {ProgressionStatus} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useCommonStyles} from '../styles'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4),
  },
}))

type CompletionFilterProps = {
  progressionStatus: ProgressionStatus[] | undefined
  onChange: (arg: ProgressionStatus[] | undefined) => void
}

const COMPLETION_STATUS: {label: string; value: ProgressionStatus}[] = [
  {label: 'In Progress', value: 'in_progress'},
  {label: 'Completed', value: 'done'},
]

const ProgressionFilter: FunctionComponent<CompletionFilterProps> = ({
  progressionStatus,
  onChange,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}

  const updateProgressionStatus = (
    value: ProgressionStatus,
    checked: boolean
  ) => {
    let result
    let cStatus = progressionStatus
    if (cStatus === undefined) {
      cStatus = COMPLETION_STATUS.map(c => c.value)
    }
    if (checked) {
      if (!cStatus.includes(value)) {
        result = [...cStatus, value]
      }
    } else {
      result = cStatus.filter(v => v !== value)
    }

    onChange(result)
  }
  const isChecked = (value: ProgressionStatus) => {
    return !progressionStatus || progressionStatus.includes(value)
  }

  return (
    <>
      {COMPLETION_STATUS.map((status, index) => (
        <FormGroup key={status.value + index}>
          <FormControlLabel
            value={status.value}
            control={
              <Checkbox
                checked={isChecked(status.value)}
                onChange={e =>
                  updateProgressionStatus(
                    e.target.value as ProgressionStatus,
                    e.target.checked
                  )
                }
              />
            }
            label={status.label}
            labelPlacement="end"
          />
        </FormGroup>
      ))}
    </>
  )
}

export default ProgressionFilter
