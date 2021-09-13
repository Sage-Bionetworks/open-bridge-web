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
import {EditableParticipantData, ParticipantEvent} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import TimezoneDropdown from '../TimezoneDropdown'

const useStyles = makeStyles(theme => ({
  editForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

type EditParticipantFormProps = {
  participant: EditableParticipantData
  scheduleEventIds: string[]
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
  scheduleEventIds,
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

  return (
    <>
      <DialogContent>
        <Box mt={0} mb={3}>
          <MTBHeadingH3>
            {!isBatchEdit ? (
              isEnrolledById ? (
                <span>Reference ID: {participant.externalId}</span>
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
            {scheduleEventIds.map(eventId => (
              <DatePicker
                key={eventId}
                label={EventService.formatCustomEventIdForDisplay(eventId)}
                id={eventId}
                value={getEventDateValue(customParticipantEvents, eventId)}
                onChange={e => handleEventDateChange(eventId, e)}></DatePicker>
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
