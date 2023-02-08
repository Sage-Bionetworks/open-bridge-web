import AssessmentSmall from '@components/assessments/AssessmentSmall'
import {BuilderWrapper} from '@components/studies/StudyBuilder'
import SessionIcon from '@components/widgets/SessionIcon'
import {Box, Typography} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {theme} from '@style/theme'
import {StudySession} from '@typedefs/scheduling'
import React, {FunctionComponent} from 'react'
import {StyledSessionContainer, useStyles as SharedSessionCreatorStyles} from '../SessionCreator'
import {SessionTimeDisplay, useStyles as SessionContainerStyles} from '../SingleSessionContainer'

type ReadOnlySessionCreatorProps = {
  sessions: StudySession[]
  children: React.ReactNode
}

const useStyles = makeStyles(theme => ({
  assessmentContainer: {
    marginRight: theme.spacing(2),
    backgroundColor: '#f2f2f2',
    paddingBottom: theme.spacing(5),
  },
}))

const ReadOnlySessionCreator: FunctionComponent<ReadOnlySessionCreatorProps> = ({sessions, children}) => {
  const classes = useStyles()
  const sessionCreatorClasses = SharedSessionCreatorStyles()
  const sessionContainerClasses = SessionContainerStyles()
  if (sessions) {
    return (
      <BuilderWrapper sectionName="Create Sessions" isReadOnly>
        <Typography variant="h2" paragraph sx={{mb: theme.spacing(3), textAlign: 'left'}}>
          Create Sessions
        </Typography>
        <Box className={sessionCreatorClasses.root} key="sessions">
          {sessions.map((session, index) => (
            <StyledSessionContainer key={session.guid! + '_' + index}>
              {/* session header */}
              <Box className={sessionContainerClasses.inner}>
                <Box marginRight={2}>
                  <SessionIcon index={index} symbolKey={session.symbol}>
                    <Typography variant="h4" sx={{textDecoration: 'none !important', color: '##22252A'}}>
                      {session.name}
                    </Typography>
                  </SessionIcon>
                </Box>
                <SessionTimeDisplay assessments={session.assessments} />
              </Box>
              {/* assessments inside each session */}
              <Box sx={{mt: 2}}>
                {session.assessments?.map((assessment, index) => (
                  <AssessmentSmall
                    isReadOnly={true}
                    key={index}
                    assessment={assessment}
                    isDragging={false}></AssessmentSmall>
                ))}
              </Box>
            </StyledSessionContainer>
          ))}
        </Box>
      </BuilderWrapper>
    )
  } else return <>should not happen</>
}

export default ReadOnlySessionCreator
