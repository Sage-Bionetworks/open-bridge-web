import { FunctionComponent } from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
  } from '@material-ui/core'
import {ReactComponent as DeleteIcon} from '@assets/trash.svg'
import DialogTitleWithClose from '@components/widgets/DialogTitleWithClose'
import {
    DialogButtonPrimary,
    DialogButtonSecondary,
  } from '@components/widgets/StyledComponents'
import DialogContents from './DialogContents'
import {ReactComponent as PinkSendSMSIcon} from '@assets/participants/send_sms_link_pink_icon.svg'
import {useParticipants, useInvalidateParticipants, useUpdateParticipantInList} from '../participantHooks'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {useStudy} from '@components/studies/studyHooks'
import useStyles from './ParticipantManager_style'
import { ParticipantActivityType, ParticipantAccountSummary } from "@typedefs/types";

type SelectedParticipantIdsType = {
    ACTIVE: string[]
    TEST: string[]
    WITHDRAWN: string[]
  }

type ParticipantDeleteModalProps = {
    studyId: string
    dialogState: {
      dialogOpenRemove: boolean,
      dialogOpenSMS: boolean,
    }
    onClose: Function
    currentPage: number
    pageSize: number
    tab: ParticipantActivityType
    isAllSelected: boolean
    selectedParticipantIds: SelectedParticipantIdsType
    participantsWithError: ParticipantAccountSummary[]
    resetParticipantsWithError: () => void
    loadingIndicators:{
        isDeleting?: boolean | undefined,
        isDownloading?: boolean | undefined,
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
    onLoadingIndicatorsChange
}) => {
    const classes = useStyles()  

    type SelectedParticipantIdsType = {
        ACTIVE: string[]
        TEST: string[]
        WITHDRAWN: string[]
      }
 
    const {token} = useUserSessionDataState()
    const {
        data: study,
    } = useStudy(studyId)

    const {data} = useParticipants(study?.identifier, currentPage, pageSize, tab,)
    const {mutateAsync} = useUpdateParticipantInList()
    const invalidateParticipants = useInvalidateParticipants()
      
    const onAction = async (studyId:string,) => {
        onLoadingIndicatorsChange(true)
        resetParticipantsWithError()
        let isError = false
        mutateAsync({action:'DELETE', studyId,userId: selectedParticipantIds[tab!]})
        onLoadingIndicatorsChange(false)
        if(!isError) onClose({
            dialogOpenRemove: false,
            dialogOpenSMS: false,
        })
        return
    }

    return(
        <Dialog
        open={dialogState.dialogOpenSMS || dialogState.dialogOpenRemove}
        maxWidth="xs"
        scroll="body"
        aria-labelledby="Remove Participant">
        <DialogTitleWithClose
          onCancel={()=>onClose({
            dialogOpenRemove: false,
            dialogOpenSMS: false,
        })}
          icon={
            dialogState.dialogOpenRemove ? (
              <DeleteIcon />
            ) : (
              <PinkSendSMSIcon />
            )
          }
          title={
            dialogState.dialogOpenRemove
              ? 'Remove From Study'
              : 'Sending SMS Download Link'
          }
        />
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
              isRemove={dialogState.dialogOpenSMS || dialogState.dialogOpenRemove}
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
                }}
              style={{height: '48px'}}>
              Cancel
            </DialogButtonSecondary>

            <DialogButtonPrimary
              onClick={() => onAction(study!.identifier,)}
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