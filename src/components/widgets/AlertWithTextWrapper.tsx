import React from 'react'
import {AlertWithText} from './StyledComponents'
import Alert_Icon from '../../assets/alert_icon.svg'

type AlertWithTextWrapperProps = {
  text: string
  className?: string
}

const AlertWithTextWrapper: React.FunctionComponent<AlertWithTextWrapperProps> = ({
  text,
  className,
}) => {
  return (
    <AlertWithText
      icon={
        <img src={Alert_Icon} style={{height: '20px'}} alt={'error-icon'}></img>
      }
      severity="error"
      className={className}>
      {text}
    </AlertWithText>
  )
}

export default AlertWithTextWrapper
