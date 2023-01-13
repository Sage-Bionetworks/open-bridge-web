import EditParticipantEventsForm from '@components/studies/participants/modify/EditParticipantEventsForm'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import ErrorDisplay from '@components/widgets/ErrorDisplay'
import {DialogButtonPrimary, DialogButtonSecondary} from '@components/widgets/StyledComponents'
import {Alert, CircularProgress, Dialog, DialogActions, DialogContent} from '@mui/material'
import {useEvents, useEventsForUser, useUpdateEventsForUser} from '@services/eventHooks'
import {ParticipantEvent} from '@typedefs/types'
import React, {FunctionComponent} from 'react'

type EditParticipantEventsProps = {
  studyId: string
  participantId: string
  clientTimeZone?: string
  onCloseDialog: () => void
}

const EditParticipantEvents: FunctionComponent<EditParticipantEventsProps> = ({
  studyId,
  participantId,
  clientTimeZone,
  onCloseDialog,
}) => {
  const [participantEvents, setParticipantEvents] = React.useState<ParticipantEvent[]>([])

  const {data: scheduleEvents = [], error: eventError} = useEvents(studyId)
  const {data: events} = useEventsForUser(studyId, participantId)

  React.useEffect(() => {
    if (events) {
      setParticipantEvents(events.customEvents)
    }
  }, [events])

  const {isSuccess, isError, isIdle, error, mutate: updateEvents} = useUpdateEventsForUser()

  return (
    <Dialog open={true} maxWidth="sm" fullWidth scroll="body">
      <DialogTitleWithClose onCancel={onCloseDialog} title="Edit Participant Event Date" />
      <DialogContent>
        <EditParticipantEventsForm
          hideLoginEvent={true}
          scheduleEvents={scheduleEvents}
          onChange={customEvents => {
            setParticipantEvents(customEvents)
          }}
          customParticipantEvents={participantEvents || ([] as ParticipantEvent[])}
        />
      </DialogContent>
      {isError && <ErrorDisplay style={{padding: '0 24px'}}>{(error as Error).message}</ErrorDisplay>}
      {!clientTimeZone && <Alert>You must select a time zone for this participant</Alert>}
      <DialogActions>
        <DialogButtonSecondary onClick={onCloseDialog}>Cancel</DialogButtonSecondary>
        <DialogButtonPrimary
          disabled={!clientTimeZone}
          onClick={() => {
            const previousEvents = events?.customEvents
            const updatedEvents = participantEvents

            //only update changes events
            const eventsToUpdate = updatedEvents.filter(ue => {
              const matchedEvent = events?.customEvents.find(e => e.eventId === ue.eventId)
              return !matchedEvent || matchedEvent.timestamp !== ue.timestamp
            })

            updateEvents(
              {
                studyId,
                participantId,
                customEvents: eventsToUpdate,
                clientTimeZone: clientTimeZone!,
              },
              {
                onSuccess: () => {
                  onCloseDialog()
                },
              }
            )
          }}
          color="primary">
          {isIdle || isError ? <> Save Changes</> : <CircularProgress />}
        </DialogButtonPrimary>
      </DialogActions>
    </Dialog>
  )
}

export default EditParticipantEvents
