import React from 'react'
import { Dialog } from '@material-ui/core'
import { EditParticipantForm } from './ParticipantForms'
import { EditDialogTitle } from './ParticipantTableGrid'
import ParticipantService from '../../../services/participants.service'

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

  const updateParticipants = async (note: string, cvd?: Date) => {
    if (!note && !cvd) return
    setIsLoading(true)
    let participantIds = selectedParticipants
    if (isAllSelected) {
      const resultEnrolled = await ParticipantService.getAllParticipantsInEnrollmentType(
        studyId,
        token,
        'enrolled',
        false,
      )
      const enrolledNonTestParticipants = resultEnrolled.items
      participantIds = enrolledNonTestParticipants.map(
        el => el.participant.identifier,
      )
    }
    if (note) {
      const promises = participantIds.map(async selectedParticipantId => {
        return await ParticipantService.updateParticipantNote(
          studyId,
          token,
          selectedParticipantId,
          note,
        )
      })
      await Promise.all(promises)
    }
    if (cvd) {
      const promises = participantIds.map(async selectedParticipantId => {
        return await ParticipantService.updateParticipantClinicVisit(
          studyId,
          token,
          selectedParticipantId,
          cvd,
        )
      })
      await Promise.all(promises)
    }
    onSetIsBatchEditOpen(false)
    setIsLoading(false)
    onToggleParticipantRefresh()
  }

  return (
    <Dialog
      open={isBatchEditOpen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="edit participant"
    >
      <EditDialogTitle
        onCancel={() => {
          onSetIsBatchEditOpen(false)
        }}
        shouldWithdraw={false}
        batchEdit
      />
      <EditParticipantForm
        isEnrolledById={isEnrolledById}
        onCancel={() => {
          onSetIsBatchEditOpen(false)
        }}
        onOK={(note: string, cvd?: Date) => updateParticipants(note, cvd)}
        participant={{}}
        isBatchEdit
        isLoading={isLoading}
      ></EditParticipantForm>
    </Dialog>
  )
}

export default BatchEditForm
