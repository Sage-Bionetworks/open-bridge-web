import {
  Box,
  Checkbox,

  FormControlLabel,
  IconButton,
  Paper
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
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
  //use the following version instead if you need access to router props
  //export interface AssessmentWindowProps  extends  RouteComponentProps {
  //Enter your props here
  window: AssessmentWindowType
  index: number
  onChange: Function
  onDelete: Function
}

const AssessmentWindow: React.FunctionComponent<AssessmentWindowProps> = ({
  window,
  onChange,
  onDelete,
  index,
}: AssessmentWindowProps) => {

  const getDropdownItems = (): StringDictionary<string> => {
    const menuItems: StringDictionary<string> = {}

    const formatTime = (hours: number) => {
      var time = new Date(2000, 1, 1, hours)
      return time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
    }
    for (let i = 0; i < 24; i++) {
      menuItems[i] = formatTime(i)
    }
    return menuItems
  }

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
              startTime: e.target.value,
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
            onChange={e => {
              onChange({
                ...window,
                end: e,
              })
            }}
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
              checked= {window.persistent===true}
              onChange={e =>{
         
                onChange({
                  ...window,
                  persistent: e.target.checked,
                })
              }
              }
            />
          }
          label="Allow participant to complete this session as often as they like within the window"
        />
      </SchedulingFormSection>
    </Paper>
  )
}

export default AssessmentWindow
