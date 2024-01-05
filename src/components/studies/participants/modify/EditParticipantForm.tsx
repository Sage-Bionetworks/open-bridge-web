import {DefaultHeadingH3} from '@components/widgets/Headings'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
  SimpleTextInput,
  SimpleTextLabel,
} from '@components/widgets/StyledComponents'
import {Box, CircularProgress, DialogActions, DialogContent, FormControl, FormGroup} from '@mui/material'
import Alert from '@mui/material/Alert'
import makeStyles from '@mui/styles/makeStyles'
import {JOINED_EVENT_ID} from '@services/event.service'
import {ExtendedScheduleEventObject} from '@services/schedule.service'
import {EditableParticipantData, ParticipantEvent} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import TimezoneDropdown from '../TimezoneDropdown'
import EditParticipantEventsForm from './EditParticipantEventsForm'

const useStyles = makeStyles(theme => ({
  editForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
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
  onError?: Error
}

const EditParticipantForm: FunctionComponent<EditParticipantFormProps> = ({
  participant,
  isEnrolledById,
  scheduleEvents,
  onOK,
  onCancel,
  children,
  isBatchEdit,
  onError,
  isLoading,
}) => {
  const classes = useStyles()
  const [note, setNotes] = React.useState(participant.note)
  const [customParticipantEvents, setCustomParticipantEvents] = React.useState<ParticipantEvent[]>([])
  const [currentTimeZone, setCurrentTimeZone] = React.useState(participant.clientTimeZone || '')

  React.useEffect(() => {
    setCustomParticipantEvents(participant.events || [])
  }, [])

  const isTimeZoneRequired = (): boolean => {
    return customParticipantEvents?.filter(event => event.eventId !== JOINED_EVENT_ID).length > 0
  }

  return (
    <>
      <DialogContent>
        <Box mt={2} mb={3}>
          <DefaultHeadingH3>
            {!isBatchEdit ? (
              isEnrolledById ? (
                <span>Participant ID: {participant.externalId}</span>
              ) : (
                <span>Phone number: {participant.phoneNumber}</span>
              )
            ) : (
              'Assign the same values to selected participants:'
            )}
          </DefaultHeadingH3>
        </Box>
        <FormGroup className={classes.editForm}>
          {!isBatchEdit && (
            <EditParticipantEventsForm
              customParticipantEvents={customParticipantEvents}
              hideLoginEvent={false}
              scheduleEvents={scheduleEvents}
              onChange={e => {
                setCustomParticipantEvents(_prev => e)
              }}
            />
          )}
          <Box width="375px" mb={3}>
            <TimezoneDropdown
              isRequired={isTimeZoneRequired()}
              currentValue={currentTimeZone}
              onValueChange={e => setCurrentTimeZone(e)}
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
      {onError && <Alert color="error">{onError.message}</Alert>}
      <DialogActions style={{justifyContent: isBatchEdit ? 'flex-end' : 'space-between'}}>
        {children && children}
        {!isLoading ? (
          <div>
            <DialogButtonSecondary
              onClick={() => {
                onCancel()
              }}>
              Cancel
            </DialogButtonSecondary>
            <DialogButtonPrimary
              onClick={() => {
                isBatchEdit ? onOK(currentTimeZone) : onOK(note, currentTimeZone, customParticipantEvents)
              }}
              disabled={currentTimeZone?.length < 3 && isTimeZoneRequired()}
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
