import {
  FormControl,
  FormGroup,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core'
import {JOINED_EVENT_ID} from '@services/event.service'
import constants from '@typedefs/constants'
import {HDWMEnum, SchedulingEvent} from '@typedefs/scheduling'
import React from 'react'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles(theme => ({
  select: {padding: theme.spacing(1, 4, 1, 1), width: '150px'},
  formControl: {
    margin: theme.spacing(1, 0, 1, 0),
  },
}))
export interface StartDateProps {
  delay?: string //ISO6801
  startEventId: string
  sessionName: string
  isBurst: boolean
  customEvents?: SchedulingEvent[]
  onChangeDelay: Function
  onChangeStartEventId: Function
  children: React.ReactNode
}

const StartDate: React.FunctionComponent<StartDateProps> = ({
  delay,
  startEventId,
  customEvents,
  onChangeDelay,
  onChangeStartEventId,
  sessionName,
  isBurst,
  children,
}: StartDateProps) => {
  const classes = useStyles()
  const [hasDelay, setHasDelay] = React.useState<boolean>(delay ? true : false)

  const eventDropdownValues = [
    ...[{value: JOINED_EVENT_ID, label: 'Initial_Login'}],
    ...(customEvents || []).map(e => ({
      value: constants.constants.CUSTOM_EVENT_PREFIX + e.eventId,
      label: e.eventId,
    })),
  ]

  const changeStartDelayType = (_hasDelay: boolean) => {
    setHasDelay(_hasDelay)

    if (!_hasDelay) {
      onChangeDelay(undefined)
    }
  }

  const SelectEventId: React.FunctionComponent<{
    disabled: boolean
    value: string
    onChangeFn: Function
  }> = ({disabled, value, onChangeFn}) => {
    return (
      <FormControl className={classes.formControl}>
        <Select
          variant="outlined"
          disabled={disabled}
          classes={{root: classes.select}}
          onChange={e => onChangeFn(e.target.value)}
          id={'id'}
          value={value}>
          {eventDropdownValues.map(item => (
            <MenuItem value={item.value} key={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )
  }

  return (
    <SchedulingFormSection
      label={`${sessionName} starts on*:`}
      disabled={isBurst}>
      <div>
        {isBurst && (
          <i>
            This session is a part of the study burst. Please remove it from
            burst in order to change the how it's started
          </i>
        )}
        <RadioGroup
          aria-label="Session Starts On"
          name="startDate"
          value={hasDelay}
          onChange={e => changeStartDelayType(e.target.value === 'true')}>
          <FormGroup row={true} style={{alignItems: 'center'}}>
            <Radio value={false} disabled={isBurst} />
            <SelectEventId
              disabled={hasDelay}
              value={!hasDelay ? startEventId : ''}
              onChangeFn={(e: string) =>
                onChangeStartEventId(e)
              }></SelectEventId>
            {children}
          </FormGroup>
          <FormGroup row={true} style={{alignItems: 'center'}}>
            <Radio value={true} disabled={isBurst} />{' '}
            <Duration
              onChange={e => {
                onChangeDelay(e.target.value)
              }}
              durationString={delay}
              unitLabel="Repeat Every"
              numberLabel="frequency number"
              unitDefault={HDWMEnum.D}
              unitData={HDWMEnum}
              disabled={!hasDelay || isBurst}
              isShowClear={false}></Duration>
            <span>from:&nbsp;</span>
            <SelectEventId
              disabled={!hasDelay || !!isBurst}
              value={hasDelay ? startEventId : ''}
              onChangeFn={(e: string) =>
                onChangeStartEventId(e)
              }></SelectEventId>
            {children}
          </FormGroup>
        </RadioGroup>
      </div>
    </SchedulingFormSection>
  )
}

export default StartDate
