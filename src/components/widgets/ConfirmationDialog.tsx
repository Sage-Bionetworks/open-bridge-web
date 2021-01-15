import React, { FunctionComponent } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import { ReactComponent as Delete } from '../../assets/trash.svg'
import { IconButton, makeStyles } from '@material-ui/core'
import { latoFont, poppinsFont } from '../../style/theme'

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
    backgroundColor: theme.palette.error.main,
  },
}))

type ConfirmationDialogProps = {
  isOpen: boolean
  type: 'DELETE' | 'NAVIGATE'
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
  actionText = 'OK',
}) => {
  const classes = useStyles()
  const navigateBody = (
    <div>
      Looks like you have some unsaved Changes.
      <br /> Are you sure you want to leave?
    </div>
  )
  let body = type === 'NAVIGATE' ? navigateBody : children

  return (
    <Dialog
      open={isOpen}
      onClose={() => onCancel()}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={classes.dialogTitle}
    >
      <DialogTitle
        id="alert-dialog-title"
        disableTypography={true}
        className={classes.title}
      >
        {type === 'DELETE' && <Delete></Delete>}
        <div>{title}</div>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={() => onCancel()}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {body}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onCancel()} color="default" variant="contained">
          {cancelText}
        </Button>
        <Button
          onClick={() => onConfirm()}
          className={classes.confirmButton}
          variant="contained"
          autoFocus
        >
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmationDialog
