import CloseIcon from '@mui/icons-material/Close'
import {IconButton} from '@mui/material'
import DialogTitle from '@mui/material/DialogTitle'
import {theme} from '@style/theme'
import React, {FunctionComponent} from 'react'

type DialogTitleWithCloseProps = {
  icon?: React.ReactNode
  onCancel: () => void
  title: string
  isSmallTitle?: boolean
}

const DialogTitleWithClose: FunctionComponent<DialogTitleWithCloseProps> = ({
  onCancel,
  icon,
  title,
  isSmallTitle,
  ...other
}) => {
  return (
    <DialogTitle
      sx={{
        display: 'flex',

        flexDirection: 'row',
        '& div': {
          paddingLeft: theme.spacing(2),
        },
        '&.small': {
          fontSize: '16px',
        },
      }}
      {...other}>
      {icon ? icon : <></>}

      {title}
      {onCancel ? (
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme => ' #878E95',
          }}>
          <CloseIcon fontSize="medium" />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

export default DialogTitleWithClose
