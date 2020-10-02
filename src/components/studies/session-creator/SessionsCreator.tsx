import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import useAssessments from '../../../helpers/hooks'
import { Group, Assessment } from '../../../types/types'

import clsx from 'clsx'
import GroupsEditor from './GoupsEditor'

import AssessmentSelector from './AssessmentSelector'
import { group } from 'console'
import {
  StudySessionsProvider,
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
  const assessments = useAssessments()
  const [assessmentTabIndex, setAssessmentTabIndex] = useState(0)
  const [groupTabIndex, setGroupTabIndex] = useState(0)
  const groups = useStudySessionsState()
  const defaultGroup: Group = {
    id: '123',
    name: 'Group1',
    active: true,
    sessions: [
      {
        id: '123',
        name: 'Baseline Survey',
        duration: 30,
        active: true,
        assessments: [
          {
            id: '0',
            img: 'string1',
            type: 'string1',
            title: 'Memory for Sequences',
            duration: '5',
            description:
              ' Assesses working memory or capacity to process information across a series of tasks and modalities',
            validation: 'true',
            study_number: '45',
          },
        ],
      },
    ],
  }
  const classes = useStyles()

  return (
    <div>
      {'activeGroup: ' +
        groups.find(group => group.active == true)?.name +
        ' active session ' +
        groups
          .find(group => group.active == true)
          ?.sessions.find(session => session.active)?.name}
      <AssessmentSelector
        activeGroup={groups.find(group => group.active)!}
      ></AssessmentSelector>

      <div>----------+----------</div>

      <GroupsEditor></GroupsEditor>
    </div>
  )
}

export default SessionsCreator
