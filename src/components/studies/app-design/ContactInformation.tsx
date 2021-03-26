import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import PhoneIcon from '../../../assets/phone_icon.svg'
import EmailIcon from '../../../assets/email_icon.svg'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    width: '80%',
  },
  icon: {
    marginRight: '10px',
  },
  bottomRow: {
    marginTop: '10px',
  },
}))

type ContactInformationProps = {
  phoneNumber: string
  email: string
}

const ContactInformation: React.FunctionComponent<ContactInformationProps> = ({
  email,
  phoneNumber,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <div className={classes.row}>
        <img className={classes.icon} src={PhoneIcon} alt="phone_icon"></img>
        <div>{phoneNumber || 'xxx-xxx-xxxx'}</div>
      </div>
      <div className={`${classes.row} ${classes.bottomRow}`}>
        <img className={classes.icon} src={EmailIcon} alt="email_icon"></img>
        <div>{email || 'placeholder@institution.com'}</div>
      </div>
    </div>
  )
}

export default ContactInformation
