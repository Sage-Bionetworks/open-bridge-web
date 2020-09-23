import React, { FunctionComponent, useState } from 'react'

import { Tabs, Tab, makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment } from '../../../types/types'
import StudySessionContainer from './StudySessionContainer'
import clsx from 'clsx'
import AddableAssessment from './AddableAssessment'
import { DragDropContext } from 'react-beautiful-dnd'

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
      { id, active: false, name: `Group ${groups.length+1}`, sessions: [] },
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

  const handleGroupChange = (groupIndex: number) => {
    if (groupIndex === groups.length) {
      addGroup(Date.now().toString(), true)
    } else {
      setActiveGroup(groups[groupIndex].id)
    }
    setGroupTabIndex(groupIndex)
  }

  const getActiveGroupSessions = () =>  groups.find(group => group.active)?.sessions 


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
      <div className="assessmentTabs">
        <TabsMtb
          value={assessmentTabIndex}
          handleChange={(val: number) => setAssessmentTabIndex(val)}
          tabLabels={['Bookmarked Assessment', 'Assessment Library']}
        ></TabsMtb>

        <TabPanel value={assessmentTabIndex} index={0}>
          <div
            className={clsx(
              'assesmentContainer',
              classes.bookmarkedAssessments,
            )}
          >
            {assessments
              .filter(a => a.bookmarked)
              .map((a, index) => (
                <AddableAssessment
                  key={index + 'a'}
                  onAddFn={(sessionId: string) =>
                    addAssessment(groups[groupTabIndex].id, sessionId, a)
                  }
                  sessions={getActiveGroupSessions() || []}
                >
                  <AssessmentCard
                    index={index}
                    assessment={a}
                    key={index}
                  ></AssessmentCard>
                </AddableAssessment>
              ))}
          </div>
        </TabPanel>

        <TabPanel value={assessmentTabIndex} index={1}>
          <div
            className={clsx(
              'assesmentContainer',
              classes.bookmarkedAssessments,
            )}
          >
            {assessments.map((a, index) => (
              <AssessmentCard
                index={index}
                assessment={a}
                key={index + 'b'}
              ></AssessmentCard>
            ))}
          </div>
        </TabPanel>
      </div>

      <div>--------------------</div>

      <div className="sessionTabs">
        <TabsMtb
          value={groupTabIndex}
          handleChange={(val: number) => {
            handleGroupChange(val)
          }}
          tabLabels={groups.map(group => group.name)}
          addNewLabel="+"
        ></TabsMtb>
        {groups.map((group, index) => (
          <TabPanel value={groupTabIndex} index={index} key={index}>
            <DragDropContext
              onDragEnd={(something: any) =>
                /*this.onDragEnd*/ console.log(something)
              }
            >
              <div
                style={{ minHeight: '300px' }}
                className={clsx(
                  'assesmentContainer',
                  classes.bookmarkedAssessments,
                )}
              >
                {group.sessions.map((session, index) => (
                  <StudySessionContainer
                    key={index}
                    studySession={session}
                  ></StudySessionContainer>
                ))}
                <StudySessionContainer
                  onAddSession={() =>
                    addSession(
                      group.sessions.length.toString(),
                      'Session' + group.sessions.length.toString(),
                      group.id,
                    )
                  }
                ></StudySessionContainer>
              </div>
            </DragDropContext>
          </TabPanel>
        ))}
      </div>
    </div>
  )
}

export default SessionsCreator
