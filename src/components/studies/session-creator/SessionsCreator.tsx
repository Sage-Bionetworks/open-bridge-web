import React, { FunctionComponent, useState } from 'react'

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core'

import { Assessment, Group, StudySession } from '../../../types/types'

import GroupsEditor from './GoupsEditor'

import AssessmentSelector from './AssessmentSelector'

import actionsReducer, { Types, SessionAction } from './sessionActions'
import StudyService from '../../../services/study.service'
import TabPanel from '../../widgets/TabPanel'
import NewStudySessionContainer from './NewStudySessionContainer'
import StudySessionContainer from './StudySessionContainer'
import { useErrorHandler } from 'react-error-boundary'
import { useAsync } from '../../../helpers/AsyncHook'

const useStyles = makeStyles({
  root: {},
  bookmarkedAssessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
  /* groupTab: {
    display: 'grid',
    gridTemplateColumns: 'repeat( auto-fill, minmax(250px, 1fr) )',
    gridAutoRows: 'minMax(310px, auto)',
    gridGap: '20px',
  },*/
})

type SessionsCreatorProps = {
  //studyGroups?: Group[]
  // id?: string
  studySessions: StudySession[]
}

const SessionsCreator: FunctionComponent<SessionsCreatorProps> = ({
  //studyGroups,
  //id,
  studySessions,
}: SessionsCreatorProps) => {
  const classes = useStyles()
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const groupsUpdateFn = (action: SessionAction) => {
    setData(actionsReducer(sessions!, action))
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

  const updateAssessmentList = (sessionId: string, assessments: Assessment[]) =>
    groupsUpdateFn({
      type: Types.UpdateAssessments,
      payload: { sessionId, assessments },
    })

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
        >
          {sessions.map(session => (
            <Box
              width="280px"
              height="511px"
              border="1px solid black"
              bgcolor="#d5e5ec"
            >
              <StudySessionContainer
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
              ></StudySessionContainer>
            </Box>
          ))}
          <Box
            width="280px"
            height="511px"
            border="1px solid black"
            bgcolor="#d5e5ec"
          >
            <NewStudySessionContainer
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
            ></NewStudySessionContainer>
          </Box>
        </Box>

        <Dialog
          open={isAssessmentDialogOpen}
          onClose={() => setIsAssessmentDialogOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <AssessmentSelector
              selectedAssessments={selectedAssessments}
              onUpdateAssessments={setSelectedAssessments}
              activeSession={getActiveSession(sessions!)}
            ></AssessmentSelector>
          </DialogContent>
          <DialogActions>
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
                : `Add Selected to  ${getActiveSession(sessions)?.name} `}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  } else return <>should not happen</>
}

export default SessionsCreator
