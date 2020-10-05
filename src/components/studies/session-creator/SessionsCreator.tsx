import React, { FunctionComponent, useState } from 'react'

import { Dialog, DialogContent, makeStyles } from '@material-ui/core'

import {Assessment } from '../../../types/types'


import GroupsEditor from './GoupsEditor'

import AssessmentSelector from './AssessmentSelector'

import {

  Types,
  useStudySessionsDispatch,
  useStudySessionsState,
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

  const groups = useStudySessionsState()

  const [isAssessmentDialogOpen, setIsAssessmentDialogOpen] = useState(false)

  const classes = useStyles()
  const groupsUpdateFn = useStudySessionsDispatch()
  const onUpdateAssessments = (sessionId: string, assessments: Assessment[])=> {
    groupsUpdateFn({
      type: Types.UpdateAssessments,
      payload: {
        sessionId,
        assessments}
    })
    setIsAssessmentDialogOpen(false)
  }

  return (
    <div>
      <GroupsEditor groups = {groups}
        onShowAssessmentsFn={() => setIsAssessmentDialogOpen(true)}
      ></GroupsEditor>
      <Dialog
        open={isAssessmentDialogOpen}
        onClose={() => setIsAssessmentDialogOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogContent>
          <AssessmentSelector
            onUpdateAssessments={onUpdateAssessments}
            activeGroup={groups.find(group => group.active)!}
          ></AssessmentSelector>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SessionsCreator
