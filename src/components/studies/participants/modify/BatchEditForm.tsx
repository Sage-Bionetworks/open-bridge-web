import EditDialogTitle from '@components/studies/participants/modify/EditDialogTitle'
import {Dialog} from '@mui/material'
import {useEvents} from '@services/eventHooks'
import {useUpdateParticipantInList} from '@services/participantHooks'
import React from 'react'
import EditParticipantForm from './EditParticipantForm'

type BatchEditFormProps = {
  isEnrolledById: boolean
  isBatchEditOpen: boolean
  onSetIsBatchEditOpen: Function
  selectedParticipants: string[]
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
  const [error, setError] = React.useState<Error>()

  const {mutateAsync, error: batchUpdateError} = useUpdateParticipantInList()

  React.useEffect(() => {
    if (batchUpdateError) setError(batchUpdateError as Error)
  }, [batchUpdateError])

  const updateParticipant = async (clientTimeZone?: string) => {
    mutateAsync(
      {
        studyId,
        action: 'UPDATE',
        userId: selectedParticipants,
        updatedFields: {clientTimeZone: clientTimeZone},
        isAllSelected: false, // AG there is currently no way to distinguish between truly 'all'or 'all on the page
      },
      {
        onSuccess: onSetIsBatchEditOpen(false),
      }
    )
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
          setError(undefined)
        }}
        shouldWithdraw={false}
        batchEdit
      />
      {isAllSelected ? 'true' : 'false'}
      <EditParticipantForm
        scheduleEvents={scheduleEvents}
        isEnrolledById={isEnrolledById}
        onCancel={() => {
          onSetIsBatchEditOpen(false)
        }}
        onOK={(clientTimeZone?: string) => updateParticipant(clientTimeZone)}
        participant={{}}
        isBatchEdit
        onError={error}
        isLoading={isLoading}></EditParticipantForm>
    </Dialog>
  )
}

export default BatchEditForm
