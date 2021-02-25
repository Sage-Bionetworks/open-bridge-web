// pick a date util library

import {
  Box,
  CircularProgress,
  FormControl,
  FormGroup,
  FormHelperText
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import { isInvalidPhone, makePhone } from '../../../helpers/utility'
import ParticipantService, {
  AddParticipantType
} from '../../../services/participants.service'
import { Phone } from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import {
  BlueButton,
  SimpleTextInput,
  SimpleTextLabel
} from '../../widgets/StyledComponents'

const useStyles = makeStyles(theme => ({
  root: {},
  addForm: {
    '& .MuiFormControl-root:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}))

type AddSingleParticipantProps = {
  token: string

  enrollmentType: 'PHONE' | 'ID'
  onAdded: Function
  studyIdentifier: string
}

export async function addParticipantById(
  studyIdentifier: string,
  token: string,
  options: AddParticipantType,
) {
  await ParticipantService.addParticipant(studyIdentifier, token, options)
}

export async function addParticipantByPhone(
  studyIdentifier: string,
  token: string,
  phone: Phone,
  options: AddParticipantType,
) {
  /*if (!externalId) {
    const studyPrefix = studyIdentifier.substr(0, 3)
    externalId = `${generateNonambiguousCode(6)}-${studyPrefix}`
  }*/

  await ParticipantService.addParticipant(studyIdentifier, token, {
    ...options,
    phone,
  })
}

// -----------------  Add participant  tab control
const AddSingleParticipant: FunctionComponent<AddSingleParticipantProps> = ({
  onAdded,
  enrollmentType,

  token,
  studyIdentifier,
}) => {
  const classes = useStyles()
  const [participant, setParticipant] = React.useState<AddParticipantType>({
    externalId: '',
  })
  const [phoneNumber, setPhoneNumber] = React.useState('')

  const [validationErrors, setValidationErrors] = React.useState({
    phone: false,
    externalId: false,
  })
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const addSingleParticipant = async (
    participant: AddParticipantType,
    phoneNumber?: string,
  ) => {
    setError('')
    setIsLoading(true)
    let options: AddParticipantType = {
      externalId: participant.externalId,
      clinicVisitDate: participant.clinicVisitDate,
      notes: participant.notes,
    }

    try {
      if (enrollmentType === 'PHONE') {
        await addParticipantByPhone(
          studyIdentifier,
          token,
          makePhone(phoneNumber || ''),
          options,
        )
      } else {
        await addParticipantById(studyIdentifier, token, options)
      }

      onAdded()
      setParticipant({ externalId: '' })
      setPhoneNumber('')
    } catch (e: any) {
      setError(e?.message.toString() || e.toString())
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateChange = (date: Date | null) => {
    setParticipant(prev => ({ ...prev, clinicVisitDate: date || undefined }))
  }

  const isAddDisabled = (): boolean => {
    return (
      (enrollmentType === 'PHONE' &&
        (!phoneNumber || isInvalidPhone(phoneNumber))) ||
      (enrollmentType === 'ID' && !participant.externalId)
    )
  }

  const extId = (
    <FormControl>
      <SimpleTextLabel htmlFor="participant-id">
        {`Participant ID${enrollmentType === 'ID' ? '*' : ''}`}
      </SimpleTextLabel>
      <SimpleTextInput
        placeholder="xxx-xxx-xxxx"
        id="participant-id"
        fullWidth={true}
        value={participant.externalId}
        onChange={e =>
          setParticipant(prev => ({ ...prev, externalId: e.target.value }))
        }
      />
    </FormControl>
  )

  return (
    <>
      <Box mx="auto" textAlign="center" mb={2}>
        {isLoading && <CircularProgress size="2em" />}
        {error && <Alert color="error">{error}</Alert>}
      </Box>
      <FormGroup className={classes.addForm}>
        {enrollmentType === 'ID' && extId}
        {enrollmentType === 'PHONE' && (
          <>
            <FormControl className={clsx(validationErrors.phone && 'error')}>
              <SimpleTextLabel htmlFor="phone">Phone Number*</SimpleTextLabel>
              <SimpleTextInput
                placeholder="xxx-xxx-xxxx"
                id="phone"
                fullWidth={true}
                value={phoneNumber}
                onBlur={() =>
                  setValidationErrors(prev => ({
                    ...prev,
                    phone: isInvalidPhone(phoneNumber),
                  }))
                }
                onChange={e => setPhoneNumber(e.target.value)}
              />
              {validationErrors.phone && (
                <FormHelperText id="phone-text">
                  phone should be in the format: xxx-xxx-xxxx
                </FormHelperText>
              )}
            </FormControl>
            {extId}
          </>
        )}
        <DatePicker
          label="Clinic Visit 1"
          id="clinic-visit"
          value={participant.clinicVisitDate || null}
          onChange={e => handleDateChange(e)}
        ></DatePicker>

        <FormControl>
          <SimpleTextLabel htmlFor="notes">Notes</SimpleTextLabel>
          <SimpleTextInput
            value={participant.notes}
            onChange={e =>
              setParticipant(prev => ({ ...prev, notes: e.target.value }))
            }
            placeholder="comments"
            id="notes"
            multiline={true}
            rows={5}
          />
        </FormControl>
      </FormGroup>

      <Box textAlign="center" my={2}>
        <BlueButton
          color="primary"
          variant="contained"
          disabled={isAddDisabled()}
          onClick={() => addSingleParticipant(participant, phoneNumber)}
        >
          +Add to study
        </BlueButton>
      </Box>
    </>
  )
}

export default AddSingleParticipant
