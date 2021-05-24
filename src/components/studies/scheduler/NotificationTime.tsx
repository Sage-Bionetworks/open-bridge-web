import {
  Box,
  createStyles,
  FormControlLabel,
  Radio,
  RadioGroup,
  Theme
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import { MHDsEnum, NotificationTimeAtEnum } from '../../../types/scheduling'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import SmallTextBox from '../../widgets/SmallTextBox'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'
import { getDropdownTimeItems } from './utility'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallRadio: {
      padding: '2px 9px',
      marginTop: '2px',
    },
  }),
)

export interface NotificationTimeProps {
  notifyAt: keyof typeof NotificationTimeAtEnum
  offset?: string
  onChange: (arg: {
    offset: string | undefined
    notifyAt: keyof typeof NotificationTimeAtEnum
  }) => void
  isFollowUp: boolean
  isMultiday: boolean
  windowStartTime?: string
}

const NotificationTime: React.FunctionComponent<NotificationTimeProps> = ({
  offset,
  onChange,
  isFollowUp,
  notifyAt,
  isMultiday,
  windowStartTime,
}: NotificationTimeProps) => {
  const classes = useStyles()
  const [hasOffset, setHasOffset] = React.useState(offset !== undefined)
  const [daysForMultidayOffset, setDaysForMultidayOffset] =
    React.useState<number | undefined>()
  const [timeForMultidayOffset, setTimeForMultidayOffset] =
    React.useState<string | undefined>()

  function changeMultidayOffset({
    days,
    time,
  }: {
    days: number | undefined
    time: string | undefined
  }) {
    setDaysForMultidayOffset(days)
    setTimeForMultidayOffset(time)

    let periodMinutes = 0
    if (time) {
      const windowStartPeriodMinutes = moment
        .duration(`PT${windowStartTime?.replace(':', 'H')}M`)
        .minutes()
      const timeOffsetPeriodMinutes = moment
        .duration(`PT${time?.replace(':', 'H')}M`)
        .minutes()
      periodMinutes = timeOffsetPeriodMinutes - windowStartPeriodMinutes
    }
    const durationFirstPass = moment.duration({
      minutes: periodMinutes,
      days: days,
    })
    const durationWithoutNegatives = moment.duration({
      days: durationFirstPass.days(),
      hours: durationFirstPass.hours(),
      minutes: durationFirstPass.minutes(),
    })
    console.log('parsed-z', durationWithoutNegatives.toISOString())!!!
    onChange({
      notifyAt: 'START_OF_WINDOW',
      offset: durationWithoutNegatives.toISOString(),
    })
  }

  React.useEffect(() => {
    if (offset) {
      const parsedOffset = moment.duration(offset)

      const roundedMinutes = (
        Math.round(parsedOffset.minutes() / 15) * 15
      ).toString()
      setDaysForMultidayOffset(parsedOffset.days())
      setTimeForMultidayOffset(
        `${parsedOffset
          .hours()
          .toString()
          .padStart(2, '0')}:${roundedMinutes.padStart(2, '0')}`,
      )
    }
  }, [])

  //--- initial notification fns ----//
  const toggleOffsetForInitialNotification = (value: string) => {
    if (value === 'false') {
      onChange({ notifyAt: 'START_OF_WINDOW', offset: undefined })
      setHasOffset(false)
    } else {
      setHasOffset(true)
    }
  }

  const initialWindow = (
    <SchedulingFormSection
      label={'Notify participant:'}
      variant="small"
      border={false}
    >
      <RadioGroup
        aria-label="Session Starts On"
        name="startDate"
        value={hasOffset}
        onChange={e => toggleOffsetForInitialNotification(e.target.value)}
      >
        <FormControlLabel
          value={false}
          control={<Radio />}
          label="at start of window"
        />
        <FormControlLabel
          control={
            <>
              <Radio value={true} />{' '}
              <Duration
                onChange={e => {
                  onChange({
                    offset: e.target.value,
                    notifyAt: 'START_OF_WINDOW',
                  })
                }}
                durationString={offset || ''}
                unitLabel="Notification Offset"
                numberLabel="notification offset"
                unitData={MHDsEnum}
              ></Duration>
            </>
          }
          label="after start of window"
        />
      </RadioGroup>
    </SchedulingFormSection>
  )

  const followUpSingleDay = (
    <SchedulingFormSection
      label={'Send a reminder notification:'}
      variant="small"
      border={false}
    >
      <Duration
        onChange={e => {
          onChange({ notifyAt: notifyAt, offset: e.target.value })
        }}
        durationString={offset || ''}
        unitLabel="Repeat Every"
        numberLabel="frequency number"
        unitData={MHDsEnum}
      ></Duration>

      <RadioGroup
        aria-label="Notification Reminder"
        name="remindAtType"
        style={{ marginTop: '5px', marginLeft: '8px' }}
        value={notifyAt}
        onChange={e => {
          onChange({
            notifyAt: e.target.value as keyof typeof NotificationTimeAtEnum,
            offset: offset,
          })
        }}
      >
        <FormControlLabel
          value={'START_OF_WINDOW'}
          control={<Radio size="small" className={classes.smallRadio} />}
          label="after start of window"
        />

        <FormControlLabel
          value={'END_OF_WINDOW'}
          control={<Radio size="small" className={classes.smallRadio} />}
          label="before window expires "
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
  const followUpMultiDay = (
    <SchedulingFormSection
      label={'Send a reminder notification:'}
      variant="small"
      border={false}
    >
      <SmallTextBox
        type="number"
        isLessThanOneAllowed={false}
        value={daysForMultidayOffset}
        onChange={e =>
          changeMultidayOffset({
            days: Number(e.target.value),
            time: timeForMultidayOffset,
          })
        }
      />

      <Box mx={0.5}>day(s) after at:</Box>
      <SelectWithEnum
        value={timeForMultidayOffset}
        style={{ marginLeft: 0 }}
        sourceData={getDropdownTimeItems()}
        id="from"
        onChange={e =>
          changeMultidayOffset({
            days: daysForMultidayOffset,
            time: e.target.value as string,
          })
        }
      ></SelectWithEnum>
    </SchedulingFormSection>
  )

  return isFollowUp
    ? isMultiday
      ? followUpMultiDay
      : followUpSingleDay
    : initialWindow
}

export default NotificationTime
