import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import moment from 'moment'
import React from 'react'
import {
  AssessmentWindow as AssessmentWindowType,
  HSsEnum
} from '../../../types/scheduling'
import { StringDictionary } from '../../../types/types'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

export interface AssessmentWindowProps {
  window: AssessmentWindowType
  index: number
  onChange: (w: AssessmentWindowType) =>void
  onDelete: Function
}

function getDropdownItems(): StringDictionary<string> {
  const menuItems: StringDictionary<string> = {}
  const date = moment([2021, 1, 1, 8])
  menuItems[date.format('HH:mm')] = date.format('LT')

  for (let i = 0; i < 95; i++) {
    date.add(15, 'm')
    menuItems[date.format('HH:mm')] = date.format('LT')
  }
  return menuItems
}

const AssessmentWindow: React.FunctionComponent<AssessmentWindowProps> = ({
  window,
  onChange,
  onDelete,
  index,
}: AssessmentWindowProps) => {
  return (
    <Paper
      style={{
        backgroundColor: '#bfd9e833',
        paddingBottom: '16px',
        marginBottom: '16px',
      }}
      elevation={2}
    >
      <Box position="relative">
        <Box
          bgcolor="#BCD5E4"
          height="48px"
          textAlign="center"
          lineHeight="48px"
          width="48px"
        >
          {index + 1}.
        </Box>
        <IconButton
          style={{ position: 'absolute', top: '12px', right: '16px' }}
          edge="end"
          size="small"
          onClick={() => onDelete()}
        >
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </Box>
      <SchedulingFormSection
        label={'Start'}
        variant="small"
        border={false}
        style={{ padding: '0 16px' }}
      >
        <SelectWithEnum
          value={window.startTime}
          sourceData={getDropdownItems()}
          id="from"
          onChange={e =>
            onChange({
              ...window,
              startTime: e.target.value as string,
            })
          }
        ></SelectWithEnum>
      </SchedulingFormSection>

      <SchedulingFormSection
        label={'Expire after'}
        variant="small"
        border={false}
        style={{ padding: '0 16px' }}
      >
        <Box display="inline-flex" alignItems="center">
          <Duration
            onChange={e => 
              onChange({
                ...window,
               expiration: e.target.value as string,
              })
            }
            durationString={window.expiration || '    '}
            unitLabel="Repeat Every"
            numberLabel="frequency number"
            unitData={HSsEnum}
          ></Duration>
        </Box>
      </SchedulingFormSection>
      <SchedulingFormSection
        label={''}
        variant="small"
        border={false}
        style={{ padding: '0 16px' }}
      >
        <FormControlLabel
          control={
            <Checkbox
              value={window.persistent}
              checked={window.persistent === true}
              onChange={e => {
                onChange({
                  ...window,
                  persistent: e.target.checked,
                })
              }}
            />
          }
          label="Allow participant to complete this session as often as they like within the window"
        />
      </SchedulingFormSection>
    </Paper>
  )
}

export default AssessmentWindow
