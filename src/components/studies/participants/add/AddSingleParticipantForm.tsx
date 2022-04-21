import TextMask from '@components/widgets/MaskedInput'
import {
  SimpleTextInput,
  SimpleTextLabel,
} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {FormHelperText} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import makeStyles from '@mui/styles/makeStyles'
import {ExtendedScheduleEventObject} from '@services/schedule.service'
import {EditableParticipantData} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import EditParticipantEventsForm from '../modify/EditParticipantEventsForm'
import TimezoneDropdown from '../TimezoneDropdown'

const useStyles = makeStyles(theme => ({
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

type AddSingleParticipantFormProps = {
  participant: EditableParticipantData
  scheduleEvents: ExtendedScheduleEventObject[]
  isEnrolledById: boolean

  onChange: (p: EditableParticipantData) => void
}

const AddSingleParticipantForm: FunctionComponent<AddSingleParticipantFormProps> =
  ({participant, isEnrolledById, scheduleEvents, onChange}) => {
    const classes = useStyles()
    const [validationErrors, setValidationErrors] = React.useState({
      phone: false,
      externalId: false,
    })

    const extId = (
      <FormControl>
        <SimpleTextLabel htmlFor="participant-id">
          {`${isEnrolledById ? 'Participant ID*' : 'Reference ID'}`}
        </SimpleTextLabel>
        <SimpleTextInput
          id="participant-id"
          fullWidth={true}
          value={participant.externalId}
          onChange={e =>
            onChange({
              ...participant,
              externalId: e.target.value,
            })
          }
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
          <FormControl>
            <TimezoneDropdown
              isRequired={
                scheduleEvents.find(e => e.eventId.includes('custom')) !==
                undefined
              }
              currentValue={participant.clientTimeZone || '-'}
              onValueChange={(clientTimeZone: string) =>
                onChange({...participant, clientTimeZone})
              }
            />
          </FormControl>
          <EditParticipantEventsForm
            customParticipantEvents={participant.events || []}
            hideLoginEvent={true}
            scheduleEvents={scheduleEvents}
            onChange={events => {
              onChange({...participant, events: events})
            }}
          />
          <FormControl>
            <SimpleTextLabel htmlFor="note">Notes</SimpleTextLabel>
            <SimpleTextInput
              value={participant.note || ''}
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
