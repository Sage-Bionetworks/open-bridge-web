import {MTBHeadingH1} from '@components/widgets/Headings'
import {PrevButton} from '@components/widgets/StyledComponents'
import {useUserSessionDataState} from '@helpers/AuthContext'
import CloseIcon from '@mui/icons-material/Close'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  styled,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import AssessmentService from '@services/assessment.service'
import {useSchedule, useUpdateSchedule} from '@services/scheduleHooks'
import StudyService from '@services/study.service'
import {useStudy} from '@services/studyHooks'
import {poppinsFont} from '@style/theme'
import {StudySession} from '@typedefs/scheduling'
import {Assessment} from '@typedefs/types'
import React, {FunctionComponent, useState} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {BuilderWrapper} from '../StudyBuilder'
import AssessmentSelector from './AssessmentSelector'
import ReadOnlySessionCreator from './read-only-pages/ReadOnlySessionCreator'
import SessionActionButtons from './SessionActionButtons'
import actionsReducer, {SessionAction, Types} from './sessionActions'
import SingleSessionContainer from './SingleSessionContainer'

const sessionCardWidth = 280

const StyledSessionContainer = styled(Paper, {label: 'StyledSessionContainer'})(({theme}) => ({
  width: `${sessionCardWidth}px`,
  padding: theme.spacing(2),
  background: ' #FFFFFF',
  boxShadow: '0px 5px 14px #EAECEE',
  borderRadius: '5px',
}))

export const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    padding: theme.spacing(0, 0, 2, 0),
    gridTemplateColumns: `repeat(auto-fill,${sessionCardWidth}px)`,
    gridColumnGap: theme.spacing(8),
    gridRowGap: theme.spacing(6),
    minHeight: theme.spacing(50),
    justifyContent: 'center',
  },

  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },

  /*sessionContainer2: {
    height: '1px',
    backgroundColor: '#EAECEE',

    marginTop: theme.spacing(1),

    gridColumnStart: 1,
    gridColumnEnd: -1, ALINA CHENGED BORDER
  },*/
  actionButtons: {
    borderTop: '1px solid #EAECEE',
    //  backgroundColor: '#FFF',
    // padding: theme.spacing(2, 1),
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
  selectAssessmentsHeading: {
    marginTop: theme.spacing(3),
    textAlign: 'center',
    fontFamily: poppinsFont,
    fontStyle: 'normal',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  assessmentsContainer: {
    padding: '0px',
    overflow: 'hidden',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#5D5D5D',
    },
  },
}))

type SessionCreatorProps = {
  id: string
  children: React.ReactNode
  onShowFeedback?: Function
}

