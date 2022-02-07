import {useEvents} from '@components/studies/eventHooks'
import { useUpdateParticipantInList } from '@components/studies/participantHooks'
import EditDialogTitle from '@components/studies/participants/modify/EditDialogTitle'
import {Dialog} from '@material-ui/core'
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
  studyId,
  isAllSelected,
}) => {
  const [isLoading, setIsLoading] = React.useState(false)
  const {data: scheduleEvents = [], error: eventError} = useEvents(studyId)

  const {mutateAsync} = useUpdateParticipantInList()

  const updateParticipant = async(clientTimeZone?: string)=> {
    mutateAsync({
      studyId,
      action:"UPDATE",
      userId:selectedParticipants,
      updatedFields:{clientTimeZone:clientTimeZone},
      isAllSelected})
    onSetIsBatchEditOpen(false)
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
        onOK={(clientTimeZone?: string) => updateParticipant(clientTimeZone)
        }
        participant={{}}
        isBatchEdit
        isLoading={isLoading}></EditParticipantForm>
    </Dialog>
  )
}

export default BatchEditForm
