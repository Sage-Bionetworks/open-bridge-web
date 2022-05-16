import React from 'react'
import {AlertWithText} from './StyledComponents'
import Alert_Icon from '../../assets/alert_icon.svg'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

type AlertWithTextWrapperProps = {
  text: string
  className?: string
}

const useStyles = makeStyles(theme => ({
  errorText: {
    marginTop: theme.spacing(-1.5),
    marginLeft: theme.spacing(-2),
    marginBottom: theme.spacing(-0.5),
  },
}))

const AlertWithTextWrapper: React.FunctionComponent<AlertWithTextWrapperProps> =
  ({text, className}) => {
    const classes = useStyles()
    return (
      <AlertWithText
        icon={
          <img
            src={Alert_Icon}
            style={{height: '20px'}}
            alt={'error-icon'}></img>
        }
        severity="error"
        className={clsx(classes.errorText, className && className)}>
        {text}
      </AlertWithText>
    )
  }

export default AlertWithTextWrapper
