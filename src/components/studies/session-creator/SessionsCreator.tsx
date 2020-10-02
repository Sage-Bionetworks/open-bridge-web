import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import useAssessments from '../../../helpers/hooks'
import { Group, Assessment } from '../../../types/types'

import clsx from 'clsx'
import GroupsEditor from './GoupsEditor'

import AssessmentSelector from './AssessmentSelector'
import { group } from 'console'

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
      prev.map(group => {
        if (group.id !== id) {
          if (group.active) {
            group.sessions.forEach(session => (session.active = false))
            group.active = false
          }
          return group
        } else {
          console.log('setting group to active')
          group.active = true
          if (group.sessions?.length > 0) {
            group.sessions[0].active = true
          }
          return group
        }
      }),
    )
  }

  const setActiveSession = (id: string) => {
    setGroups(prev =>
      prev.map(group => {
        if (group.active) {
          group.sessions = group.sessions.map(session => ({
            ...session,
            active: session.id === id,
          }))
        }
        return group
      }),
    )
  }

  /*const getActiveGroupSessions = () =>
    groups.find(group => group.active)?.sessions*/

  const addSession = (
    sessionId: string,
    sessionName: string,
    groupId: string,
    assessments: Assessment[] = [],
  ) => {
    const updatedGroups = groups.map(group => {
      if (group.id !== groupId) {
        return group
      }
      group.sessions = [
        ...group.sessions.map(session => ({ ...session, active: false })),
        {
          id: sessionId,
          name: sessionName,
          active: true,
          duration: 0,
          assessments: [...assessments],
        },
      ]
      return group
    })
    setGroups(updatedGroups)
  }

  /*const addAssessment = (
    groupId: string,
    sessionId: string,
    new_assessments: Assessment[],
  ) => {
    const updatedGroups = groups.map(group => {
      if (group.id !== groupId) {
        return group
      }
      const sessions = group.sessions.map(session => {
        if (session.id !== sessionId) {
          return session
        }
        const assessments = [...session.assessments, ...new_assessments]

        return { ...session, assessments }
      })
      group.sessions = [...sessions]
      return group
    })
    console.log(updatedGroups)
    setGroups(updatedGroups)
  }*/

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

  const removeSession = (sessionId: string)=> {
    const updatedGroups = groups.map(group => {
      if (!group.active) {
        return group
      }
      const sessions = group.sessions.filter(session => session.id !== sessionId)
      group.sessions = [...sessions]
      return group
    })
    setGroups(updatedGroups)

  }

  const updateAssessments = (sessionId: string, assessments1: Assessment[]) => {
    console.log('rearranging' + assessments1)
    const updatedGroups = groups.map(group => {
      if (!group.active) {
        return group
      }
      const sessions = group.sessions.map(session => {
        if (session.id !== sessionId) {
          return session
        } else {
          return { ...session, assessments: assessments1 }
        }
      })
      group.sessions = [...sessions]
      return group
    })
    setGroups(updatedGroups)
  }

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
        onUpdateAssessments={updateAssessments}
        /* onAddAssessment={(
          groupId: string,
          sessionId: string,
          a: Assessment[],
        ) => addAssessment(groupId, sessionId, a)}*/
      ></AssessmentSelector>

      <div>----------+----------</div>

      <GroupsEditor
        groups={groups}
        onSetActiveGroup={setActiveGroup}
        onAddGroup={addGroup}
        onUpdateAssessments={updateAssessments}
        onSetActiveSession={setActiveSession}
        onAddSession={addSession}
        onRemoveSession={removeSession}
      ></GroupsEditor>
    </div>
  )
}

export default SessionsCreator
