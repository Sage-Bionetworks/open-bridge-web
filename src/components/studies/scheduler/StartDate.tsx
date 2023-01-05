import EditTwoToneIcon from '@mui/icons-material/EditTwoTone'
import {FormControl, FormGroup, IconButton, MenuItem, Radio, RadioGroup, Select, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {JOINED_EVENT_ID} from '@services/event.service'
import {theme} from '@style/theme'
import constants from '@typedefs/constants'
import {HDWMEnum, SchedulingEvent} from '@typedefs/scheduling'
import React, {FunctionComponent} from 'react'
import Duration from './Duration'
import SchedulingFormSection from './SchedulingFormSection'

const useStyles = makeStyles(theme => ({
  select: {padding: theme.spacing(1, 4, 1, 1), width: '150px'},
  formControl: {
    margin: theme.spacing(1, 0, 1, 0),
    '& button': {
      width: '45px',
      height: '45px',
      padding: '8px',
      marginLeft: '4px',
    },
  },
  disabled: {
    '& .MuiOutlinedInput-root': {
      opacity: 0.5,
    },
    '&  button': {
      opacity: 0.4,
      paddingRight: '4px',
      pointerEvents: 'none',
    },
    '& .MuiRadio-colorSecondary': {
      opacity: 0.5,
    },
  },
  editIcon: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}))

type ToolIconProps = {
  onOpenEventsEditor: Function
}
const ToolIcon: FunctionComponent<ToolIconProps> = ({onOpenEventsEditor}) => {
  const classes = useStyles()

  return (
    <Tooltip title="Edit Custom Event">
      <IconButton className={classes.editIcon} onClick={() => onOpenEventsEditor()} size="large">
        {' '}
        <EditTwoToneIcon sx={{color: theme.palette.primary.main, '&:hover': {stroke: theme.palette.primary.main}}} />
      </IconButton>
    </Tooltip>
  )
}

export interface StartDateProps {
  delay?: string //ISO6801
  startEventId: string
  sessionName: string
  isBurst: boolean
  customEvents?: SchedulingEvent[]
  onChangeDelay: Function
  onChangeStartEventId: Function
  children: React.ReactNode
  onOpenEventsEditor: Function
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
  onOpenEventsEditor,
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
          classes={{select: classes.select}}
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
    <SchedulingFormSection label="Start Session On">
      <div className={isBurst ? classes.disabled : ''}>
        <RadioGroup
          aria-label="Session Starts On"
          name="startDate"
          value={hasDelay}
          onChange={e => changeStartDelayType(e.target.value === 'true')}>
          <FormGroup row={true} style={{alignItems: 'center'}}>
            <Radio value={false} disabled={isBurst} color="secondary" />
            <SelectEventId
              disabled={hasDelay || isBurst}
              value={!hasDelay ? startEventId : ''}
              onChangeFn={(e: string) => onChangeStartEventId(e)}></SelectEventId>
            <ToolIcon onOpenEventsEditor={onOpenEventsEditor} />
            {isBurst ? children : ''}
          </FormGroup>
          <FormGroup row={true} style={{alignItems: 'center'}}>
            <Radio value={true} color="secondary" disabled={isBurst} />{' '}
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
              placeHolder="days"
              isShowClear={false}></Duration>
            <span>from:&nbsp;</span>
            <SelectEventId
              disabled={!hasDelay || !!isBurst}
              value={hasDelay ? startEventId : ''}
              onChangeFn={(e: string) => onChangeStartEventId(e)}></SelectEventId>
            <ToolIcon onOpenEventsEditor={onOpenEventsEditor} />
          </FormGroup>
        </RadioGroup>
      </div>
    </SchedulingFormSection>
  )
}

export default StartDate
