import React, { FunctionComponent, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { Assessment, Group, StudySession } from '../../../types/types'

import GroupsEditor from '../../../x_old/GoupsEditor'

import AssessmentSelector from './AssessmentSelector'

import actionsReducer, { Types, SessionAction } from './sessionActions'
import StudyService from '../../../services/study.service'
import TabPanel from '../../widgets/TabPanel'
import SessionActionButtons from './SessionActionButtons'
import SingleSessionContainer from './SingleSessionContainer'
import { useErrorHandler } from 'react-error-boundary'
import { useAsync } from '../../../helpers/AsyncHook'

const useStyles = makeStyles(theme => ({
  root: {},
  bookmarkedAssessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}))

type SessionCreatorProps = {
  //studyGroups?: Group[]
  // id?: string
  studySessions: StudySession[]
}

const SessionCreator: FunctionComponent<SessionCreatorProps> = ({
  //studyGroups,
  //id,
  studySessions,
}: SessionCreatorProps) => {
  const classes = useStyles()

  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const groupsUpdateFn = (action: SessionAction) => {
    const newState = actionsReducer(sessions!, action)
    console.log('setting data  to ', newState)
    setData(newState)
  }

  /* const { data: sessions, status, error, run, setData } = useAsync<StudySession[]>({
    status: 'IDLE',
    data: studySessions|| [],
  })
*/
  const [sessions, setData] = React.useState<StudySession[]>(studySessions)
  const handleError = useErrorHandler()
  console.log('sessionsState', sessions)

  /*React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudy(id).then(study => {
      if (!study) {
        throw new Error("what are you thinking?")
      }
      return study!.groups.map(group =>  group.sessions).flat()}))
  }, [id, run])

  if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'PENDING') {
    return <>...loading</>
  }*/

  const cancelAssessmentSelector = () => {
    setIsAssessmentDialogOpen(false)
    setSelectedAssessments([])

  }

  const updateAssessmentList = (sessionId: string, assessments: Assessment[]) =>{
  console.log(assessments)
    groupsUpdateFn({
      type: Types.UpdateAssessments,
      payload: { sessionId, assessments },
    })
  }

  const updateAssessments = (sessionId: string, assessments: Assessment[]) => {
    console.log('updating')
    groupsUpdateFn({
      type: Types.UpdateAssessments,
      payload: {
        sessionId,
        assessments,
      },
    })
    setIsAssessmentDialogOpen(false)
  }

  const getActiveSession = (
    sessions: StudySession[],
  ): StudySession | undefined => {
    const session = sessions.find(session => session.active)
    return session
  }

  if (sessions) {
    return (
      <>
       
        <Box
          display="grid"
          padding="8px"
          gridTemplateColumns="repeat(auto-fill,280px)"
          gridColumnGap="16px"
          gridRowGap="16px"
          minHeight="400px"
        >
          {sessions.map(session => (
            <Box
              width="280px"
              border="1px solid black"
              bgcolor="#d5e5ec"
              key={session.id}
              borderColor={session.active ? 'red' : 'blue'}
            >
              <SingleSessionContainer
                key={session.id}
                studySession={session}
                onShowAssessments={() => setIsAssessmentDialogOpen(true)}
                onSetActiveSession={(sessionId: string) =>
                  groupsUpdateFn({
                    type: Types.SetActiveSession,
                    payload: { sessionId },
                  })
                }
                onRemoveSession={(sessionId: string) =>
                  groupsUpdateFn({
                    type: Types.RemoveSession,
                    payload: { sessionId },
                  })
                }
                onUpdateSessionName={(sessionId: string, sessionName: string) =>
                  groupsUpdateFn({
                    type: Types.UpdateSessionName,
                    payload: { sessionId, sessionName },
                  })
                }
                onUpdateAssessmentList={updateAssessmentList}
              ></SingleSessionContainer>
            </Box>
          ))}
         
        </Box>
        <Box borderTop="1px solid black" key="footer">
          <SessionActionButtons
            key={'new_session'}
            sessions={sessions}
            onAddSession={(
              sessions: StudySession[],
              assessments: Assessment[],
            ) =>
              groupsUpdateFn({
                type: Types.AddSession,
                payload: {
                  name: 'Session' + sessions.length.toString(),
                  assessments,
                  active: true,
                },
              })
            }
          ></SessionActionButtons>
        </Box>
        <Dialog
          maxWidth="lg"
          open={isAssessmentDialogOpen}
          onClose={cancelAssessmentSelector}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle>
            Select assessment(s) to add to session.
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={cancelAssessmentSelector}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <AssessmentSelector
              selectedAssessments={selectedAssessments}
              onUpdateAssessments={setSelectedAssessments}
              activeSession={getActiveSession(sessions!)}
            ></AssessmentSelector>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelAssessmentSelector}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={() => {
                updateAssessments(getActiveSession(sessions)!.id, [
                  ...getActiveSession(sessions)!.assessments,
                  ...selectedAssessments,
                ])
                setSelectedAssessments([])
              }}
            >
              {!getActiveSession(sessions)
                ? 'Please select group and session'
                : `Add  to  ${getActiveSession(sessions)?.name} `}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  } else return <>should not happen</>
}

export default SessionCreator
