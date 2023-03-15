import SelectWithEnum from '@components/widgets/SelectWithEnum'
import {Box, FormGroup, InputLabel, Paper} from '@mui/material'
import {theme} from '@style/theme'
import {AssessmentWindow as AssessmentWindowType, HDWMEnum} from '@typedefs/scheduling'
import React from 'react'
import Duration from './Duration'
import {StyledSmallSectionHeader} from './SharedComponents'
import {getDropdownTimeItems} from './utility'

export interface AssessmentWindowProps {
  window: AssessmentWindowType
  index: number
  onChange: (w: AssessmentWindowType) => void
  onDelete: Function
  errorText: string
}

const AssessmentWindow: React.FunctionComponent<AssessmentWindowProps> = ({
  window,
  onChange,
  onDelete,
  index,
  errorText,
}: AssessmentWindowProps) => {
  return (
    <Paper
      aria-label={`session-window-${index + 1}`}
      sx={{margin: theme.spacing(2, 0), border: errorText ? `1px solid ${theme.palette.error.main}` : 'none'}}
      elevation={2}>
      <StyledSmallSectionHeader onClick={() => onDelete()} title={`Session Window ${index + 1}`} />

      <Box sx={{display: 'flex', padding: theme.spacing(0, 3, 2, 3)}}>
        <FormGroup aria-label="start-time" row={true} style={{alignItems: 'center'}}>
          <InputLabel htmlFor="from"> Start:&nbsp;&nbsp;</InputLabel>

          <SelectWithEnum
            value={window.startTime}
            style={{marginLeft: 0}}
            sourceData={getDropdownTimeItems()}
            name="from"
            onChange={e =>
              onChange({
                ...window,
                startTime: e.target.value as string,
              })
            }></SelectWithEnum>
        </FormGroup>

        <FormGroup aria-label="expiration-after" row={true} style={{alignItems: 'center'}}>
          <InputLabel htmlFor="expire">Expire after: &nbsp;&nbsp;</InputLabel>
          <Box display="inline-flex" alignItems="center">
            <Duration
              onChange={e =>
                onChange({
                  ...window,
                  expiration: e.target.value as string,
                })
              }
              durationString={window.expiration || ''}
              unitDefault={HDWMEnum.H}
              id="expire"
              unitLabel="Expire after"
              numberLabel="expiration"
              placeHolder="hours"
              unitData={HDWMEnum}></Duration>
          </Box>
        </FormGroup>
      </Box>
    </Paper>
  )
}

export default AssessmentWindow
