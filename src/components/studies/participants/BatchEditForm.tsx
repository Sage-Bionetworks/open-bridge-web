import React from 'react'
import { Dialog } from '@material-ui/core'
import { EditParticipantForm } from './ParticipantForms'
import { EditDialogTitle } from './ParticipantTableGrid'
import ParticipantService from '../../../services/participants.service'

type BatchEditFormProps = {
  isEnrolledById: boolean
  isBatchEditOpen: boolean
  setIsBatchEditOpen: Function
  selectedParticipants: string[]
  token: string
  studyId: string
  toggleParticipantRefresh: Function
  isAllSelected: boolean
}

const BatchEditForm: React.FunctionComponent<BatchEditFormProps> = ({
  isEnrolledById,
  isBatchEditOpen,
  setIsBatchEditOpen,
  selectedParticipants,
  token,
  studyId,
  toggleParticipantRefresh,
  isAllSelected,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)

  return (
    <Dialog
      open={isBatchEditOpen}
      maxWidth="sm"
      fullWidth
      aria-labelledby="edit participant"
    >
      <EditDialogTitle
        onCancel={() => {
          setIsBatchEditOpen(false)
        }}
        shouldWithdraw={false}
        batchEdit
      />
      <EditParticipantForm
        isEnrolledById={isEnrolledById}
        onCancel={() => {
          setIsBatchEditOpen(false)
        }}
        onOK={async (note: string, cvd?: Date) => {
          if (!note && !cvd) return
          setIsLoading(true)
          let participants = selectedParticipants
          if (isAllSelected) {
            const resultEnrolled = await ParticipantService.getAllParticipantsInEnrollmentType(
              studyId,
              token,
              'enrolled',
              false,
            )
            const enrolledNonTestParticipants = resultEnrolled.items
            participants = enrolledNonTestParticipants.map(
              el => el.participant.identifier,
            )
          }
          for (const selectedParticipantId of participants) {
            if (note) {
              await ParticipantService.updateParticipantNote(
                studyId,
                token,
                selectedParticipantId,
                note,
              )
            }
            if (cvd) {
              await ParticipantService.updateParticipantClinicVisit(
                studyId,
                token,
                selectedParticipantId,
                cvd,
              )
            }
          }
          setIsBatchEditOpen(false)
          setIsLoading(false)
          toggleParticipantRefresh()
        }}
        participant={{}}
        isBatchEdit
        isLoading={isLoading}
      ></EditParticipantForm>
    </Dialog>
  )
}

export default BatchEditForm
