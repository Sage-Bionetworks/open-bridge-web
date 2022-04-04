import {Alert} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'
import {latoFont, ThemeType} from '../../style/theme'

type StyleProps = {
  backgroundColor: string
  textColor: string
}

const useStyles = makeStyles<ThemeType>((theme: ThemeType) => ({
  container: {
    position: 'fixed',
    left: theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 15000,
    height: '88px',
    borderRadius: '0px',
    fontSize: '16px',
    fontFamily: latoFont,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '& svg': {
      width: '28px',
      height: '28px',
    },
  },
  ////  }),
  animation: {
    animation: '$fade-in 0.5s ease',
  },
  invisible: {
    display: 'none',
  },
  '@keyframes fade-in': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  topOfPagePosition: {
    top: theme.spacing(2),
  },
  bottomOfPagePosition: {
    bottom: theme.spacing(2),
  },
}))

type AlertBannerProps = {
  onClose: Function
  isVisible: boolean
  displayText: string
  displayBottomOfPage?: boolean
  backgroundColor: string
  textColor: string
  icon: string
  isSelfClosing?: boolean
}

let timeout: NodeJS.Timeout

const AlertBanner: React.FunctionComponent<AlertBannerProps> = ({
  isVisible,
  displayText,
  onClose,
  displayBottomOfPage,
  backgroundColor,
  textColor,
  icon,
  isSelfClosing,
}) => {
  const classes = useStyles()

  React.useEffect(() => {
    clearTimeout(timeout)
    if (isSelfClosing) {
      timeout = setTimeout(() => {
        onClose()
      }, 8000)
    }
  }, [isSelfClosing, isVisible])

  return (
    <Alert
      onClose={() => onClose()}
      severity="error"
      style={{color: textColor, backgroundColor: backgroundColor}}
      className={clsx(
        classes.container,
        classes.animation,
        !displayBottomOfPage && classes.topOfPagePosition,
        displayBottomOfPage && classes.bottomOfPagePosition,
        !isVisible && classes.invisible
      )}
      icon={<img src={icon} style={{height: '24px'}} alt={'message'}></img>}>
      {displayText}
    </Alert>
  )
}

export default AlertBanner
