// pick a date util library

import {Box, CircularProgress} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import React, {FunctionComponent} from 'react'
import {isInvalidPhone, makePhone} from '../../../helpers/utility'
import ParticipantService from '../../../services/participants.service'
import {EditableParticipantData, Phone} from '../../../types/types'
import {BlueButton} from '../../widgets/StyledComponents'
import {AddParticipantForm} from './ParticipantForms'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type AddSingleParticipantProps = {
  token: string
  isEnrolledById: boolean
  onAdded: Function
  studyIdentifier: string
}

export async function addParticipantById(
  studyIdentifier: string,
  token: string,
  options: EditableParticipantData
) {
  await ParticipantService.addParticipant(studyIdentifier, token, options)
}

export async function addParticipantByPhone(
  studyIdentifier: string,
  token: string,
  phone: Phone,
  options: EditableParticipantData
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
  isEnrolledById,

  token,
  studyIdentifier,
}) => {
  const classes = useStyles()
  const [participant, setParticipant] = React.useState<EditableParticipantData>(
    {
      externalId: '',
    }
  )
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)

  const addSingleParticipant = async (participant: EditableParticipantData) => {
    setError('')
    setIsLoading(true)
    let options: EditableParticipantData = {
      externalId: participant.externalId,
      clinicVisitDate: participant.clinicVisitDate,
      note: participant.note,
    }

    try {
      if (!isEnrolledById) {
        await addParticipantByPhone(
          studyIdentifier,
          token,
          makePhone(participant.phoneNumber || ''),
          options
        )
      } else {
        await addParticipantById(studyIdentifier, token, options)
      }

      onAdded()
      setParticipant({externalId: ''})
    } catch (e) {
      setError(e?.message.toString() || e.toString())
    } finally {
      setIsLoading(false)
    }
  }

  const isAddDisabled = (): boolean => {
    return (
      (!isEnrolledById &&
        (!participant.phoneNumber ||
          isInvalidPhone(participant.phoneNumber))) ||
      (isEnrolledById && !participant.externalId)
    )
  }

  return (
    <>
      <Box mx="auto" textAlign="center" mb={2}>
        {isLoading && <CircularProgress size="2em" />}
        {error && <Alert color="error">{error}</Alert>}
      </Box>
      <AddParticipantForm
        isEnrolledById={isEnrolledById}
        participant={participant}
        onChange={participant => {
          if (participant) {
            setParticipant(_prev => participant)
          }
        }}
      />

      <Box textAlign="center" my={2}>
        <BlueButton
          color="primary"
          variant="contained"
          disabled={isAddDisabled()}
          onClick={() => addSingleParticipant(participant)}>
          +Add to study
        </BlueButton>
      </Box>
    </>
  )
}

export default AddSingleParticipant
