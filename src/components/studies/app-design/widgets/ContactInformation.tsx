import EmailIcon from '@assets/email_icon.svg'
import PhoneIcon from '@assets/phone_icon.svg'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles';
import React from 'react'

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
    <Box className={classes.container}>
      <Box className={classes.row}>
        <img className={classes.icon} src={PhoneIcon} alt="phone_icon"></img>
        <Box>{phoneNumber || 'xxx-xxx-xxxx'}</Box>
      </Box>
      <Box className={`${classes.row} ${classes.bottomRow}`}>
        <img className={classes.icon} src={EmailIcon} alt="email_icon"></img>
        <Box>{email || 'placeholder@institution.com'}</Box>
      </Box>
    </Box>
  )
}

export default ContactInformation
