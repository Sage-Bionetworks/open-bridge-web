import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper
} from '@material-ui/core'
import Fab from '@material-ui/core/Fab'
import CloseIcon from '@material-ui/icons/Close'
import React, { FunctionComponent, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import { useAsync } from '../../../helpers/AsyncHook'
import { useNavigate } from '../../../helpers/hooks'
import StudyService from '../../../services/study.service'
import { StudySession } from '../../../types/scheduling'
import { Assessment } from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import LoadingComponent from '../../widgets/Loader'
import NavButtons from '../NavButtons'
import { StudySection } from '../sections'
import AssessmentSelector from './AssessmentSelector'
import SessionActionButtons from './SessionActionButtons'
import actionsReducer, { SessionAction, Types } from './sessionActions'
import SingleSessionContainer from './SingleSessionContainer'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    padding: theme.spacing(1),
    gridTemplateColumns: 'repeat(auto-fill,280px)',
    gridColumnGap: theme.spacing(2),
    gridRowGap: theme.spacing(2),
    minHeight: theme.spacing(50),
    backgroundColor: '#fff',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  sessionContainer: {
    width: '280px',
    padding: theme.spacing(2),
    backgroundColor: '#F2f2f2',
  },
  actionButtons: {
    borderTop: '1px solid black',
    backgroundColor: '#FFF',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
    paddingBottom: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-between',
  },
}))

type SessionCreatorProps = {
  id: string
  section: StudySection
  nextSection?: StudySection
}

const SessionCreator: FunctionComponent<SessionCreatorProps> = ({
  section,
  nextSection,
  id,
}: SessionCreatorProps) => {
  const classes = useStyles()

  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)
 
  //const [saveLoader, setSaveLoader] = useState(false)

 
  const { data: sessions, status, error, run, setData, setError } = useAsync<
    StudySession[]
  >({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })

  const {hasObjectChanged, setHasObjectChanged, saveLoader, setSaveLoader, save} = useNavigate(id, section, nextSection|| '', async ()=> {await StudyService.saveStudySessions(id, sessions || []); return})

/*
  async function save (url?: string)  {
    setSaveLoader(true)
    const done = await StudyService.saveStudySessions(id, sessions || [])
    setHasObjectChanged(false)
    setSaveLoader(false)
    if (url) {
      window.location.replace(url)
    }
  }*/
  // get the sessions
  React.useEffect(() => {
    if (!id) {
      return
    }
    console.log('effect running')
    return run(StudyService.getStudySessions(id).then(sessions => sessions))
  }, [id, run])

  // save on data change
  React.useEffect(() => {
    if (!hasObjectChanged) {
      return
    }
   save().then(() => {
     console.log('saved')
    })
  }, [hasObjectChanged])

  const handleError = useErrorHandler()


  const sessionsUpdateFn = (action: SessionAction) => {
    const newState = actionsReducer(sessions!, action)

    setData(newState)
    if (action.type !== 'SET_ACTIVE_SESSION') setHasObjectChanged(true)
  }

  if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'PENDING') {
    return <>...loading</>
  }

  const cancelAssessmentSelector = () => {
    setIsAssessmentDialogOpen(false)
    setSelectedAssessments([])
  }

  const updateAssessmentList = (
    sessionId: string,
    assessments: Assessment[],
  ) => {
    console.log(assessments)
    sessionsUpdateFn({
      type: Types.UpdateAssessments,
      payload: { sessionId, assessments },
    })
  }

  const updateAssessments = (sessionId: string, assessments: Assessment[]) => {
    console.log('updating')
    sessionsUpdateFn({
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
        <NavigationPrompt when={hasObjectChanged}>
          {({ onConfirm, onCancel }) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
        <Fab
          color="primary"
          onClick={() => setHasObjectChanged(false)}
          aria-label="add"
          style={{
            position: 'absolute',
            right: '30px',
            display: hasObjectChanged ? 'block' : 'none',
          }}
        >
          Save
        </Fab>
        objectChanged? {hasObjectChanged ? 'yes' : 'no'}
        <Box className={classes.root}>
          {sessions.map(session => (
            <Paper className={classes.sessionContainer} key={session.id}>
              <SingleSessionContainer
                key={session.id}
                studySession={session}
                onShowAssessments={() => setIsAssessmentDialogOpen(true)}
                onSetActiveSession={(sessionId: string) =>
                  sessionsUpdateFn({
                    type: Types.SetActiveSession,
                    payload: { sessionId },
                  })
                }
                onRemoveSession={(sessionId: string) =>
                  sessionsUpdateFn({
                    type: Types.RemoveSession,
                    payload: { sessionId },
                  })
                }
                onUpdateSessionName={(sessionId: string, sessionName: string) =>
                  sessionsUpdateFn({
                    type: Types.UpdateSessionName,
                    payload: { sessionId, sessionName },
                  })
                }
                onUpdateAssessmentList={updateAssessmentList}
              ></SingleSessionContainer>
            </Paper>
          ))}
        </Box>
        <Box className={classes.actionButtons} key="actionButtons">
          <SessionActionButtons
            key={'new_session'}
            sessions={sessions}
            onAddSession={(
              sessions: StudySession[],
              assessments: Assessment[],
            ) =>
              sessionsUpdateFn({
                type: Types.AddSession,
                payload: {
                  name: 'Session' + sessions.length.toString(),
                  assessments,
                  studyId: id,
                  active: true,
                },
              })
            }
          ></SessionActionButtons>

          <LoadingComponent
            reqStatusLoading={saveLoader}
            variant="small"
            loaderSize="2rem"
            style={{ width: '2rem' }}
          ></LoadingComponent>
        </Box>
        <NavButtons
          id={id}
          currentSection={section}
          onNavigate={save}
        ></NavButtons>
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
            <Button onClick={cancelAssessmentSelector}>Cancel</Button>

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
