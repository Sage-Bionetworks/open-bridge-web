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
  IconButton,
} from '@material-ui/core'
import { createNamedExports } from 'typescript'
import DeleteIcon from '@material-ui/icons/Close'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import {
  AssessmentWindow as AssessmentWindowType,
  NotificationFreqEnum,
  ReminderIntervalEnum,
  HSsEnum,
} from '../../../types/scheduling'
import { StringDictionary } from '../../../types/types'
import SmallTextBox from './SmallTextBox'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallRadio: {
      padding: '2px 9px',
      marginTop: '2px',
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
    <>
      <SchedulingFormSection
        label={'Start'}
        variant="small"
        style={{
          backgroundColor: '#BCD5E4',
          padding: '16px',
          marginBottom: '0',
        }}
      >
        <SelectWithEnum
          value={window.startHour}
          sourceData={getDropdownItems()}
          id="from"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChange({
                ...window,
                startHour: e.target.value
              })
            }
     
        ></SelectWithEnum>
        <IconButton
          style={{ position: 'absolute', top: 0, right: 0 }}
          edge="end"
          size="small"
          onClick={() => onDelete()}
        >
          <DeleteIcon></DeleteIcon>
        </IconButton>
      </SchedulingFormSection>
      <Box bgcolor="#bfd9e833" padding="16px" marginBottom="16px">
        <SchedulingFormSection label={'Expore after'} variant="small">
          <Box>
            <Box display="inline-flex" alignItems="center">
              <SmallTextBox
                type="number"
                onChange={(e: any) =>
                  onChange({
                    ...window,
                    end: {
                      endQuantity: e.target.value,
                      endUnit: window.end.endUnit,
                    },
                  })
                }
              />
              <SelectWithEnum
                value={window.end.endUnit}
                sourceData={HSsEnum}
                id="windowEndEnum"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  onChange({
                    ...window,
                    end: {
                      endQuantity: window.end.endQuantity,
                      endUnit: e.target.value,
                    },
                  })
                }
              ></SelectWithEnum>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  value={window.isAllowAnyFrequency}
                  onChange={e =>
                    onChange({
                      ...window,
                      isAllowAnyFrequency: e.target.checked,
                    })
                  }
                />
              }
              label="Allow participant to complete this session as often as they like within the window"
            />
          </Box>
        </SchedulingFormSection>
        <SchedulingFormSection label={'Notify Participant'} variant="small">
          <Box>
            <SelectWithEnum
              value={window.notification}
              style={{ marginLeft: 0 }}
              sourceData={NotificationFreqEnum}
              id="notificationfreq"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange({
                  ...window,
                  notification: e.target
                    .value as keyof typeof NotificationFreqEnum,
                })
              }
            ></SelectWithEnum>
            <FormControlLabel
              style={{ display: 'block' }}
              control={
                <Checkbox
                  value={window.isAllowSnooze}
                  onChange={e =>
                    onChange({ ...window, isAllowSnooze: e.target.checked })
                  }
                />
              }
              label="Allow participant to snooze"
            />
          </Box>
        </SchedulingFormSection>
        <SchedulingFormSection label={'Reminder notification:'} variant="small">
          <SelectWithEnum
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
            style={{ marginTop: '5px' }}
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
              control={<Radio size="small" className={classes.smallRadio} />}
              label="after start of window"
            />

            <FormControlLabel
              value={'BEFORE'}
              control={<Radio size="small" className={classes.smallRadio} />}
              label="before window expires "
            />
          </RadioGroup>
        </SchedulingFormSection>
      </Box>
    </>
  )
}

export default AssessmentWindow
