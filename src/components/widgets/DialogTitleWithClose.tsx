import { IconButton, makeStyles } from '@material-ui/core'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import React, { FunctionComponent } from 'react'
import { latoFont, poppinsFont } from '../../style/theme'

const useStyles = makeStyles(theme => ({
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
    width: '302px',
    height: '275px',
  },

  
}))

type ConfirmationDialogProps = {
 
  children?: JSX.Element
  onCancel: Function
}

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({
  onCancel,

  children,
}) => {
  const classes = useStyles()

  return (
    <DialogTitle disableTypography={true} className={classes.title}>
      {children}
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={() => onCancel()}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  )
}

export default ConfirmationDialog
