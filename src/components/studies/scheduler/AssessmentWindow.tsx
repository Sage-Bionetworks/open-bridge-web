import {
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  makeStyles,
  Paper
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import moment from 'moment'
import React from 'react'
import {
  AssessmentWindow as AssessmentWindowType, HDsEnum
} from '../../../types/scheduling'
import { StringDictionary } from '../../../types/types'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'



const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#ECF1F4',
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  windowNumber: {
    backgroundColor: theme.palette.primary.dark,
    height:theme.spacing(6),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: theme.spacing(6),
    color: '#000',
  },
  smallLabel: {
    minWidth: '200px',
    maxWidth: '300px',
    '& span': {
      display: 'block',
      fontSize: '12px'
    }
  }
}))


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

  const classes = useStyles()
  return (
    <Paper
     className={classes.root}
      elevation={2}
    >
      <Box position="relative">
        <Box className={classes.windowNumber}
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
      <Box mx="auto" width="auto">
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
            unitData={HDsEnum}
          ></Duration>
        </Box>
      </SchedulingFormSection>
      <SchedulingFormSection
        label={''}
        variant="small"
        isCollapseLabelSmall={true}
        border={false}
        style={{ padding: '0 16px' }}

      >
        <FormControlLabel
        style={{alignItems: 'flex-start'}}
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
          label={<div className={classes.smallLabel}><strong>Persistent Mode</strong><br/><span>Allow participant to complete this session as often as they like within the window of time</span></div>}
        />
      </SchedulingFormSection>
      </Box>
    </Paper>
  )
}

export default AssessmentWindow
