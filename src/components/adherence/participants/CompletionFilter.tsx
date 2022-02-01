import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {useCommonStyles} from '../styles'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    padding: theme.spacing(4),
  },
}))

type CompletionFilterProps = {
  completionStatus: CompletionStatus[]
  onChange: (arg: CompletionStatus[]) => void
}

export type CompletionStatus = 'completed' | 'progress'

const COMPLETION_STATUS: {label: string; value: CompletionStatus}[] = [
  {label: 'In Progress', value: 'progress'},
  {label: 'Completed', value: 'completed'},
]

const CompletionFilter: FunctionComponent<CompletionFilterProps> = ({
  completionStatus,
  onChange,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}

  const updateCompletionStatus = (
    value: CompletionStatus,
    checked: boolean
  ) => {
    var result = checked
      ? [...completionStatus, value]
      : completionStatus.filter(v => v !== value)

    onChange(result)
  }

  return (
    <>
      {COMPLETION_STATUS.map(status => (
        <FormGroup>
          <FormControlLabel
            key={status.value}
            value={status.value}
            control={
              <Checkbox
                checked={completionStatus?.includes(status.value)}
                onChange={e =>
                  updateCompletionStatus(
                    e.target.value as CompletionStatus,
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

export default CompletionFilter
