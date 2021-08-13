import {Box, Paper, makeStyles} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {StudySession} from '../../../../types/scheduling'
import ClockIcon from '@material-ui/icons/AccessTime'
import {
  useStyles as SessionContainerStyles,
  getTotalSessionTime,
} from '../SingleSessionContainer'
import {useStyles as SharedSessionCreatorStyles} from '../SessionCreator'
import SessionIcon from '../../../widgets/SessionIcon'
import AssessmentSmall from '../../../assessments/AssessmentSmall'
import clsx from 'clsx'

type ReadOnlySessionCreatorProps = {
  sessions: StudySession[]
  children: React.ReactNode
  isReadOnly?: boolean
}

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    padding: theme.spacing(4, 4),
  },
  assessmentContainer: {
    marginRight: theme.spacing(2),
    backgroundColor: '#f2f2f2',
    paddingBottom: theme.spacing(5),
    
  },
}))

const ReadOnlySessionCreator: FunctionComponent<ReadOnlySessionCreatorProps> = ({
  sessions,
  children,
}) => {
  const classes = useStyles()
  const sessionCreatorClasses = SharedSessionCreatorStyles()
  const sessionContainerClasses = SessionContainerStyles()
  if (sessions) {
    return (
      <>
        <Box
          className={clsx(sessionContainerClasses.root, classes.container)}
          key="sessions">
          {sessions.map((session, index) => (
            <Paper
              className={clsx(
                sessionCreatorClasses.sessionContainer,
                classes.assessmentContainer
              )}
              key={session.guid! + index}>
              <Box className={sessionContainerClasses.inner}>
                <Box marginRight={2}>
                  <SessionIcon index={index}>
                    <Box>{session.name}</Box>
                  </SessionIcon>
                </Box>
                <Box fontSize="12px" textAlign="right">
                  {getTotalSessionTime(session.assessments) || 0} min &nbsp;
                  <ClockIcon
                    style={{
                      fontSize: '12px',
                      verticalAlign: 'middle',
                    }}></ClockIcon>
                </Box>
              </Box>
              <div className={sessionContainerClasses.droppable}>
                {session.assessments?.map((assessment, index) => (
                  <AssessmentSmall
                    hasHover={false}
                    key={index}
                    assessment={assessment}
                    isDragging={false}></AssessmentSmall>
                ))}
              </div>
              <Box borderTop="1px solid black" width="100%"></Box>
            </Paper>
          ))}
        </Box>
        {children}
      </>
    )
  } else return <>should not happen</>
}

export default ReadOnlySessionCreator
