import {ReactComponent as EditIcon} from '@assets/edit_pencil_red.svg'
import {IconButton, makeStyles} from '@material-ui/core'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloseIcon from '@material-ui/icons/Close'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {poppinsFont} from '../../style/theme'

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

    flexDirection: 'row',
    '& div': {
      paddingLeft: theme.spacing(2),
    },
    '&.small': {
      fontSize: '16px',
    },
  },
}))

type ConfirmationDialogProps = {
  icon?: React.ReactNode
  onCancel: Function
  title: string
  isSmallTitle?: boolean
}

const ConfirmationDialog: FunctionComponent<ConfirmationDialogProps> = ({
  onCancel,
  icon,
  title,
  isSmallTitle,
}) => {
  const classes = useStyles()

  return (
    <DialogTitle
      disableTypography={true}
      className={clsx(classes.title, isSmallTitle && 'small')}>
      {icon ? icon : <EditIcon />}
      <div>{title}</div>

      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={() => onCancel()}>
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  )
}

export default ConfirmationDialog
