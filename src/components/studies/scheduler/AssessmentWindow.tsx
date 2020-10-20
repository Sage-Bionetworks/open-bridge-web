import React, { FunctionComponent, useState, useEffect } from 'react'
import { RouteComponentProps, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import LoadingComponent from '../../widgets/Loader'
import { useAsync } from '../../../helpers/AsyncHook'
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  InputLabel,
  createStyles,
  Theme,
  Button,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
} from '@material-ui/core'
import { createNamedExports } from 'typescript'
import DeleteIcon from '@material-ui/icons/Delete'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import { AssessmentWindowType, NotificationFreqEnum, ReminderIntervalEnum } from '../../../types/scheduling'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },

    formControlBlock: {
      margin: theme.spacing(1),
      display: 'block',
      minWidth: 'auto',
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
)

export interface AssessmentWindowProps {
  //use the following version instead if you need access to router props
  //export interface AssessmentWindowProps  extends  RouteComponentProps {
  //Enter your props here
  window: AssessmentWindowType
  onChange: Function
  onDelete: Function
}

const AssessmentWindow: React.FunctionComponent<AssessmentWindowProps> = ({
  window,
  onChange,
  onDelete,
}: AssessmentWindowProps) => {
  const classes = useStyles()

  const handleChange = (changeType: 'S' | 'E', value: number) => {
    if (changeType === 'S') {
      console.log(value, window.end, 'changin start')
      if (value < window.end) {
        onChange({ start: value, end: window.end })
      } else {
        console.log("can't do")
        return
      }
    } else {
      if (value > window.start) {
        onChange({ start: window.start, end: value })
      } else {
        console.log('cant')
        return
      }
    }
  }

  const getDropdownItems = (): { value: number; label: string }[] => {
    const menuItems = []

    const formatTime = (hours: number) => {
      var time = new Date(2000, 1, 1, hours)
      return time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
    }
    for (let i = 0; i < 24; i++) {
      menuItems.push({ value: i, label: formatTime(i) })
    }
    return menuItems
  }

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        border="1px solid #ccc"
        marginBottom="10px"
      >
        <FormControl className={classes.formControl}>
          <Select
            aria-label="from:"
            id="demo-simple-select"
            value={window.start}
            onChange={e => handleChange('S', Number(e.target.value))}
          >
            {getDropdownItems().map(item => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>start</FormHelperText>
        </FormControl>

        <Box> to</Box>

        <FormControl className={classes.formControl}>
          <Select
            id="demo-simple-select-helper"
            value={window.end}
            onChange={e => handleChange('E', Number(e.target.value))}
            aria-label="to"
          >
            {getDropdownItems().map(item => (
              <MenuItem value={item.value} key={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>end</FormHelperText>
        </FormControl>
        <Button onClick={() => onDelete()}>
          <DeleteIcon></DeleteIcon>
        </Button>
      </Box>
      <SelectWithEnum
        label="Notify Participant"
        className={classes.formControl}
        value={window.notification}
        sourceData={NotificationFreqEnum}
        id="notificationfreq"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...window,
            notification: e.target.value as keyof typeof NotificationFreqEnum,
          })
        }
      ></SelectWithEnum>
      <Box display="block">
        <FormControlLabel
         
          control={
            <Checkbox
            value={window.allowSnooze}
              onChange={e =>
                onChange({ ...window, allowSnooze: e.target.checked })
              }
            />
          }
          label="Allow participant to snooze"
        />
      </Box>
      <SelectWithEnum
        label="Reminder notification:"
        className={classes.formControl}
        value={window.reminder?.interval}
        sourceData={ReminderIntervalEnum}
        id="reminder"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange({
            ...window,
            reminder: {
              interval: e.target.value as keyof typeof ReminderIntervalEnum,
              type: window.reminder?.type,
            },
          })
        }
      ></SelectWithEnum>
      <RadioGroup
        aria-label="Notification Reminder"
        name="reminderType"
        value={window.reminder?.type}
        onChange={e =>
          onChange({
            ...window,
            reminder: {
              interval: window.reminder?.interval,
              type: e.target.value,
            },
          })
        }
      >
        <FormControlLabel
          value={'AFTER'}
          control={<Radio />}
          label="after start of window"
        />

        <FormControlLabel
          value={'BEFORE'}
          control={<Radio />}
          label="before window expires "
        />
      </RadioGroup>
    </Box>
  )
}

export default AssessmentWindow
