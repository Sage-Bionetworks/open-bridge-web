import React, {
  FunctionComponent,
  useState,
  useReducer,
  useEffect,
} from 'react'

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  makeStyles,
} from '@material-ui/core'

import {
  Assessment,
  Group,
  RequestStatus,
  StudySession,
} from '../../../types/types'

import GroupsEditor from './GoupsEditor'
import { RouteComponentProps, useParams } from 'react-router-dom'

import AssessmentSelector from './AssessmentSelector'

import {
  Types,
  actionsReducer,
  defaultGroup,
} from '../../../helpers/StudySessionsContext'
import StudyService from '../../../services/study.service'
import TabPanel from '../../widgets/TabPanel'
import NewStudySessionContainer from './NewStudySessionContainer'
import StudySessionContainer from './StudySessionContainer'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import { useSessionDataState } from '../../../helpers/AuthContext'
import LoadingComponent from '../../widgets/Loader'

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
  studyGroups: Group[]

}



const SessionsCreator: FunctionComponent<SessionsCreatorProps> = ({studyGroups}: SessionsCreatorProps) => {
  //const groups = useStudySessionsState()
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [groups, groupsUpdateFn] = useReducer(actionsReducer, studyGroups)

  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)


  const classes = useStyles()
  //const groupsUpdateFn = useStudySessionsDispatch()

 
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
                  onAddSession={ (sessions: StudySession[], assessments: Assessment[]) => 
                    groupsUpdateFn({
                      type: Types.AddSession,
                      payload: {
                        name: 'Session' + sessions.length.toString(),
                        assessments,
                        active: true,
                      },
                    })}
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
              updateAssessments(getActiveGroupAndSession(groups)!.session!.id, [
                ...getActiveGroupAndSession(groups)!.session!.assessments,
                ...selectedAssessments,
              ])
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
}

export default SessionsCreator
