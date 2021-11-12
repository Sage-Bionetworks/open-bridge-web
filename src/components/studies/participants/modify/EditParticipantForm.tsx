import DatePicker from '@components/widgets/DatePicker'
import {MTBHeadingH3} from '@components/widgets/Headings'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
  SimpleTextInput,
  SimpleTextLabel,
} from '@components/widgets/StyledComponents'
import {
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
  makeStyles,
} from '@material-ui/core'
import EventService from '@services/event.service'
import {ExtendedScheduleEventObject} from '@services/schedule.service'
import {EditableParticipantData, ParticipantEvent} from '@typedefs/types'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import TimezoneDropdown from '../TimezoneDropdown'

const useStyles = makeStyles(theme => ({
  editForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  eventField: {
    marginBottom: '8px',
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
      },
      '&>.MuiFormControl-root': {
        margin: theme.spacing(2, 0),
      },
    },
  },
}))

type EditParticipantFormProps = {
  participant: EditableParticipantData
  scheduleEvents: ExtendedScheduleEventObject[]
  isEnrolledById: boolean
  onOK: Function
  onCancel: Function
  children?: React.ReactNode
  isBatchEdit?: boolean
  isLoading?: boolean
}

const EditParticipantForm: FunctionComponent<EditParticipantFormProps> = ({
  participant,
  isEnrolledById,
  scheduleEvents,
  onOK,
  onCancel,
  children,
  isBatchEdit,
  isLoading,
}) => {
  const classes = useStyles()
  const [note, setNotes] = React.useState(participant.note)
  const [customParticipantEvents, setCustomParticipantEvents] = React.useState<
    ParticipantEvent[]
  >([])
  const [currentTimeZone, setCurrentTimeZone] = React.useState(
    participant.clientTimeZone || ''
  )

  React.useEffect(() => {
    setCustomParticipantEvents(participant.events || [])
  }, [])

  const handleEventDateChange = (eventId: string, newDate: Date | null) => {
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

    setCustomParticipantEvents(prev => events)
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

  const evs = _.groupBy(scheduleEvents, g => g.originEventId)

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
    if (index === 0 || !eo.interval) {
      return (
        <div>
          {formattedEventId}
          <br /> {eo.delay}
        </div>
      )
    }
    return (
      <div>
        {formattedEventId}
        <br />
        <i> Week {index * eo.interval?.value}</i>
      </div>
    )
  }

  return (
    <>
      <DialogContent>
        <Box mt={0} mb={3}>
          <MTBHeadingH3>
            {!isBatchEdit ? (
              isEnrolledById ? (
                <span>Participant ID: {participant.externalId}</span>
              ) : (
                <span>Phone number: {participant.phoneNumber}</span>
              )
            ) : (
              'Assign the same values to selected participants:'
            )}
          </MTBHeadingH3>
        </Box>
        <FormGroup className={classes.editForm}>
          <>
            {Object.keys(evs).map(eventId1 => (
              <div>
                {eventId1 !== 'undefined' && <span>{eventId1}test</span>}
                {evs[eventId1].map((eo, index) => (
                  <div className={classes.eventField} key={eo.eventId}>
                    <DatePicker
                      key={eo.eventId}
                      label={getEventLabel(eo, index)}
                      id={eo.eventId}
                      value={getEventDateValue(
                        customParticipantEvents,
                        eo.eventId
                      )}
                      onChange={e =>
                        handleEventDateChange(eo.eventId, e)
                      }></DatePicker>
                  </div>
                ))}
              </div>
            ))}
          </>
          <Box width="375px" mb={3}>
            <TimezoneDropdown
              currentValue={currentTimeZone}
              onValueChange={setCurrentTimeZone}
            />
          </Box>
          {!isBatchEdit && (
            <FormControl>
              <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
              <SimpleTextInput
                value={note}
                placeholder="comments"
                onChange={e => setNotes(e.target.value)}
                id="note"
                multiline={true}
                rows={5}
              />
            </FormControl>
          )}
        </FormGroup>
      </DialogContent>
      <DialogActions style={{justifyContent: 'space-between'}}>
        {children && children}
        {!isLoading ? (
          <div>
            <DialogButtonSecondary onClick={() => onCancel()} color="primary">
              Cancel
            </DialogButtonSecondary>
            <DialogButtonPrimary
              onClick={() => {
                isBatchEdit
                  ? onOK(currentTimeZone)
                  : onOK(note, currentTimeZone, customParticipantEvents)
              }}
              color="primary"
              autoFocus>
              Save Changes
            </DialogButtonPrimary>
          </div>
        ) : (
          <CircularProgress color="primary" />
        )}
      </DialogActions>
    </>
  )
}

export default EditParticipantForm
