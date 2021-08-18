import {
  Box,
  CircularProgress,
  DialogActions,
  DialogContent,
  FormControl,
  FormGroup,
  FormHelperText,
  makeStyles,
} from '@material-ui/core'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import Utility from '../../../helpers/utility'
import ParticipantService from '../../../services/participants.service'
import {latoFont} from '../../../style/theme'
import {SchedulingEvent} from '../../../types/scheduling'
import {EditableParticipantData, ParticipantEvent} from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import {MTBHeadingH3} from '../../widgets/Headings'
import TextMask from '../../widgets/MaskedInput'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
  SimpleTextInput,
  SimpleTextLabel,
} from '../../widgets/StyledComponents'

const useStyles = makeStyles(theme => ({
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
  withdrawalNotice: {
    fontSize: '16px',
    fontFamily: latoFont,

    '& p': {
      marginBottom: '16px',
      marginTop: '0',
    },
  },
}))

type AddParticipantFormProps = {
  participant: EditableParticipantData
  customStudyEvents: SchedulingEvent[]
  isEnrolledById: boolean

  onChange: (p: EditableParticipantData) => void
}

export type EditParticipantFormProps = {
  participant: EditableParticipantData
  customStudyEvents: SchedulingEvent[]
  isEnrolledById: boolean
  onOK: Function
  onCancel: Function
  children?: React.ReactNode
  isBatchEdit?: boolean
  isLoading?: boolean
}

export const EditParticipantForm: FunctionComponent<EditParticipantFormProps> =
  ({
    participant,
    isEnrolledById,
    customStudyEvents,
    onOK,
    onCancel,
    children,
    isBatchEdit,
    isLoading,
  }) => {
    const classes = useStyles()
    const [note, setNotes] = React.useState(participant.note)
    const [customParticipantEvents, setCustomParticipantEvents] =
      React.useState<ParticipantEvent[]>([])

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
      currentEvent: SchedulingEvent
    ) => {
      if (!participantEvents) {
        return null
      }
      console.log(participantEvents, 'pevents')
      const matchingParticipantEvent = participantEvents.find(
        pEvt => pEvt.eventId === currentEvent.identifier
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
          <FormGroup className={classes.addForm}>
            <>
              {customStudyEvents.map(evt => (
                <DatePicker
                  key={evt.identifier}
                  label={ParticipantService.formatCustomEventIdForDisplay(
                    evt.identifier
                  )}
                  id={evt.identifier}
                  value={getEventDateValue(customParticipantEvents, evt)}
                  onChange={e =>
                    handleEventDateChange(evt.identifier, e)
                  }></DatePicker>
              ))}
            </>

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
                onClick={() => onOK(note, customParticipantEvents)}
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

export const WithdrawParticipantForm: FunctionComponent<{
  isEnrolledById: boolean
  participant: EditableParticipantData
  onOK: Function
  onCancel: Function
}> = ({isEnrolledById, participant, onOK, onCancel}) => {
  const classes = useStyles()
  const [note, setNote] = React.useState('')
  return (
    <>
      <DialogContent>
        <Box className={classes.withdrawalNotice}>
          <p>
            Withdrawing means you will no longer collect data on this
            participant and will not be able to contact them through the app.
          </p>
          <p>
            Are you sure you would like to withdraw the following participant:
          </p>
          <p>
            {isEnrolledById ? participant.externalId : participant.phoneNumber}
          </p>
          <p>
            <strong>This action cannot be undone.</strong>
          </p>
        </Box>
        <FormGroup>
          <FormControl>
            <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
            <SimpleTextInput
              fullWidth
              rowsMax={5}
              inputProps={{maxLength: 256}}
              placeholder="note"
              onChange={e => setNote(e.target.value)}
              id="note"
              multiline={true}
              rows={5}
            />
          </FormControl>
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <DialogButtonSecondary onClick={() => onCancel()} color="primary">
          Cancel
        </DialogButtonSecondary>
        <DialogButtonPrimary
          onClick={() => onOK(note)}
          color="primary"
          autoFocus>
          Yes, withdraw participant
        </DialogButtonPrimary>
      </DialogActions>
    </>
  )
}

export const AddParticipantForm: FunctionComponent<AddParticipantFormProps> = ({
  participant,
  isEnrolledById,
  customStudyEvents,
  onChange,
}) => {
  const classes = useStyles()
  const [validationErrors, setValidationErrors] = React.useState({
    phone: false,
    externalId: false,
  })

  const handleEventDateChange = (eventId: string, newDate: Date | null) => {
    const newEvent: ParticipantEvent = {
      eventId: eventId,
      timestamp: newDate || undefined,
    }
    let events = participant.events ? [...participant.events] : []
    const participantEventIndex = events.findIndex(e => e.eventId === eventId)

    if (participantEventIndex > -1) {
      events[participantEventIndex] = newEvent
    } else {
      events.push(newEvent)
    }

    onChange({...participant, events: events})
  }

  const extId = (
    <FormControl>
      <SimpleTextLabel htmlFor="participant-id">
        {`${isEnrolledById ? 'Participant ID*' : 'Reference ID'}`}
      </SimpleTextLabel>
      <SimpleTextInput
        id="participant-id"
        fullWidth={true}
        value={participant.externalId}
        inputProps={{
          maskType: 'ID',
          placeholder: 'xxx-xxx',
          onAccept: (v: string) => {
            onChange({
              ...participant,
              externalId: v,
            })
          },
        }}
        inputComponent={TextMask as any}
      />
    </FormControl>
  )

  return (
    <>
      <FormGroup className={classes.addForm}>
        {isEnrolledById && extId}
        {!isEnrolledById && (
          <>
            <FormControl className={clsx(validationErrors.phone && 'error')}>
              <SimpleTextLabel htmlFor="phone">Phone Number*</SimpleTextLabel>
              <SimpleTextInput
                placeholder="xxx-xxx-xxxx"
                id="phone"
                fullWidth={true}
                value={participant.phoneNumber || ''}
                inputProps={{
                  maskType: 'PHONE',
                  placeholder: '(xxx)xxx-xxx',
                  onAccept: (v: string) => {
                    onChange({...participant, phoneNumber: v})
                  },
                }}
                inputComponent={TextMask as any}
                onBlur={() =>
                  setValidationErrors(prev => ({
                    ...prev,
                    phone: Utility.isInvalidPhone(
                      participant.phoneNumber || ''
                    ),
                  }))
                }
              />
              {validationErrors.phone && (
                <FormHelperText id="phone-text">
                  phone should be in the format: (xxx)xxx-xxxx
                </FormHelperText>
              )}
            </FormControl>
            {extId}
          </>
        )}
        <>
          {customStudyEvents.map(evt => (
            <DatePicker
              key={evt.identifier}
              label={ParticipantService.formatCustomEventIdForDisplay(
                evt.identifier
              )}
              id={evt.identifier}
              value={
                participant.events?.find(
                  pEvt => pEvt.eventId === evt.identifier
                )?.timestamp || null
              }
              onChange={e =>
                handleEventDateChange(evt.identifier, e)
              }></DatePicker>
          ))}
        </>

        <FormControl>
          <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
          <SimpleTextInput
            value={participant.note}
            onChange={e => onChange({...participant, note: e.target.value})}
            placeholder="comments"
            id="note"
            multiline={true}
            rows={5}
          />
        </FormControl>
      </FormGroup>
    </>
  )
}
