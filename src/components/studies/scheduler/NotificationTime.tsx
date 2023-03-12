import {Box, FormControlLabel, FormGroup, Radio, RadioGroup, Theme} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

import React from 'react'
import {MHDsEnum, NotificationTimeAtEnum} from '../../../types/scheduling'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import SmallTextBox from '../../widgets/SmallTextBox'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'
import {getDropdownTimeItems} from './utility'

dayjs.extend(duration)

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    smallRadio: {
      padding: '2px 9px',
      marginTop: '2px',
    },
  })
)

export interface NotificationTimeProps {
  notifyAt: keyof typeof NotificationTimeAtEnum
  offset?: string
  onChange: (arg: {offset: string | undefined; notifyAt: keyof typeof NotificationTimeAtEnum}) => void
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
  const [daysForMultidayOffset, setDaysForMultidayOffset] = React.useState<number | undefined>()
  const [timeForMultidayOffset, setTimeForMultidayOffset] = React.useState<string | undefined>()

  function changeMultidayOffset({days, time}: {days: number | undefined; time: string | undefined}) {
    setDaysForMultidayOffset(days)
    setTimeForMultidayOffset(time)

    let periodMinutes = 0
    //convert it to the offset from the start of the window
    if (time) {
      const windowStartPeriodMinutes = dayjs.duration(`PT${windowStartTime?.replace(':', 'H')}M`).asMinutes()
      const timeOffsetPeriodMinutes = dayjs.duration(`PT${time?.replace(':', 'H')}M`).asMinutes()
      periodMinutes = timeOffsetPeriodMinutes - windowStartPeriodMinutes
    }
    const durationFirstPass = dayjs.duration({
      minutes: periodMinutes,
      days: days,
    })
    //converting it to minutes and back gets rid of negatives times if the notification time is before window start time
    const durationWithoutNegatives = dayjs.duration(durationFirstPass.asMinutes(), 'm').toISOString()

    onChange({
      notifyAt: 'after_window_start',
      offset: durationWithoutNegatives,
    })
  }

  const getDisplayOffset = () => {
    if (!offset) {
      return ''
    }

    if (isMultiday) {
      return offset
    }
    const parsedOffset = dayjs.duration(offset)
    //if for some reason it's not in a single unit -- convert it to minutes (should not happen)
    if (
      (parsedOffset.days() && parsedOffset.minutes()) ||
      (parsedOffset.days() && parsedOffset.hours()) ||
      (parsedOffset.minutes() && parsedOffset.hours())
    ) {
      const result = `PT${parsedOffset.asMinutes()}M`
      return result
    }
    return offset
  }

  React.useEffect(() => {
    if (offset) {
      //get the offset
      let parsedOffset = dayjs.duration(offset)

      //get and remove the days
      const daysOffset = parsedOffset.days()
      parsedOffset = parsedOffset.subtract(daysOffset, 'd')
      //get the window start time as duration
      const offsetMinutes = parsedOffset.asMinutes()
      const windowStartPeriodMinutes = dayjs.duration(`PT${windowStartTime?.replace(':', 'H')}M`).asMinutes()
      //round minutes to 15
      const offsetTimeMinutes = Math.round((windowStartPeriodMinutes + offsetMinutes) / 15) * 15

      var offsetTime = dayjs.duration(offsetTimeMinutes, 'minute')
      //if there is days overflow when you add the interval + start time
      setDaysForMultidayOffset(daysOffset + offsetTime.days())
      setTimeForMultidayOffset(
        `${offsetTime.hours().toString().padStart(2, '0')}:${offsetTime.minutes().toString().padStart(2, '0')}`
      )
    }
  }, [offset, isMultiday])

  //--- initial notification fns ----//
  const toggleOffsetForInitialNotification = (value: string) => {
    if (value === 'false') {
      onChange({notifyAt: 'after_window_start', offset: undefined})
      setHasOffset(false)
    } else {
      setHasOffset(true)
    }
  }

  const initialWindow = (
    <SchedulingFormSection label={'Notify participant:'} border={false}>
      <RadioGroup
        aria-label="Session Starts On"
        name="startDate"
        value={hasOffset}
        onChange={e => toggleOffsetForInitialNotification(e.target.value)}>
        <FormControlLabel value={false} control={<Radio />} label="at start of window" />
        <FormControlLabel
          control={
            <>
              <Radio value={true} />{' '}
              <Duration
                onChange={e => {
                  onChange({
                    offset: e.target.value,
                    notifyAt: 'after_window_start',
                  })
                }}
                onFocus={() => toggleOffsetForInitialNotification('true')}
                durationString={offset || ''}
                unitLabel="Notification Offset"
                numberLabel="notification offset"
                unitDefault={MHDsEnum.M}
                placeHolder="minutes"
                unitData={MHDsEnum}></Duration>
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
      style={{paddingBottom: 0, marginBottom: 0}}
      border={false}>
      <Duration
        onChange={e => {
          onChange({notifyAt: notifyAt, offset: e.target.value})
        }}
        durationString={getDisplayOffset()}
        unitLabel="Repeat Every"
        numberLabel="frequency number"
        placeHolder="hours"
        unitDefault={MHDsEnum.H}
        unitData={MHDsEnum}></Duration>

      <RadioGroup
        aria-label="Notification Reminder"
        name="remindAtType"
        style={{marginTop: '5px', marginLeft: '8px'}}
        value={notifyAt}
        onChange={e => {
          onChange({
            notifyAt: e.target.value as keyof typeof NotificationTimeAtEnum,
            offset: offset,
          })
        }}>
        <FormControlLabel
          value={'after_window_start'}
          control={<Radio size="small" className={classes.smallRadio} />}
          label="after start of window"
        />

        <FormControlLabel
          value={'before_window_end'}
          control={<Radio size="small" className={classes.smallRadio} />}
          label="before window expires "
        />
      </RadioGroup>
    </SchedulingFormSection>
  )
  const followUpMultiDay = (
    <SchedulingFormSection
      label={'Send a reminder notification:'}
      style={{paddingBottom: 0, marginBottom: 0}}
      border={false}>
      <FormGroup row sx={{alignItems: 'center'}}>
        <SmallTextBox
          sx={{marginBottom: 0}}
          type="number"
          isLessThanOneAllowed={false}
          value={daysForMultidayOffset}
          onChange={e => {
            changeMultidayOffset({
              days: Number(e.target.value),
              time: timeForMultidayOffset,
            })
          }}
        />

        <Box mx={0.5}>day(s) after at:</Box>
        <SelectWithEnum
          value={timeForMultidayOffset || windowStartTime}
          style={{marginLeft: 0}}
          sourceData={getDropdownTimeItems()}
          id="from"
          onChange={e =>
            changeMultidayOffset({
              days: daysForMultidayOffset,
              time: e.target.value as string,
            })
          }></SelectWithEnum>
      </FormGroup>
    </SchedulingFormSection>
  )

  return isFollowUp ? (isMultiday ? followUpMultiDay : followUpSingleDay) : initialWindow
}

export default NotificationTime
