import {ReactComponent as PinkSendSMSIcon} from '@assets/participants/send_sms_link_pink_icon.svg'
import {ReactComponent as DeleteIcon} from '@assets/trash.svg'
import {useStudy} from '@components/studies/studyHooks'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
} from '@components/widgets/StyledComponents'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Dialog, DialogActions, DialogContent} from '@mui/material'
import Alert from '@mui/material/Alert'
import {
  ParticipantAccountSummary,
  ParticipantActivityType,
} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {
  useInvalidateParticipants,
  useParticipants,
  useUpdateParticipantInList,
} from '../participantHooks'
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

const ParticipantDeleteModal: FunctionComponent<ParticipantDeleteModalProps> =
  ({
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

    const {data} = useParticipants(
      study?.identifier,
      currentPage,
      pageSize,
      tab
    )
    const {
      mutateAsync,
      error: deleteParticipantError,
      isSuccess,
    } = useUpdateParticipantInList()
    const invalidateParticipants = useInvalidateParticipants()
    const [error, setError] = React.useState<Error>()
    React.useEffect(() => {
      if (deleteParticipantError) setError(deleteParticipantError as Error)
    }, [deleteParticipantError])
    const onAction = async (studyId: string) => {
      onLoadingIndicatorsChange(true)
      resetParticipantsWithError()

      try {
        await mutateAsync({
          action: 'DELETE',
          studyId,
          userId: selectedParticipantIds[tab!],
        })
        onLoadingIndicatorsChange(false)
        onClose({
          dialogOpenRemove: false,
          dialogOpenSMS: false,
        })

        return
      } catch (e) {
        alert(e)
      }
    }
    return (
      <Dialog
        open={dialogState.dialogOpenSMS || dialogState.dialogOpenRemove}
        maxWidth="xs"
        scroll="body"
        aria-labelledby="Remove Participant">
        <DialogTitleWithClose
          onCancel={() => {
            onClose({
              dialogOpenRemove: false,
              dialogOpenSMS: false,
            })
            setError(undefined)
          }}
          icon={
            dialogState.dialogOpenRemove ? <DeleteIcon /> : <PinkSendSMSIcon />
          }
          title={
            dialogState.dialogOpenRemove
              ? 'Remove From Study'
              : dialogState.dialogOpenSMS
              ? 'Sending SMS Download Link'
              : ''
          }
        />
        {error && (
          <Alert color="error" onClose={() => setError(undefined)}>
            {error.message}
          </Alert>
        )}
        <DialogContent style={{display: 'flex', justifyContent: 'center'}}>
          {(dialogState.dialogOpenSMS || dialogState.dialogOpenRemove) && (
            <DialogContents
              participantsWithError={participantsWithError}
              study={study!}
              selectedParticipants={
                data?.items?.filter(participant =>
                  selectedParticipantIds[tab].includes(participant.id)
                ) || []
              }
              isProcessing={!!loadingIndicators.isDeleting}
              isRemove={
                dialogState.dialogOpenSMS || dialogState.dialogOpenRemove
              }
              selectingAll={isAllSelected}
              tab={tab}
              token={token!}
            />
          )}
        </DialogContent>

        {participantsWithError.length === 0 && (
          <DialogActions>
            <DialogButtonSecondary
              onClick={() => {
                onClose({
                  dialogOpenRemove: false,
                  dialogOpenSMS: false,
                })
                setError(undefined)
              }}
              style={{height: '48px'}}>
              Cancel
            </DialogButtonSecondary>

            <DialogButtonPrimary
              onClick={() => onAction(study!.identifier)}
              autoFocus
              className={classes.primaryDialogButton}>
              {dialogState.dialogOpenRemove
                ? 'Permanently Remove'
                : 'Yes, send SMS'}
            </DialogButtonPrimary>
          </DialogActions>
        )}

        {participantsWithError.length > 0 && (
          <DialogActions>
            <DialogButtonPrimary
              onClick={() => {
                invalidateParticipants()
                onClose({
                  dialogOpenRemove: false,
                  dialogOpenSMS: false,
                })
              }}
              color="primary">
              Done
            </DialogButtonPrimary>
          </DialogActions>
        )}
      </Dialog>
    )
  }

export default ParticipantDeleteModal
