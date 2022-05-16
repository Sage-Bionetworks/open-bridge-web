// pick a date util library

import { BlueButton } from '@components/widgets/StyledComponents';
import Utility from '@helpers/utility';
import { Box, CircularProgress } from '@mui/material';
import Alert from '@mui/material/Alert';
import makeStyles from '@mui/styles/makeStyles';
import { useAddParticipant } from '@services/participantHooks';
import ParticipantService from '@services/participants.service';
import { ExtendedScheduleEventObject } from '@services/schedule.service';
import { EditableParticipantData, Phone } from '@typedefs/types';
import React, { FunctionComponent } from 'react';
import AddSingleParticipantForm from './AddSingleParticipantForm';

const useStyles = makeStyles(theme => ({
  root: {},
}))

type AddSingleParticipantProps = {
  token: string
  isEnrolledById: boolean
  scheduleEvents: ExtendedScheduleEventObject[]
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
  await ParticipantService.addParticipant(studyIdentifier, token, {
    ...options,
    phone,
  })
}

// -----------------  Add participant  tab control
const AddSingleParticipant: FunctionComponent<AddSingleParticipantProps> = ({
  onAdded,
  isEnrolledById,
  scheduleEvents,
  token,
  studyIdentifier,
}) => {
  const classes = useStyles()
  const [participant, setParticipant] = React.useState<EditableParticipantData>(
    {
      externalId: '',
    }
  )
  const [error, setError] = React.useState<Error>()
  const {
    isLoading,
    error: participantAddError,
    mutateAsync,
  } = useAddParticipant()

  React.useEffect(() => {
    if (participantAddError) setError(participantAddError as Error)
  }, [participantAddError])

  const onAddParticipant = async (participant: EditableParticipantData) => {
    let options: EditableParticipantData = {
      externalId: participant.externalId,
      events: participant.events,
      clientTimeZone: participant.clientTimeZone,
      note: participant.note,
    }
    isEnrolledById
      ? mutateAsync({ studyId: studyIdentifier, options })
      : mutateAsync({
        studyId: studyIdentifier,
        options,
        phone: Utility.makePhone(participant.phoneNumber || ''),
      })
    setParticipant({ externalId: '' })
  }

  const isAddDisabled = (): boolean => {
    const enrolledByPhoneWithoutNumber = !isEnrolledById &&
      (!participant.phoneNumber ||
        Utility.isInvalidPhone(participant.phoneNumber))
    const enrolledNyIdWithoutId = isEnrolledById && !participant.externalId
    const noTimeZoneForStudiesWithCustomEvents = (scheduleEvents.find(e => e.eventId.includes('custom')) !==
      undefined) && (participant.clientTimeZone || '').length < 3


    return enrolledByPhoneWithoutNumber || enrolledNyIdWithoutId || noTimeZoneForStudiesWithCustomEvents
  }

  return (
    <>
      <Box mx="auto" textAlign="center" mb={2}>
        {isLoading && <CircularProgress size="2em" />}
        {error && (
          <Alert color="error" onClose={() => setError(undefined)}>
            {error.message}
          </Alert>
        )}
      </Box>
      <AddSingleParticipantForm
        scheduleEvents={scheduleEvents}
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
          onClick={() => onAddParticipant(participant)}>
          + Add to study
        </BlueButton>
      </Box>
    </>
  )
}

export default AddSingleParticipant
