import React, {
  FunctionComponent,
  useState,

} from 'react'

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core'

import {
  Assessment,
  Group,
  StudySession,
} from '../../../types/types'

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
  groupTab: {
    display: 'grid',
    gridTemplateColumns: 'repeat( auto-fill, minmax(250px, 1fr) )',
    gridAutoRows: 'minMax(310px, auto)',
    gridGap: '20px',
  },
})

type SessionsCreatorProps = {
  studyGroups?: Group[]
  id?: string
}

const SessionsCreator: FunctionComponent<SessionsCreatorProps> = ({
  studyGroups,
  id,
}: SessionsCreatorProps) => {
  const classes = useStyles()
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const groupsUpdateFn = (action: SessionAction) => {
    setData(actionsReducer(groups!, action))
  }

  const { data: groups, status, error, run, setData } = useAsync<Group[]>({
    status: id ? 'PENDING' : 'IDLE',
    data: studyGroups || [],
  })

  const handleError = useErrorHandler()

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudy(id).then(study => {
      if (!study) {
        throw new Error("what are you thinking?")
      }
      return study!.groups}))
  }, [id, run])

  if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'PENDING') {
    return <>...loading</>
  }

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

  const getActiveGroupAndSession = (
    groups: Group[],
  ): { group: Group; session: StudySession | undefined } => {
    const group = groups.find(group => group.active)!
    const session = group?.sessions?.find(session => session.active)
    return { group, session }
  }

  if (groups) {
    return (
      <div>
        <GroupsEditor
          groups={groups}
          onAddGroup={() =>
            groupsUpdateFn({
              type: Types.AddGroup,
              payload: { isMakeActive: false },
            })
          }
          onRemoveGroup={(id: string) => {
            groupsUpdateFn({
              type: Types.RemoveGroup,
              payload: { id },
            })
          }}
          onSetActiveGroup={(id: string) => {
            groupsUpdateFn({
              type: Types.SetActiveGroup,
              payload: { id },
            })
          }}
          onRenameGroup={(id: string, name: string) => {
            groupsUpdateFn({
              type: Types.RenameGroup,
              payload: { id, name },
            })
          }}
          onCopyGroup={() =>
            groupsUpdateFn({
              type: Types.AddGroup,
              payload: {
                group: groups[groups!.length - 1],
                isMakeActive: false,
              },
            })
          }
        >
          {groups.map((group, index) => (
            <TabPanel
              value={groups.findIndex(group => group.active)}
              index={index}
              key={group.id}
            >
              <div className={classes.groupTab}>
                {group.sessions.map(session => (
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
                    onUpdateSessionName={(
                      sessionId: string,
                      sessionName: string,
                    ) =>
                      groupsUpdateFn({
                        type: Types.UpdateSessionName,
                        payload: { sessionId, sessionName },
                      })
                    }
                    onUpdateAssessmentList={updateAssessmentList}
                  ></StudySessionContainer>
                ))}

                <NewStudySessionContainer
                  key={'new_session'}
                  sessions={group.sessions}
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
              </div>
            </TabPanel>
          ))}
        </GroupsEditor>
        <Dialog
          open={isAssessmentDialogOpen}
          onClose={() => setIsAssessmentDialogOpen(false)}
          aria-labelledby="form-dialog-title"
        >
          <DialogContent>
            <AssessmentSelector
              selectedAssessments={selectedAssessments}
              onUpdateAssessments={setSelectedAssessments}
              active={getActiveGroupAndSession(groups)}
            ></AssessmentSelector>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              onClick={() => {
                updateAssessments(
                  getActiveGroupAndSession(groups)!.session!.id,
                  [
                    ...getActiveGroupAndSession(groups)!.session!.assessments,
                    ...selectedAssessments,
                  ],
                )
                setSelectedAssessments([])
              }}
            >
              {!getActiveGroupAndSession(groups).session
                ? 'Please select group and session'
                : `Add Selected to ${
                    getActiveGroupAndSession(groups)?.group?.name
                  } ${getActiveGroupAndSession(groups)?.session?.name} `}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    )
  } else return <>should not happen</>
}

export default SessionsCreator
