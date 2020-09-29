import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment } from '../../../types/types'

import clsx from 'clsx'
import AddableAssessment from './AddableAssessment'
import GroupsEditor from './GoupsEditor'
import AssessmentSelector from './AssessmentSelector'
import AssessmentSelectorClick from './AssessmentSelector.Click'

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

  const defaultGroup: Group = {
    id: '123',
    name: 'Group1',
    active: true,
    sessions: [
      {
        id: '123',
        name: 'Baseline Survey',
        duration: 30,
        assessments: [
          {
            id: 'sdgasg',
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

  const [groups, setGroups] = useState<Group[]>([defaultGroup])
  const classes = useStyles()

  const addGroup = (id: string, isMakeActive?: boolean) => {
    let newGroups = [
      ...groups,
      { id, active: false, name: `Group ${groups.length + 1}`, sessions: [] },
    ]
    if (isMakeActive) {
      newGroups = newGroups.map(group => ({
        ...group,
        active: group.id === id,
      }))
    }
    setGroups(prev => newGroups)
  }

  const setActiveGroup = (id: string) => {
    setGroups(prev =>
      prev.map(group => ({ ...group, active: group.id === id })),
    )
  }

  const getActiveGroupSessions = () =>
    groups.find(group => group.active)?.sessions

  const addSession = (
    sessionId: string,
    sessionName: string,
    groupId: string,
  ) => {
    const updatedGroups = groups.map(group => {
      if (group.id !== groupId) {
        return group
      }
      group.sessions = [
        ...group.sessions,
        {
          id: sessionId,
          name: sessionName,
          active: true,
          duration: 0,
          assessments: [],
        },
      ]
      return group
    })
    setGroups(updatedGroups)
  }

  const addAssessment = (
    groupId: string,
    sessionId: string,
    assessment: Assessment,
  ) => {
    const updatedGroups = groups.map(group => {
      if (group.id !== groupId) {
        return group
      }
      const sessions = group.sessions.map(session => {
        if (session.id !== sessionId) {
          return session
        }
        const assessments = [...session.assessments]
        assessments.push(assessment)
        return { ...session, assessments }
      })
      group.sessions = [...sessions]
      return group
    })
    console.log(updatedGroups)
    setGroups(updatedGroups)
  }

  const removeAssessment = (
    groupId: string,
    sessionId: string,
    assessment: Assessment,
  ) => {
    const updatedGroups = groups.map(group => {
      if (group.id !== groupId) {
        return group
      }
      const sessions = group.sessions.map(session => {
        if (session.id !== sessionId) {
          return session
        }
        const assessments = session.assessments.filter(
          item => item.id !== assessment.id,
        )

        return { ...session, assessments }
      })
      group.sessions = [...sessions]
      return group
    })
    setGroups(updatedGroups)
  }

  return (
    <div>
      <AssessmentSelector
        groups={groups}
        onAddAssessment={(groupId: string, sessionId: string, a: Assessment) =>
          addAssessment(groupId, sessionId, a)
        }
      ></AssessmentSelector>

      <AssessmentSelectorClick
        groups={groups}
        onAddAssessment={(groupId: string, sessionId: string, a: Assessment) =>
          addAssessment(groupId, sessionId, a)
        }
      ></AssessmentSelectorClick>

      <div>----------+----------</div>

      <GroupsEditor
        groups={groups}
        onSetActiveGroup={(groupId: string) => setActiveGroup(groupId)}
        onAddGroup={(id: string, isActive: boolean) => addGroup(id, isActive)}
        onAddSession={(
          sessionId: string,
          sessionName: string,
          groupId: string,
        ) => addSession(sessionId, sessionName, groupId)}
      ></GroupsEditor>
    </div>
  )
}

export default SessionsCreator
