import {Checkbox, FormControlLabel, FormGroup} from '@mui/material'
import {ProgressionStatus} from '@typedefs/types'
import {FunctionComponent} from 'react'

type CompletionFilterProps = {
  progressionStatus: ProgressionStatus[] | undefined
  counts: Map<ProgressionStatus, number>
  onChange: (arg: ProgressionStatus[] | undefined) => void
}

const COMPLETION_STATUS: {label: string; value: ProgressionStatus}[] = [
  {label: 'In Progress', value: 'in_progress'},
  {label: 'Completed', value: 'done'},
]

const ProgressionFilter: FunctionComponent<CompletionFilterProps> = ({progressionStatus, onChange, counts}) => {
  const updateProgressionStatus = (value: ProgressionStatus, checked: boolean) => {
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
                disabled={isChecked(status.value) && progressionStatus?.length === 1}
                onChange={e => updateProgressionStatus(e.target.value as ProgressionStatus, e.target.checked)}
              />
            }
            label={`${status.label} (${counts.get(status.value)})`}
            labelPlacement="end"
          />
        </FormGroup>
      ))}
    </>
  )
}

export default ProgressionFilter
