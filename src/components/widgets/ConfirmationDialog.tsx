import {ReactComponent as CloseStudy} from '@assets/dialogs/close_study.svg'
import {ReactComponent as WithdrawStudy} from '@assets/dialogs/withdraw_study.svg'
import {ReactComponent as Delete} from '@assets/trash.svg'
import CloseIcon from '@mui/icons-material/Close'
import {darken, IconButton, styled} from '@mui/material'
import Button from '@mui/material/Button'
import Dialog, {dialogClasses} from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import {latoFont, shouldForwardProp, theme} from '@style/theme'
import {FunctionComponent} from 'react'

const StyledConfirmationDialog = styled(Dialog, {
  label: 'StyledConfirmationDialog',
  shouldForwardProp: shouldForwardProp,
})<{$width: string}>(({theme, $width}) => ({
  [`& .${dialogClasses.paper}`]: {
    fontFamily: latoFont,
    fontSize: '16px',
    width: $width,
    padding: theme.spacing(4, 5),
  },
}))

const StyledDialogTitle = styled(DialogTitle, {label: 'StyledDialogTitle', shouldForwardProp: shouldForwardProp})(
  ({theme}) => ({
    padding: theme.spacing(1, 0, 3, 0),
    fontWeight: 700,
    fontSize: '20px',
    lineHeight: '24px',
    display: 'flex',
    alignItems: 'center',
    color: '#22252A',
    fontFamily: latoFont,
    textAlign: 'left',
    borderBottom: '1px solid #EAECEE',
    '> svg': {
      marginRight: theme.spacing(1),
    },
  })
)

const StyledDialogActions = styled(DialogActions, {label: 'StyledDialogActions', shouldForwardProp: shouldForwardProp})(
  ({theme}) => ({
    padding: theme.spacing(2.5, 0, 0, 0),
    borderTop: '1px solid #EAECEE',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(0),
    '& button:not(:first-of-type)': {
      marginLeft: theme.spacing(2),
    },
  })
)
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
  width?: string
  cancelText?: string
  actionText?: string
  onCancel: Function
  onConfirm: Function
  children?: JSX.Element
  icon?: JSX.Element
}

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({
  isOpen,
  onCancel,
  icon,
  title = 'Navigate Away? ',
  type,
  onConfirm,
  children,
  width = '352',
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
  const getImage = () => {
    switch (type) {
      case 'DELETE':
        return <Delete />
      case 'WITHDRAW_STUDY':
        return <WithdrawStudy />
      case 'CLOSE_STUDY':
        return <CloseStudy />
      default:
        return icon
    }
  }

  return (
    <StyledConfirmationDialog
      open={isOpen}
      onClose={() => onCancel()}
      aria-labelledby={type}
      maxWidth="md"
      scroll="paper"
      $width={type === 'CLOSE_STUDY' ? '750px' : width}>
      <StyledDialogTitle id="alert-dialog-title">
        {getImage()}
        <div>{title}</div>
        <IconButton
          aria-label="close"
          sx={{position: 'absolute', right: theme.spacing(3), top: theme.spacing(4), color: theme.palette.grey[700]}}
          onClick={() => onCancel()}
          size="large">
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent sx={{padding: 0}}>
        <DialogContentText
          id="alert-dialog-description"
          component="div"
          sx={{padding: theme.spacing(2.5, 0), fontSize: '16px', lineHeight: '20px'}}>
          {body}
        </DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <StyledCancelButton onClick={() => onCancel()} variant="outlined">
          {cancelText}
        </StyledCancelButton>
        <StyledConfirmButton onClick={() => onConfirm()} variant="contained" color="inherit" autoFocus>
          {type === 'NAVIGATE' ? 'Continue' : actionText}
        </StyledConfirmButton>
      </StyledDialogActions>
    </StyledConfirmationDialog>
  )
}

export default ConfirmationDialog
