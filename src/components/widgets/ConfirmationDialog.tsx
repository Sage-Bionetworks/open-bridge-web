import {darken, styled} from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import {shouldForwardProp, theme} from '@style/theme'
import {FunctionComponent} from 'react'
import DialogTitleWithClose from './DialogTitleWithClose'

const StyledConfirmButton = styled(Button, {label: 'StyledCancelButton', shouldForwardProp: shouldForwardProp})(
  ({theme}) => ({
    backgroundColor: '#FF4164',
    fontSize: '16px',
    fontWeight: 900,
    color: '#000',
    borderRadius: '5px',
    ':hover': {
      backgroundColor: darken('#FF4164', 0.1),
    },
  })
)
const StyledCancelButton = styled(Button, {label: 'StyledCancelButton', shouldForwardProp: shouldForwardProp})(
  ({theme}) => ({})
)

export type ConfirmationDialogType = 'DELETE' | 'NAVIGATE' | 'WITHDRAW_STUDY' | 'CLOSE_STUDY' | 'CUSTOM'

type ConfirmationDialogProps = {
  isOpen: boolean
  type: ConfirmationDialogType
  title?: string
  width?: number
  cancelText?: string
  actionText?: string
  onCancel: Function
  hideCancel?: boolean
  onConfirm: Function
  children?: JSX.Element
}

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({
  isOpen,
  onCancel,
  hideCancel,
  title = 'Navigate Away? ',
  type,
  onConfirm,
  children,
  width = type === 'CLOSE_STUDY' ? 750 : 600,
  cancelText = 'Cancel',
  actionText = 'Delete',
}) => {
  const navigateBody = (
    <div>
      Looks like you have some <strong>unsaved changes</strong>.
      <br /> Are you sure you want to leave?
    </div>
  )
  let body = type === 'NAVIGATE' ? navigateBody : children

  return (
    <Dialog
      open={isOpen}
      onClose={() => onCancel()}
      aria-labelledby={type}
      maxWidth="md"
      scroll="paper"
      /*sx={{width: `${width}px`}}*/
    >
      <DialogTitleWithClose onCancel={() => onCancel()} title={title} />

      <DialogContent sx={{padding: 0}}>
        <DialogContentText
          id="alert-dialog-description"
          component="div"
          sx={{padding: theme.spacing(2.5, 0), fontSize: '16px', lineHeight: '20px'}}>
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{justifyContent: width > 600 ? 'flex-end' : 'space-between'}}>
        {!hideCancel && (
          <StyledCancelButton onClick={() => onCancel()} variant="outlined">
            {cancelText}
          </StyledCancelButton>
        )}
        <StyledConfirmButton onClick={() => onConfirm()} variant="contained" color="inherit" autoFocus>
          {type === 'NAVIGATE' ? 'Continue' : actionText}
        </StyledConfirmButton>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