const SessionCreator: FunctionComponent<SessionCreatorProps> = ({
  id,
  children,
  onShowFeedback,
}: SessionCreatorProps) => {
  const classes = useStyles()

  const {data: schedule} = useSchedule(id)

  const {data: study, error, isLoading} = useStudy(id)

  const {mutateAsync: mutateSchedule, data} = useUpdateSchedule()

  const handleError = useErrorHandler()
  const [saveLoader, setSaveLoader] = React.useState(false)

  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>([])
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const [isAddingAssessmentToSession, setIsAddingAssessmentToSession] = useState(false)
  const [activeSession, setActiveSession] = React.useState<string | undefined>()
  const {token} = useUserSessionDataState()

  const onUpdate = async (newState: StudySession[]) => {
    const updatedSchedule = {...schedule!, sessions: newState}
    setSaveLoader(true)
    try {
      await mutateSchedule({
        studyId: id,
        schedule: updatedSchedule,
        action: 'UPDATE',
      })
    } catch (e) {
      onShowFeedback && onShowFeedback(e)
    } finally {
      setSaveLoader(false)
    }
  }

  React.useEffect(() => {
    if (schedule?.sessions) {
      setActiveSession(schedule.sessions.length > 0 ? schedule.sessions[0].guid : undefined)
    }
  }, [])

  const cancelAssessmentSelector = () => {
    setIsAssessmentDialogOpen(false)
    setSelectedAssessments([])
  }

  const sessionsUpdateFn = (action: SessionAction) => {
    if (schedule) {
      const newState = actionsReducer(schedule.sessions, action)

      onUpdate(newState)
    }
  }

  const updateAssessmentList = (sessionId: string, assessments: Assessment[]) => {
    sessionsUpdateFn({
      type: Types.UpdateAssessments,
      payload: {sessionId, assessments},
    })
  }

  const updateAssessments = async (
    sessionId: string,
    previousAssessments: Assessment[] | undefined = [],
    newAssessments: Assessment[]
  ) => {
    const assessments: Assessment[] = [...previousAssessments]

    for (let i = 0; i < newAssessments.length; i++) {
      try {
        const assessmentWithResources = await AssessmentService.getResource(newAssessments[i], token!)
        assessments.push(assessmentWithResources)
      } catch (error) {
        handleError(error)
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

  const getActiveSession = (sessions: StudySession[]): StudySession | undefined => {
    const session = sessions.find(session => session.guid === activeSession)
    return session
  }

  if (!study || !schedule) {
    return <></>
  }

  if (!StudyService.isStudyInDesign(study)) {
    return <ReadOnlySessionCreator children={children} sessions={schedule.sessions} />
  }

  if (schedule?.sessions) {
    return (
      <>
        <BuilderWrapper sectionName="Create Sessions">
          <Box className={classes.root} key="sessions">
            {schedule.sessions.map((session, index) => (
              <StyledSessionContainer key={session.guid! + '_' + index}>
                <SingleSessionContainer
                  key={session.guid}
                  sessionIndex={index}
                  studySession={session}
                  onShowAssessments={() => setIsAssessmentDialogOpen(true)}
                  onSetActiveSession={(sessionId: string) => setActiveSession(sessionId)}
                  onRemoveSession={(sessionId: string) =>
                    sessionsUpdateFn({
                      type: Types.RemoveSession,
                      payload: {sessionId},
                    })
                  }
                  onUpdateSessionName={(sessionId: string, sessionName: string) =>
                    sessionsUpdateFn({
                      type: Types.UpdateSessionName,
                      payload: {sessionId, sessionName},
                    })
                  }
                  onUpdateAssessmentList={updateAssessmentList}
                  numberOfSessions={schedule.sessions.length}></SingleSessionContainer>
              </StyledSessionContainer>
            ))}
            {/*Alina changed border <Box className={classes.sessionContainer2} />*/}
          </Box>
          <Box className={classes.actionButtons} key="actionButtons">
            <SessionActionButtons
              disabled={saveLoader}
              key={'new_session'}
              sessions={schedule.sessions}
              onAddSession={(sessions: StudySession[], assessments: Assessment[], name: string) =>
                sessionsUpdateFn({
                  type: Types.AddSession,
                  payload: {
                    name: name || 'Session' + (sessions.length + 1).toString(),
                    assessments,
                  },
                })
              }></SessionActionButtons>
            {saveLoader && <CircularProgress />}
          </Box>
        </BuilderWrapper>
        {children}
        <Dialog
          maxWidth="xl"
          fullWidth
          scroll="body"
          open={isAssessmentDialogOpen}
          onClose={cancelAssessmentSelector}
          aria-labelledby="form-dialog-title">
          {isAddingAssessmentToSession && (
            <div className={classes.addingAssessmentsBackdrop}>
              <CircularProgress size={'5rem'} color="primary" />
            </div>
          )}
          <DialogTitle>
            <MTBHeadingH1 className={classes.selectAssessmentsHeading}>
              Select assessment(s) to add to session.
            </MTBHeadingH1>
            <IconButton
              aria-label="close"
              className={classes.closeButton}
              onClick={cancelAssessmentSelector}
              size="large">
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.assessmentsContainer}>
            <AssessmentSelector
              selectedAssessments={selectedAssessments}
              onUpdateAssessments={setSelectedAssessments}
              activeSession={getActiveSession(schedule.sessions)}></AssessmentSelector>
          </DialogContent>
          {!isAddingAssessmentToSession && (
            <DialogActions>
              <PrevButton onClick={cancelAssessmentSelector} color="primary" variant="outlined">
                Cancel
              </PrevButton>

              <Button
                variant="contained"
                color="primary"
                onClick={async () => {
                  setIsAddingAssessmentToSession(true)

                  await updateAssessments(
                    getActiveSession(schedule.sessions)!.guid!,
                    getActiveSession(schedule.sessions)!.assessments,
                    selectedAssessments
                  )
                  setSelectedAssessments([])
                  setIsAddingAssessmentToSession(false)
                }}>
                {!getActiveSession(schedule.sessions) ? 'Please select group and session' : `Add to Session`}
              </Button>
            </DialogActions>
          )}
        </Dialog>
      </>
    )
  } else return <>should not happen</>
}

export default SessionCreator
