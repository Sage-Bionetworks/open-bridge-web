import React, { FunctionComponent, useState,useReducer } from 'react'

import { Button, Dialog, DialogActions, DialogContent, makeStyles } from '@material-ui/core'

import { Assessment, Group, StudySession } from '../../../types/types'

import GroupsEditor from './GoupsEditor'

import AssessmentSelector from './AssessmentSelector'

import {
  Types,
  actionsReducer,
  defaultGroup
} from '../../../helpers/StudySessionsContext'

const useStyles = makeStyles({
  root: {},
  bookmarkedAssessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
})

type SessionsCreatorOwnProps = {}

type SessionsCreatorProps = SessionsCreatorOwnProps

const SessionsCreator: FunctionComponent<SessionsCreatorProps> = () => {
  //const groups = useStudySessionsState()
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [groups, groupsUpdateFn] = useReducer(actionsReducer, [defaultGroup])

  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const classes = useStyles()
  //const groupsUpdateFn = useStudySessionsDispatch()

  const addGroup = () => {
    groupsUpdateFn({
      type: Types.AddGroup,
      payload: { isMakeActive: false },
    })
  }

  const setActiveGroup = (id: string) => {
    groupsUpdateFn({
      type: Types.SetActiveGroup,
      payload: { id}
    })
  }

  const renameGroup=(id: string, name: string) => {
    console.log('RENAMING')
    groupsUpdateFn({
      type: Types.RenameGroup,
      payload: { id, name}
    })
  }

  const removeGroup = (id: string) => {

    groupsUpdateFn({
      type: Types.RemoveGroup,
      payload: { id},
    })


  }

  const addSession = (sessions: StudySession[], assessments: Assessment[]) => {
    groupsUpdateFn({
      type: Types.AddSession,
      payload: {
        name: 'Session' + sessions.length.toString(),
        assessments,

        active: true,
      },
    })
  }

  const removeSession = (sessionId: string) =>
    groupsUpdateFn({ type: Types.RemoveSession, payload: { sessionId } })

  const setActiveSession = (sessionId: string) =>
    groupsUpdateFn({ type: Types.SetActiveSession, payload: { sessionId } })


  const updateSessionName = (sessionId: string, sessionName: string) => groupsUpdateFn({ type: Types.UpdateSessionName, payload: { sessionId, sessionName } })


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

  const getActiveGroupAndSession = (groups: Group[]): {group: Group, session: StudySession | undefined} => {
    const group = groups.find(group => group.active)!
    const session = group?.sessions?.find(session=> session.active)
    return {group, session}
           
  }

  return (
    <div>
      <GroupsEditor
        groups={groups}
        onShowAssessments={() => setIsAssessmentDialogOpen(true)}
        onAddGroup={addGroup}
        onRemoveGroup={removeGroup}
        onSetActiveGroup={setActiveGroup}
        onAddSession={addSession}
        onRemoveSession={removeSession}
        onSetActiveSession={setActiveSession}
        onUpdateSessionName = {updateSessionName}
        onUpdateAssessmentList={updateAssessmentList}
        onRenameGroup={renameGroup}
      ></GroupsEditor>
      <Dialog
        open={isAssessmentDialogOpen}
        onClose={() => setIsAssessmentDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AssessmentSelector
          selectedAssessments = {selectedAssessments}
            onUpdateAssessments={setSelectedAssessments}
            active = {getActiveGroupAndSession(groups)}
          ></AssessmentSelector>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" 
           onClick={() => {
         
            updateAssessments(getActiveGroupAndSession(groups)!.session!.id, [
              ...getActiveGroupAndSession(groups)!.session!.assessments,
              ...selectedAssessments,
            ],)
            setSelectedAssessments([])
          
          }}>

           {! getActiveGroupAndSession(groups).session
            ? 'Please select group and session'
            : `Add Selected to ${getActiveGroupAndSession(groups)?.group?.name} ${getActiveGroupAndSession(groups)?.session?.name} `}
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SessionsCreator
