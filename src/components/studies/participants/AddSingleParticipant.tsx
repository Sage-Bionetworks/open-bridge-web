// pick a date util library

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormGroup,
  FormHelperText
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import clsx from 'clsx'
import React, { FunctionComponent } from 'react'
import {
  generateNonambiguousCode,
  isInvalidPhone,
  makePhone
} from '../../../helpers/utility'
import ParticipantService from '../../../services/participants.service'
import { Phone } from '../../../types/types'
import DatePicker from '../../widgets/DatePicker'
import {
  SimpleTextInput,
  SimpleTextLabel
} from '../../widgets/StyledComponents'

interface AddParticipantType {
  clinicVisitDate?: Date
  notes?: string
  referenceId: string
  phone?: Phone
}

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

async function addParticipantById(
  studyIdentifier: string,
  token: string,
  referenceId: string,
) {
  const add = await ParticipantService.addParticipant(studyIdentifier, token, {
    externalId: referenceId,
    dataGroups: ['test_user'],
  })
}

async function addParticipantByPhone(
  studyIdentifier: string,
  token: string,
  phone: Phone,
  referenceId?: string,
) {
  if (!referenceId) {
    const studyPrefix = studyIdentifier.substr(0, 3)
    referenceId = `${generateNonambiguousCode(6)}-${studyPrefix}`
  }

  const add = await ParticipantService.addParticipant(studyIdentifier, token, {
    externalId: referenceId,
    dataGroups: ['test_user'],
    phone: phone,
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
    referenceId: '',
  })
  const [phoneNumber, setPhoneNumber] = React.useState('')

  const [validationErrors, setValidationErrors] = React.useState({
    phone: false,
    referenceId: false,
  })
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const addSingleParticipant = async (
    participant: AddParticipantType,
    phoneNumber?: string,
  ) => {
    setError('')
    setIsLoading(true)

    try {
      if (enrollmentType === 'PHONE') {
        await addParticipantByPhone(
          studyIdentifier,
          token,
          makePhone(phoneNumber || ''),
          participant.referenceId,
        )
      } else {
        await addParticipantById(
          studyIdentifier,
          token,
          participant.referenceId,
        )
      }

      onAdded()
      setParticipant({ referenceId: '' })
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
      (enrollmentType === 'ID' && !participant.referenceId)
    )
  }

  return (
    <>
      <Box mx="auto" textAlign="center" mb={2}>
        {isLoading && <CircularProgress size="2em" />}
        {error && <Alert color="error">{error}</Alert>}
      </Box>
      <FormGroup className={classes.addForm}>
        <FormControl>
          <SimpleTextLabel htmlFor="participant-id">
            Participant ID*
          </SimpleTextLabel>
          <SimpleTextInput
            placeholder="xxx-xxx-xxxx"
            id="participant-id"
            fullWidth={true}
            value={participant.referenceId}
            onChange={e =>
              setParticipant(prev => ({ ...prev, referenceId: e.target.value }))
            }
          />
        </FormControl>

        <FormControl className={clsx(validationErrors.phone && 'error')}>
          <SimpleTextLabel htmlFor="phone">Phone*</SimpleTextLabel>
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
        <Button
          color="primary"
          variant="contained"
          disabled={isAddDisabled()}
          onClick={() => addSingleParticipant(participant, phoneNumber)}
        >
          +Add to study
        </Button>
      </Box>
    </>
  )
}

export default AddSingleParticipant
