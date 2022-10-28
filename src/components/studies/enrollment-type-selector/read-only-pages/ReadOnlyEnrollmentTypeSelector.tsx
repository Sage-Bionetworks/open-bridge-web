import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import React from 'react'
import {NavLink} from 'react-router-dom'
import StudyEnrollmentAdditionIcon from '../../../../assets/study_enrollment_addition_icon.svg'
import {poppinsFont} from '../../../../style/theme'
import constants from '../../../../types/constants'

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

type ReadOnlyEnrollmentTypeSelectorProps = {
  isPhoneNumberSignInType: boolean
  isIdGenerated?: boolean
  children: React.ReactNode
  studyId: string
}

const ReadOnlyEnrollmentTypeSelector: React.FunctionComponent<ReadOnlyEnrollmentTypeSelectorProps> = ({
  isPhoneNumberSignInType,
  children,
  studyId,
  isIdGenerated,
}) => {
  const classes = useStyles()
  let signInType = 'Phone number'
  if (!isPhoneNumberSignInType) {
    signInType = isIdGenerated ? 'Generated Participant ID' : 'Participant ID defined by you'
  }

  return (
    <>
      <Box className={classes.container}>
        <img className={classes.image} src={StudyEnrollmentAdditionIcon}></img>
        <Box className={classes.text}>
          Participants will enroll into this study on their smartphone device with a:
          <br></br>
          <br></br>
          <strong>{signInType}</strong>
          <br></br>
          <br></br>
          If you haven’t already done so, you will need to enroll your participants to your study in the{' '}
          <NavLink to={constants.restrictedPaths.PARTICIPANT_MANAGER.replace(':id', studyId)}>
            Participant Manager
          </NavLink>
          <br></br>
          <br></br>
          To log into the app, participants will need to enter both their Study ID and{' '}
          {isPhoneNumberSignInType ? 'their Phone number' : 'Participant ID.'}
        </Box>
      </Box>
      {children}
    </>
  )
}

export default ReadOnlyEnrollmentTypeSelector
