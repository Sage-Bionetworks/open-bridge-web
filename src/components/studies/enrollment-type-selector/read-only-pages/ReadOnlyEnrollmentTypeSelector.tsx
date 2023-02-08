import {BuilderWrapper} from '@components/studies/StudyBuilder'
import {StyledLink} from '@components/widgets/StyledComponents'
import {Box, Typography} from '@mui/material'
import {theme} from '@style/theme'
import constants from '@typedefs/constants'
import React from 'react'

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
  let signInType = 'Phone number'
  if (!isPhoneNumberSignInType) {
    signInType = isIdGenerated ? 'Generated Participant ID' : 'Participant ID defined by you'
  }

  return (
    <BuilderWrapper sectionName="Participant Study Enrollment" isReadOnly={true}>
      <Box sx={{textAlign: 'left'}}>
        <Typography variant="h2" paragraph sx={{marginBottom: theme.spacing(5)}}>
          Participant Study Enrollment
        </Typography>
        <Typography variant="h5" paragraph>
          Participants will enroll into this study on their smartphone device with a
        </Typography>
        <br></br>
        <Typography variant="h5" paragraph sx={{fontSize: '20px'}}>
          {signInType}
        </Typography>
        <br></br>
        <Typography variant="h5" paragraph>
          If you haven’t already done so, you will need to enroll your participants to your study in the{' '}
          <StyledLink to={constants.restrictedPaths.PARTICIPANT_MANAGER.replace(':id', studyId)}>
            Participant Manager
          </StyledLink>
        </Typography>
        <br></br>
        <Typography variant="h5" paragraph>
          To log into the app, participants will need to enter both their Study ID and{' '}
          {isPhoneNumberSignInType ? 'their Phone number' : 'Participant ID.'}
        </Typography>
      </Box>
    </BuilderWrapper>
  )
}

export default ReadOnlyEnrollmentTypeSelector
