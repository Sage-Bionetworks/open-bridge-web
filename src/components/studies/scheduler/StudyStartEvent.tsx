import {makeStyles, MenuItem, Select} from '@material-ui/core'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import React from 'react'

const useStyles = makeStyles(theme => ({
  select: {padding: theme.spacing(1, 4, 1, 1), width: '150px'},
  formControl: {
    margin: theme.spacing(1, 1, 0, 1.25),
    fontSize: '14px',
  },
}))

export interface StudyStartEventProps {
  value: string
  onChangeFn: Function
  eventIdsInSchedule: string[]
  eventsInStudy?: string[]
}

const StudyStartEvent: React.FunctionComponent<StudyStartEventProps> = ({
  value,
  eventIdsInSchedule,
  eventsInStudy,
  onChangeFn,
}) => {
  const classes = useStyles()

  let eventDropdownValues: {value: string; label: string}[] = [
    {
      value: JOINED_EVENT_ID,
      label: EventService.formatEventIdForDisplay(JOINED_EVENT_ID),
    },
  ]

  if (eventsInStudy) {
    for (var eventId of eventsInStudy) {
      let e = eventIdsInSchedule.find(
        e => EventService.formatEventIdForDisplay(e) === eventId
      )
      if (e) {
        console.log('pusing' + e)
        eventDropdownValues.push({
          value: e,
          label: EventService.formatEventIdForDisplay(e),
        })
      }
    }
  }

  return (
    <Select
      variant="outlined"
      classes={{root: classes.select}}
      onChange={e => onChangeFn(e.target.value as string)}
      id={'id'}
      value={value}>
      {eventDropdownValues.map(item => (
        <MenuItem value={item.value} key={item.value}>
          {item.label}
        </MenuItem>
      ))}
    </Select>
  )
}

export default StudyStartEvent
