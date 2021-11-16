import DatePicker from '@components/widgets/DatePicker'
import {makeStyles} from '@material-ui/core'
import EventService from '@services/event.service'
import {ExtendedScheduleEventObject} from '@services/schedule.service'
import {ParticipantEvent} from '@typedefs/types'
import clsx from 'clsx'
import moment from 'moment'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  eventField: {
    '&>.MuiFormControl-root': {
      display: 'flex',
      flexDirection: 'row',
      padding: theme.spacing(0, 2),

      width: '100%',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',

      justifyContent: 'space-between',

      '& >label': {
        position: 'static',
        paddingLeft: 0,
        fontWeight: 'bold',
        lineHeight: '18px',
      },
      '&>.MuiFormControl-root': {
        margin: theme.spacing(2, 0),
      },
    },
    '&$burstOrigin>.MuiFormControl-root': {
      backgroundColor: theme.palette.error.light,
    },
    '&$burstEventField': {
      backgroundColor: '#f8f8f8',
      '&>.MuiFormControl-root': {
        margin: theme.spacing(0, 2),
        padding: 0,
        width: 'auto',
      },
      '&:not(:last-child)>.MuiFormControl-root': {
        borderBottom: '1px solid #BBC3CD',
      },
    },
  },
  burstEventField: {},
  burstOrigin: {},
  emptyDate: {
    margin: theme.spacing(2, 0),
    height: theme.spacing(4),
    width: theme.spacing(22),
    textAlign: 'center',
    lineHeight: 2,
  },
}))

type EditParticipantEventsFormProps = {
  customParticipantEvents: ParticipantEvent[]
  scheduleEvents: ExtendedScheduleEventObject[]
  onChange: (p: ParticipantEvent[]) => void
}

const EditParticipantEventsForm: FunctionComponent<EditParticipantEventsFormProps> =
  ({customParticipantEvents, scheduleEvents, onChange}) => {
    const classes = useStyles()

    const reCalculateBursts = (
      newBurstEvent: ParticipantEvent,
      events: ParticipantEvent[]
    ) => {
      var burstEvents = scheduleEvents.filter(
        e => e.originEventId === newBurstEvent.eventId
      )
      var newEvents = burstEvents.map(e => {
        const newEvent: ParticipantEvent = {
          eventId: e.eventId,
          timestamp: moment(newBurstEvent.timestamp!)
            .add(
              EventService.getBurstNumberFromEventId(e.eventId) *
                (e.interval?.value || 0),
              'week'
            )
            .toDate(),
        }
        return newEvent
      })
      newEvents.forEach(ne => {
        const participantEventIndex = events.findIndex(
          e => e.eventId === ne.eventId
        )
        if (participantEventIndex > -1) {
          events[participantEventIndex] = ne
        } else {
          events.push(ne)
        }
      })

      // setCustomParticipantEvents(prev => events)
      onChange(events)
    }
    function isBurstOriginEvent(eventId: string): boolean {
      return scheduleEvents.find(e => e.originEventId === eventId) !== undefined
    }

    const handleEventDateChange = (
      eventId: string,

      newDate: Date | null
    ) => {
      const newEvent: ParticipantEvent = {
        eventId: eventId,
        timestamp: newDate || undefined,
      }
      let events = [...customParticipantEvents]
      const participantEventIndex = events.findIndex(e => e.eventId === eventId)
      if (participantEventIndex > -1) {
        events[participantEventIndex] = newEvent
      } else {
        events.push(newEvent)
      }
      if (isBurstOriginEvent(eventId)) {
        reCalculateBursts(newEvent, events)
      } else {
        // setCustomParticipantEvents(prev => events)
        onChange(events)
      }
    }

    const getEventDateValue = (
      participantEvents: ParticipantEvent[] | undefined,
      currentEventId: string
    ) => {
      if (!participantEvents) {
        return null
      }
      const matchingParticipantEvent = participantEvents.find(
        pEvt => pEvt.eventId === currentEventId
      )
      if (matchingParticipantEvent) {
        console.log('found event')
        return matchingParticipantEvent.timestamp || null
      }
      return null
    }

    function getEventLabel(
      eo: ExtendedScheduleEventObject,
      index: number
    ): React.ReactNode {
      const formattedEventId = EventService.formatCustomEventIdForDisplay(
        eo.eventId
      )
      // not a burst
      if (!eo.originEventId) {
        return formattedEventId
      }
      return (
        <div>
          {formattedEventId}:
          <br />
          <i style={{fontWeight: 'normal', fontSize: '12px'}}>
            Week {(index + 1) * (eo.interval?.value || 0)}
          </i>
        </div>
      )
    }

    function getEmptyDate(eo: ExtendedScheduleEventObject, index: number) {
      return (
        <div className="MuiFormControl-root">
          <label>{getEventLabel(eo, index)}</label>
          <div className={classes.emptyDate}>--</div>
        </div>
      )
    }

    return (
      <>
        {scheduleEvents
          .filter(e => e.originEventId === undefined)
          .map((nonBurstEvent, index) => (
            <div
              style={{marginBottom: '8px'}}
              key={nonBurstEvent.eventId + index}>
              <div
                className={clsx(
                  classes.eventField,
                  isBurstOriginEvent(nonBurstEvent.eventId) &&
                    classes.burstOrigin
                )}
                key={nonBurstEvent.eventId}>
                <DatePicker
                  label={getEventLabel(nonBurstEvent, index)}
                  id={nonBurstEvent.eventId}
                  value={getEventDateValue(
                    customParticipantEvents,
                    nonBurstEvent.eventId
                  )}
                  onChange={e =>
                    handleEventDateChange(nonBurstEvent.eventId, e)
                  }></DatePicker>
              </div>
              {scheduleEvents
                .filter(e => e.originEventId === nonBurstEvent.eventId)
                .map((burstEvent, index) => (
                  <div
                    className={clsx(
                      classes.eventField,
                      classes.burstEventField
                    )}
                    style={{}}
                    key={burstEvent.eventId}>
                    {getEventDateValue(
                      customParticipantEvents,
                      nonBurstEvent.eventId
                    ) !== null ? (
                      <DatePicker
                        label={getEventLabel(burstEvent, index)}
                        id={burstEvent.eventId}
                        value={getEventDateValue(
                          customParticipantEvents,
                          burstEvent.eventId
                        )}
                        onChange={e =>
                          handleEventDateChange(burstEvent.eventId, e)
                        }></DatePicker>
                    ) : (
                      getEmptyDate(burstEvent, index)
                    )}
                  </div>
                ))}
            </div>
          ))}
      </>
    )
  }

export default EditParticipantEventsForm
