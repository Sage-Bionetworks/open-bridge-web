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
  MIN_5 = '5 min',
  MIN_10 = '10 min',
  MIN_15 = '15 min',
  MIN_30 = '30 min',
  HR_1 = '1hr. ',
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

  return (
    <SchedulingFormSection
      label={'Reminder notification:'}
      variant="small"
      border={false}
    >
      <SelectWithEnum
        value={reminder?.interval}
        sourceData={ReminderIntervalEnum}
        id="remindAt"
        onChange={e => {
          const interval = e.target.value! as keyof typeof ReminderIntervalEnum

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
            type: e.target.value as ReminderIntervalType,
          })
        }}
      >
        <FormControlLabel
          value={'AFTER'}
          control={<Radio size="small" className={classes.smallRadio} />}
          label="after start of window"
          disabled={!reminder?.interval || reminder?.interval === 'NONE'}
        />

        <FormControlLabel
          value={'BEFORE'}
          control={<Radio size="small" className={classes.smallRadio} />}
          disabled={!reminder?.interval || reminder?.interval === 'NONE'}
          label="before window expires "
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default ReminderNotification
