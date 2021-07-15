import React from 'react'
import {makeStyles} from '@material-ui/core'
import {Alert} from '@material-ui/lab'
import {latoFont, ThemeType} from '../../style/theme'
import Alert_Icon from '../../assets/scheduler/white_alert_icon.svg'
import SaveIcon from '../../assets/save_icon.svg'

import clsx from 'clsx'

const useStyles = makeStyles((theme: ThemeType) => ({
  container: {
    position: 'fixed',
    top: theme.spacing(2),
    left: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 15000,
    height: '88px',
    borderRadius: '0px',
    fontSize: '16px',
    fontFamily: latoFont,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    animation: '$fade-in 0.5s ease',
    '& svg': {
      width: '28px',
      height: '28px',
    },
  },
  invisible: {
    display: 'none',
  },
  success: {
    backgroundColor: '#AEDCC9',
    color: 'black',
  },
  error: {
    backgroundColor: '#EE6070',
    color: 'white',
  },
  '@keyframes fade-in': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
}))

type TopErrorBannerProps = {
  onClose: Function
  isVisible: boolean
  type: 'success' | 'error'
  displayText?: string
}

const TopErrorBanner: React.FunctionComponent<TopErrorBannerProps> = ({
  isVisible,
  type,
  displayText,
  onClose,
}) => {
  const classes = useStyles()
  let timeout: NodeJS.Timeout

  React.useEffect(() => {
    clearTimeout(timeout)
    if (type === 'success') {
      timeout = setTimeout(() => {
        onClose()
      }, 8000)
    }
  }, [type, isVisible])

  return (
    <Alert
      onClose={() => onClose()}
      severity="error"
      className={clsx(
        classes.container,
        !isVisible && classes.invisible,
        type === 'success' && classes.success,
        type === 'error' && classes.error
      )}
      icon={
        <img
          src={type === 'error' ? Alert_Icon : SaveIcon}
          style={{height: '20px'}}
          alt={'error-message'}></img>
      }>
      {displayText
        ? displayText
        : type === 'error'
        ? 'Please fix the errors below before continuing.'
        : 'Page has been saved successfully.'}
    </Alert>
  )
}

export default TopErrorBanner
