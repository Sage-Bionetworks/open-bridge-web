import React from 'react'
import {Box, makeStyles} from '@material-ui/core'
import {poppinsFont} from '../../../../style/theme'
import StudyEnrollmentAdditionIcon from '../../../../assets/study_enrollment_addition_icon.svg'

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing(11),
    marginBottom: theme.spacing(11),
  },
  image: {
    marginRight: theme.spacing(9),
    marginTop: theme.spacing(-19.5),
  },
  text: {
    maxWidth: '320px',
    textAlign: 'left',
    fontFamily: poppinsFont,
    fontSize: '14px',
    lineHeight: '21px',
  },
}))

const ReadOnlyEnrollmentTypeSelector: React.FunctionComponent<{
  isPhoneNumberSignInType: boolean
  children: React.ReactNode
}> = ({isPhoneNumberSignInType, children}) => {
  const classes = useStyles()
  return (
    <>
      <Box className={classes.container}>
        <img className={classes.image} src={StudyEnrollmentAdditionIcon}></img>
        <Box className={classes.text}>
          Participants will enroll into this study on their smartphone device
          with a:
          <br></br>
          <br></br>
          <strong>
            {isPhoneNumberSignInType
              ? 'Phone number'
              : 'Participant ID defined by you'}
          </strong>
          <br></br>
          <br></br>
          If you haven’t already done so, you will need to enroll your
          participants to your study in the{' '}
          <a>
            <u>Participant Manager.</u>
          </a>
          <br></br>
          <br></br>
          To log into the app, participants will need to enter both their Study
          ID and{' '}
          {isPhoneNumberSignInType ? 'their Phone number' : 'Participant ID.'}
        </Box>
      </Box>
      {children}
    </>
  )
}

export default ReadOnlyEnrollmentTypeSelector
