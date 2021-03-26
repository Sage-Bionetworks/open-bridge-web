import {
  createStyles,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { ReminderIntervalType } from '../../../types/scheduling'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import SchedulingFormSection from './SchedulingFormSection'

export enum ReminderIntervalEnum {
  NONE = 'none',
  PT5M = '5 min',
  PT15M = '15 min',
  PT30M = '30 min',
  PT1H = '1 hr',
}
export type NotificationReminder = {
  interval?: string
  type?: ReminderIntervalType
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallRadio: {
      padding: '2px 9px',
      marginTop: '2px',
    },
  }),
)

export interface ReminderNotificationProps {
  reminder: NotificationReminder
  onChange: Function
}

const ReminderNotification: React.FunctionComponent<ReminderNotificationProps> = ({
  reminder,
  onChange,
}: ReminderNotificationProps) => {
  const classes = useStyles()

  const selections: ReminderIntervalType[] = [
    'after_window_start',
    'before_window_end',
  ]

  return (
    <SchedulingFormSection
      label={'Reminder notification:'}
      variant="small"
      border={false}
    >
      <SelectWithEnum
        value={reminder?.interval || 'NONE'}
        sourceData={ReminderIntervalEnum}
        id="remindAt"
        onChange={e => {
          let interval = e.target.value! as
            | keyof typeof ReminderIntervalEnum
            | undefined
          if (interval === 'NONE') {
            interval = undefined
          }
          onChange({
            interval,
            type: reminder?.type,
          })
        }}
      ></SelectWithEnum>
      <RadioGroup
        aria-label="Notification Reminder"
        name="remindAtType"
        style={{ marginTop: '5px' }}
        value={reminder?.type}
        onChange={e => {
          onChange({
            interval: reminder?.interval,
            type: e.target.value,
          })
        }}
      >
        <FormControlLabel
          value={selections[0]}
          control={<Radio size="small" className={classes.smallRadio} />}
          label="after start of window"
          disabled={!reminder?.interval || reminder?.interval === 'NONE'}
        />

        <FormControlLabel
          value={selections[1]}
          control={<Radio size="small" className={classes.smallRadio} />}
          disabled={!reminder?.interval || reminder?.interval === 'NONE'}
          label="before window expires "
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default ReminderNotification
