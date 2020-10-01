import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'

import { Assessment, Group } from '../../../types/types'
import StudySessionContainer from './StudySessionContainer'
import clsx from 'clsx'

import { DragDropContext } from 'react-beautiful-dnd'
import NewStudySessionContainer from './NewStudySessionContainer'

const useStyles = makeStyles({
  root: {},
  bookmarkedAssessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
})

type GroupsEditorProps = {
  groups: Group[]
  onAddGroup: Function
  onSetActiveGroup: Function
  onAddSession: Function
  onSetActiveSession: Function
  onRearrangeAssessments: Function
}

const GroupsEditor: FunctionComponent<GroupsEditorProps> = ({
  groups,
  onAddGroup,
  onSetActiveGroup,
  onSetActiveSession,
  onAddSession,
  onRearrangeAssessments
}: GroupsEditorProps) => {
  const [groupTabIndex, setGroupTabIndex] = useState(0)

  const classes = useStyles()

  const handleGroupChange = (groupIndex: number) => {
    if (groupIndex === groups.length) {
      onAddGroup(Date.now().toString(), true)
    } else {
      onSetActiveGroup(groups[groupIndex].id)
    }
    setGroupTabIndex(groupIndex)
  }

  return (
    <div>
      <div className="sessionTabs">
        <TabsMtb
          value={groupTabIndex}
          handleChange={(val: number) => {
            handleGroupChange(val)
          }}
          tabLabels={groups.map(group => group.name)}
          addNewLabel="+"
          menuItems={[
            { label: 'Add Group', fn: onAddGroup },
            { label: 'Copy Group', fn: onAddGroup },
          ]}
        ></TabsMtb>
        {groups.map((group, index) => (
          <TabPanel value={groupTabIndex} index={index} key={index}>
          
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
                    onSetActiveSession={() => onSetActiveSession(session.id)}
                    onRearrangeAssessments={onRearrangeAssessments}
                  ></StudySessionContainer>
                ))}
                <NewStudySessionContainer
                  onAddSession={() =>
                    onAddSession(
                      group.sessions.length.toString(),
                      'Session' + group.sessions.length.toString(),
                      group.id,
                    )
                  }
                ></NewStudySessionContainer>
              </div>
        
          </TabPanel>
        ))}
      </div>
    </div>
  )
}

export default GroupsEditor
