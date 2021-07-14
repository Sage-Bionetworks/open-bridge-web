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
    zIndex: 1000,
    height: '88px',
    borderRadius: '0px',
    fontSize: '16px',
    fontFamily: latoFont,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
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

  React.useEffect(() => {
    if (type === 'success') {
      setTimeout(() => {
        onClose()
      }, 5000)
    }
  }, [isVisible, type])

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
          style={{height: '22px'}}
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
