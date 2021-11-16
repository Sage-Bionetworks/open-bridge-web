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
import React from 'react'
import {HDWMEnum, SchedulingEvent} from '../../../types/scheduling'
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
  customEvents?: SchedulingEvent[]
  onChangeDelay: Function
  onChangeStartEventId: Function
}

const StartDate: React.FunctionComponent<StartDateProps> = ({
  delay,
  startEventId,
  customEvents,
  onChangeDelay,
  onChangeStartEventId,
  sessionName,
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
    <SchedulingFormSection label={`${sessionName} starts on*:`}>
      <RadioGroup
        aria-label="Session Starts On"
        name="startDate"
        value={hasDelay}
        onChange={e => changeStartDelayType(e.target.value === 'true')}>
        <FormGroup row={true}>
          <Radio value={false} />
          <SelectEventId
            disabled={hasDelay}
            value={!hasDelay ? startEventId : ''}
            onChangeFn={(e: string) => onChangeStartEventId(e)}></SelectEventId>
        </FormGroup>
        <FormGroup row={true} style={{alignItems: 'center'}}>
          <Radio value={true} />{' '}
          <Duration
            onChange={e => {
              onChangeDelay(e.target.value)
            }}
            durationString={delay}
            unitLabel="Repeat Every"
            numberLabel="frequency number"
            unitDefault={HDWMEnum.D}
            unitData={HDWMEnum}
            disabled={!hasDelay}
            isShowClear={false}></Duration>
          <span>from:&nbsp;</span>
          <SelectEventId
            disabled={!hasDelay}
            value={hasDelay ? startEventId : ''}
            onChangeFn={(e: string) => onChangeStartEventId(e)}></SelectEventId>
        </FormGroup>
      </RadioGroup>
    </SchedulingFormSection>
  )
}

export default StartDate
