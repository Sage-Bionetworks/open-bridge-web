import {useEvents} from '@components/studies/eventHooks'
import EditDialogTitle from '@components/studies/participants/modify/EditDialogTitle'
import {Dialog} from '@material-ui/core'
import ParticipantService from '@services/participants.service'
import React from 'react'
import EditParticipantForm from './EditParticipantForm'

type BatchEditFormProps = {
  isEnrolledById: boolean
  isBatchEditOpen: boolean
  onSetIsBatchEditOpen: Function
  selectedParticipants: string[]
  token: string
  studyId: string
  onToggleParticipantRefresh: Function
  isAllSelected: boolean
}

const BatchEditForm: React.FunctionComponent<BatchEditFormProps> = ({
  isEnrolledById,
  isBatchEditOpen,
  onSetIsBatchEditOpen,
  selectedParticipants,
  token,
  studyId,
  onToggleParticipantRefresh,
  isAllSelected,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const {data: scheduleEvents = [], error: eventError} = useEvents(studyId)

  const updateParticipants = async (clientTimeZone?: string) => {
    if (!clientTimeZone) return
    setIsLoading(true)
    let participantIds = selectedParticipants
    if (isAllSelected) {
      const resultEnrolled =
        await ParticipantService.getEnrollmentByEnrollmentType(
          studyId,
          token,
          'enrolled',
          false
        )
      const enrolledNonTestParticipants = resultEnrolled.items
      participantIds = enrolledNonTestParticipants.map(
        el => el.participant.identifier
      )
    }
    const promises = participantIds.map(async selectedParticipantID => {
      return ParticipantService.updateParticipant(
        studyId,
        token,
        selectedParticipantID,
        {clientTimeZone: clientTimeZone}
      )
    })
    await Promise.all(promises)
    onSetIsBatchEditOpen(false)
    setIsLoading(false)
    onToggleParticipantRefresh()
  }

  return (
    <Dialog
      open={isBatchEditOpen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="edit participant">
      <EditDialogTitle
        onCancel={() => {
          onSetIsBatchEditOpen(false)
        }}
        shouldWithdraw={false}
        batchEdit
      />
      <EditParticipantForm
        scheduleEvents={scheduleEvents}
        isEnrolledById={isEnrolledById}
        onCancel={() => {
          onSetIsBatchEditOpen(false)
        }}
        onOK={(clientTimeZone?: string) => updateParticipants(clientTimeZone)}
        participant={{}}
        isBatchEdit
        isLoading={isLoading}></EditParticipantForm>
    </Dialog>
  )
}

export default BatchEditForm
