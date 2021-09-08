import DatePicker from '@components/widgets/DatePicker'
import TextMask from '@components/widgets/MaskedInput'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {FormHelperText, makeStyles} from '@material-ui/core'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import EventService from '@services/event.service'
import {SchedulingEvent} from '@typedefs/scheduling'
import {EditableParticipantData, ParticipantEvent} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

type AddSingleParticipantFormProps = {
  participant: EditableParticipantData
  customStudyEvents: SchedulingEvent[]
  isEnrolledById: boolean

  onChange: (p: EditableParticipantData) => void
}

const AddSingleParticipantForm: FunctionComponent<AddSingleParticipantFormProps> =
  ({participant, isEnrolledById, customStudyEvents, onChange}) => {
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
                key={evt.eventId}
                label={EventService.formatCustomEventIdForDisplay(evt.eventId)}
                id={evt.eventId}
                value={
                  participant.events?.find(pEvt => pEvt.eventId === evt.eventId)
                    ?.timestamp || null
                }
                onChange={e =>
                  handleEventDateChange(evt.eventId, e)
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

export default AddSingleParticipantForm
