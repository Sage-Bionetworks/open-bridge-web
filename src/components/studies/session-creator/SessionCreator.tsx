import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Paper
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import SaveIcon from '@material-ui/icons/Save'
import React, { FunctionComponent, useState } from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import AssessmentService from '../../../services/assessment.service'
import { StudySession } from '../../../types/scheduling'
import { Assessment, StudyBuilderComponentProps } from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import { MTBHeadingH1 } from '../../widgets/Headings'
import AssessmentSelector from './AssessmentSelector'
import SessionActionButtons from './SessionActionButtons'
import actionsReducer, { SessionAction, Types } from './sessionActions'
import SingleSessionContainer from './SingleSessionContainer'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    padding: theme.spacing(2),
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
    padding: theme.spacing(2, 1),
    display: 'flex',
    justifyContent: 'space-between',
  },
  addingAssessmentsBackdrop: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F5F5F5',
    zIndex: 500,
    position: 'absolute',
    opacity: 0.7,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

type SessionCreatorProps = {
  id: string
  sessions: StudySession[]
  onSave: Function
}

const SessionCreator: FunctionComponent<
  SessionCreatorProps & StudyBuilderComponentProps
> = ({
  sessions,
  id,
  onUpdate,
  hasObjectChanged,
  saveLoader,
  children,
  onSave,
}: SessionCreatorProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const [
    isAddingAssessmentToSession,
    setIsAddingAssessmentToSession,
  ] = useState(false)
  const [activeSession, setActiveSession] = React.useState(
    sessions.length > 0 ? sessions[0].guid : undefined,
  )

  const sessionsUpdateFn = (action: SessionAction) => {
    const newState = actionsReducer(sessions, action)
    onUpdate(newState)
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

  const updateAssessments = async (
    sessionId: string,
    previousAssessments: Assessment[] | undefined = [],
    newAssessments: Assessment[],
  ) => {
    console.log('updating')
    const assessments: Assessment[] = [...previousAssessments]
    for (let i = 0; i < newAssessments.length; i++) {
      try {
        const assessmentWithResources = await AssessmentService.getResource(
          newAssessments[i],
        )
        assessments.push(assessmentWithResources)
      } catch (error) {
        console.log('error', error.message)
      }
    }
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
    const session = sessions.find(session => session.guid === activeSession)
    return session
  }

  if (sessions) {
    return (
      <>
        <NavigationPrompt when={hasObjectChanged} key="nav_prompt">
          {({ onConfirm, onCancel }) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
        {hasObjectChanged && !saveLoader && (
          <Button
            variant="contained"
            color="primary"
            key="saveButton"
            style={{ marginBottom: '32px' }}
            onClick={() => onSave()}
            startIcon={<SaveIcon />}
          >
            Save changes
          </Button>
        )}
        <Box className={classes.root} key="sessions">
          {sessions.map((session, index) => (
            <Paper
              className={classes.sessionContainer}
              key={session.guid + index}
            >
              <SingleSessionContainer
                key={session.guid}
                sessionIndex={index}
                studySession={session}
                onShowAssessments={() => setIsAssessmentDialogOpen(true)}
                onSetActiveSession={(sessionId: string) =>
                  setActiveSession(sessionId)
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
                },
              })
            }
          ></SessionActionButtons>
        </Box>
        {children}
        <Dialog
          maxWidth="lg"
          open={isAssessmentDialogOpen}
          onClose={cancelAssessmentSelector}
          aria-labelledby="form-dialog-title"
        >
          {isAddingAssessmentToSession && (
            <div className={classes.addingAssessmentsBackdrop}>
              <CircularProgress size={'5rem'} color="primary" />
            </div>
          )}
          <DialogTitle>
            <MTBHeadingH1 style={{marginTop: '32px', textAlign: 'center'}}>Select assessment(s) to add to session.</MTBHeadingH1>
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
              activeSession={getActiveSession(sessions)}
            ></AssessmentSelector>
          </DialogContent>
          {!isAddingAssessmentToSession && (
            <DialogActions>
              <Button onClick={cancelAssessmentSelector} color="secondary"  variant="outlined">Cancel</Button>

              <Button
                variant="contained"
                color = "primary"
                onClick={async () => {
                  setIsAddingAssessmentToSession(true)

                  await updateAssessments(
                    getActiveSession(sessions)!.guid,
                    getActiveSession(sessions)!.assessments,
                    selectedAssessments,
                  )
                  setSelectedAssessments([])
                  setIsAddingAssessmentToSession(false)
                }}
              >
                {!getActiveSession(sessions)
                  ? 'Please select group and session'
                  : `Add  to Session`}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </>
    )
  } else return <>should not happen</>
}

export default SessionCreator
