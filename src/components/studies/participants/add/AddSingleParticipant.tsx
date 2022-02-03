// pick a date util library

import {useAddParticipant} from '@components/studies/participantHooks'
import {BlueButton} from '@components/widgets/StyledComponents'
import Utility from '@helpers/utility'
import {Box, CircularProgress} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Alert from '@material-ui/lab/Alert'
import {ExtendedScheduleEventObject} from '@services/schedule.service'
import {EditableParticipantData, ExtendedError, Phone} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import AddSingleParticipantForm from './AddSingleParticipantForm'

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
  const [error, setError] = React.useState('')

  const {isLoading, mutateAsync} = useAddParticipant()
  const onAddParticipant = async(participant: EditableParticipantData) => {
    let options: EditableParticipantData = {
      externalId: participant.externalId,
      events: participant.events,
      clientTimeZone: participant.clientTimeZone,
      note: participant.note,
    }
    isEnrolledById 
    ? mutateAsync({studyId:studyIdentifier,options}) 
    : mutateAsync({studyId:studyIdentifier,options,phone:Utility.makePhone(participant.phoneNumber || '')}) 
    setParticipant({externalId: ''})
  }

  const isAddDisabled = (): boolean => {
    return (
      (!isEnrolledById &&
        (!participant.phoneNumber ||
          Utility.isInvalidPhone(participant.phoneNumber))) ||
      (isEnrolledById && !participant.externalId)
    )
  }

  return (
    <>
      <Box mx="auto" textAlign="center" mb={2}>
        {isLoading && <CircularProgress size="2em" />}
        {error && <Alert color="error">{error}</Alert>}
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

          +Add to study
        </BlueButton>
      </Box>
    </>
  )
}

export default AddSingleParticipant
