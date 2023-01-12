import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box} from '@mui/material'
import Alert from '@mui/material/Alert'
import {useStudy} from '@services/studyHooks'
import {ParticipantAccountSummary, ParticipantActivityType} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useParticipants, useUpdateParticipantInList} from '../../../services/participantHooks'
import DialogContents from './DialogContents'
import useStyles from './ParticipantManager_style'

type SelectedParticipantIdsType = {
  ACTIVE: string[]
  TEST: string[]
  WITHDRAWN: string[]
}

type ParticipantDeleteModalProps = {
  studyId: string
  dialogState: {
    dialogOpenRemove: boolean
    dialogOpenSMS: boolean
  }
  onClose: Function
  currentPage: number
  pageSize: number
  tab: ParticipantActivityType
  isAllSelected: boolean
  selectedParticipantIds: SelectedParticipantIdsType
  participantsWithError: ParticipantAccountSummary[]
  resetParticipantsWithError: () => void
  loadingIndicators: {
    isDeleting?: boolean | undefined
    isDownloading?: boolean | undefined
  }
  onLoadingIndicatorsChange: Function
}

const ParticipantDeleteModal: FunctionComponent<ParticipantDeleteModalProps> = ({
  studyId,
  dialogState,
  onClose,
  currentPage,
  pageSize,
  tab,
  isAllSelected,
  selectedParticipantIds,
  participantsWithError,
  resetParticipantsWithError,
  loadingIndicators,
  onLoadingIndicatorsChange,
}) => {
  const classes = useStyles()

  type SelectedParticipantIdsType = {
    ACTIVE: string[]
    TEST: string[]
    WITHDRAWN: string[]
  }

  const {token} = useUserSessionDataState()
  const {data: study} = useStudy(studyId)

  const {data} = useParticipants(study?.identifier, currentPage, pageSize, tab)
  const {mutate, error: deleteParticipantError, isSuccess} = useUpdateParticipantInList()

  const [error, setError] = React.useState<Error>()

  const getActionButtonText = (errorCount: number, isDelete: boolean) => {
    if (errorCount > 0) {
      return 'Done'
    }
    return isDelete ? 'Permanently Remove' : 'Yes, send SMS'
  }

  const cancelAction = () => {
    onClose({
      dialogOpenRemove: false,
      dialogOpenSMS: false,
    })
    setError(undefined)
  }

  React.useEffect(() => {
    if (deleteParticipantError) setError(deleteParticipantError as Error)
  }, [deleteParticipantError])
  const onAction = async (studyId: string) => {
    onLoadingIndicatorsChange(true)
    resetParticipantsWithError()

    mutate(
      {
        action: 'DELETE',
        studyId,
        userId: selectedParticipantIds[tab!],
      },
      {
        onSuccess: data => {
          onLoadingIndicatorsChange(false)
          onClose({
            dialogOpenRemove: false,
            dialogOpenSMS: false,
          })
        },
        onError: e => alert(e),
      }
    )
  }
  return (
    <ConfirmationDialog
      isOpen={dialogState.dialogOpenSMS || dialogState.dialogOpenRemove}
      width={750}
      title={
        dialogState.dialogOpenRemove
          ? 'Remove From Study'
          : dialogState.dialogOpenSMS
          ? 'Sending SMS Download Link'
          : ''
      }
      actionText={getActionButtonText(participantsWithError.length, dialogState.dialogOpenRemove)}
      type={'CUSTOM'}
      onCancel={cancelAction}
      hideCancel={participantsWithError.length > 0}
      onConfirm={() => (participantsWithError.length ? cancelAction() : onAction(study!.identifier))}>
      <>
        {error && (
          <Alert color="error" onClose={() => setError(undefined)}>
            {error.message}
          </Alert>
        )}
        <Box sx={{fontSize: '16px'}}>
          {(dialogState.dialogOpenSMS || dialogState.dialogOpenRemove) && (
            <DialogContents
              participantsWithError={participantsWithError}
              study={study!}
              selectedParticipants={
                data?.items?.filter(participant => selectedParticipantIds[tab].includes(participant.id)) || []
              }
              isProcessing={!!loadingIndicators.isDeleting}
              mode={dialogState.dialogOpenSMS ? 'SMS' : 'DELETE'}
              selectingAll={isAllSelected}
              tab={tab}
              token={token!}
            />
          )}
        </Box>
      </>
    </ConfirmationDialog>
  )
}

export default ParticipantDeleteModal
