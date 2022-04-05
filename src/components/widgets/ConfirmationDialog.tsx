import {ReactComponent as CloseStudy} from '@assets/dialogs/close_study.svg'
import {ReactComponent as WithdrawStudy} from '@assets/dialogs/withdraw_study.svg'
import {ReactComponent as Delete} from '@assets/trash.svg'
import CloseIcon from '@mui/icons-material/Close'
import {IconButton} from '@mui/material'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont, poppinsFont} from '@style/theme'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  dialogTitle: {},
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  title: {
    padding: theme.spacing(3),
    position: 'relative',
    fontFamily: poppinsFont,
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: '27px',
    textAlign: 'left',
    alignItems: 'center',
    display: 'flex',
    '& div': {
      paddingLeft: theme.spacing(2),
    },
  },
  body: {
    fontFamily: latoFont,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '16px',
    lineHeight: '19px',
  },
  confirmButton: {
    color: '#000',
    whiteSpace: 'nowrap',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    height: '49px',
    background: theme.palette.error.light,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    borderRadius: '0px',
    fontFamily: 'Lato',
    '&:hover': {
      transform: 'translateY(1px)',
      backgroundColor: '#EDC6C6',
    },
  },
  dialogPaper: {
    //height: '275px',
    width: '302px',
  },
  dialogPaperWide: {
    //height: '275px',
    width: '362px',
  },
  cancelButton: {
    width: '120px',
    height: '49px',
    outline: 'none',
    borderRadius: '0px',
    border: '1px solid black',
    background: '#FCFCFC',
    color: 'black',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    fontFamily: 'Lato',
    '&:hover': {
      transform: 'translateY(1px)',
      backgroundColor: '#d5d5d5',
      color: '#000',
    },
  },
  dialogButtonsContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    marginBottom: theme.spacing(2.5),
  },
}))

export type ConfirmationDialogType =
  | 'DELETE'
  | 'NAVIGATE'
  | 'WITHDRAW_STUDY'
  | 'CLOSE_STUDY'

type ConfirmationDialogProps = {
  isOpen: boolean
  type: ConfirmationDialogType
  title?: string
  cancelText?: string
  actionText?: string
  onCancel: Function
  onConfirm: Function
  children?: JSX.Element
}

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({
  isOpen,
  onCancel,
  title = 'Navigate Away? ',
  type,
  onConfirm,
  children,
  cancelText = 'Cancel',
  actionText = 'Delete',
}) => {
  const classes = useStyles()
  const navigateBody = (
    <div>
      Looks like you have some unsaved Changes.
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
        return <></>
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={() => onCancel()}
      aria-labelledby={type}
      maxWidth="md"
      scroll="paper"
      className={classes.dialogTitle}
      classes={{
        paper:
          type === 'CLOSE_STUDY'
            ? classes.dialogPaperWide
            : classes.dialogPaper,
      }}>
      <DialogTitle id="alert-dialog-title" className={classes.title}>
        {getImage()}
        <div>{title}</div>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => onCancel()}
          size="large">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogButtonsContainer}>
        <Button
          onClick={() => onCancel()}
          variant="contained"
          color="primary"
          className={classes.cancelButton}>
          {cancelText}
        </Button>
        <Button
          onClick={() => onConfirm()}
          className={classes.confirmButton}
          variant="contained"
          color="secondary"
          autoFocus>
          {type === 'NAVIGATE' ? 'Continue' : actionText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
