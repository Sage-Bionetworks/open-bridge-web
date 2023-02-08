import {BuilderWrapper} from '@components/studies/StudyBuilder'
import {Box, Container, Paper, Typography} from '@mui/material'
import {theme} from '@style/theme'
import {Study} from '@typedefs/types'
import React from 'react'
import {
  formatPhoneNumber,
  getContact,
  StudyPageBottomPhone,
  StudyPageTopPhone,
  WelcomeScreenDisplay,
} from '../AppDesign'

const ReadOnlyAppDesign: React.FunctionComponent<{
  children: React.ReactNode
  study: Study
  getContactPersonObject: Function
}> = ({study, getContactPersonObject}) => {
  const generalContactPhoneNumber = getContact(study, 'study_support')?.phone?.number || ''
  const irbPhoneNumber = formatPhoneNumber(getContact(study, 'irb')?.phone?.number || '')

  return (
    <BuilderWrapper isReadOnly={true} sectionName={''}>
      <Container maxWidth="md" key="c1">
        <Paper elevation={2} sx={{padding: theme.spacing(2, 2, 10, 2)}}>
          <Typography variant="h3" paragraph textAlign="left">
            Welcome Screen
          </Typography>
          <Box sx={{width: '330px', margin: '0 auto'}}>
            <WelcomeScreenDisplay study={study} isReadOnly={true} studyLogoUrl={study.studyLogoUrl} />
          </Box>
        </Paper>
      </Container>
      <Container maxWidth="md" key="c2">
        <Paper elevation={2} sx={{padding: theme.spacing(2, 2, 10, 2)}}>
          <Typography variant="h3" paragraph textAlign="left">
            Study Page
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '800px',
              mx: 'auto',
              '>div': {width: 'auto'},
            }}>
            <StudyPageTopPhone
              study={study}
              studyLogoUrl={study.studyLogoUrl}
              getContactPersonObject={getContactPersonObject}
              isReadOnly={true}
            />
            <StudyPageBottomPhone
              study={study}
              getContactPersonObject={getContactPersonObject}
              generalContactPhoneNumber={generalContactPhoneNumber}
              irbPhoneNumber={irbPhoneNumber}
              isReadOnly={true}
            />
          </Box>
        </Paper>
      </Container>
    </BuilderWrapper>
  )
}
export default ReadOnlyAppDesign
