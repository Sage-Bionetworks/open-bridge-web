import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'

import { Group } from '../../../types/types'
import StudySessionContainer from './StudySessionContainer'

import NewStudySessionContainer from './NewStudySessionContainer'

import Button from '@material-ui/core/Button/Button'
import { FormatListBulletedOutlined } from '@material-ui/icons'

const useStyles = makeStyles({
  root: {
    display: 'grid',
   minHeight: '310px',
    padding: '20px',
    backgroundColor: '#E2E2E2',
    gridTemplateColumns: 'repeat( auto-fill, minmax(250px, 1fr) )',
    gridAutoRows: 'minMax(310px, auto)',
    gridGap: '10px',
  },
})

type GroupsEditorProps = {
  onShowAssessments: Function
  onAddGroup: Function
  onRemoveGroup: Function
  onSetActiveGroup: Function
  groups: Group[]
  onAddSession: Function
  onUpdateSessionName: Function
  onRemoveSession: Function
  onSetActiveSession: Function
  onUpdateAssessmentList: Function
  onRenameGroup: Function
}

const GroupsEditor: FunctionComponent<GroupsEditorProps> = ({
  onShowAssessments,
  groups,
  onAddGroup,
  onRemoveGroup,
  onSetActiveGroup,
  onAddSession,
  onRemoveSession,
  onSetActiveSession,
  onRenameGroup,
  onUpdateSessionName,
  onUpdateAssessmentList,
}: GroupsEditorProps) => {
  const [groupTabIndex, setGroupTabIndex] = useState(0)

  const classes = useStyles()


  useEffect(() => {
    let activeIndex = groups.findIndex(item => item.active === true)
    if (activeIndex === -1) {
      activeIndex = 0
    }
    setGroupTabIndex(activeIndex)
  }, [groups])

  const handleGroupChange = (groupIndex: number) => {
    if (groupIndex !== groups.length) {
      onSetActiveGroup(groups[groupIndex].id)
    }
  }

  const getTabDataObjects = (): { label: string; id: string }[] => {
    const result = groups.map(group => ({ label: group.name, id: group.id }))
    return result
  }

  return (
    <div>
      <div className="sessionTabs">
        <TabsMtb
          value={groupTabIndex}
          handleChange={(val: number) => {
            handleGroupChange(val)
          }}
          tabDataObjects={getTabDataObjects()}
          addNewLabel="+"
          onDelete={onRemoveGroup}
          onRenameTab={onRenameGroup}
          menuItems={[
            { label: 'Add Group', fn: onAddGroup },
            { label: 'Copy Group', fn: onAddGroup },
          ]}
        ></TabsMtb>

        {groups.map((group, index) => (
          <TabPanel value={groupTabIndex} index={index} key={group.id}>
            <div
       
              className={classes.root}
       
            >
              {group.sessions.map((session) => (
                <StudySessionContainer
                  key={session.id}
                  studySession={session}
                  onShowAssessments={onShowAssessments}
                  onSetActiveSession={onSetActiveSession}
                  onRemoveSession={onRemoveSession}
                  onUpdateSessionName = {onUpdateSessionName}
                  onUpdateAssessmentList={onUpdateAssessmentList}
                ></StudySessionContainer>
              ))}

              <NewStudySessionContainer
                key={'new_session'}
                sessions={group.sessions}
                onAddSession={onAddSession}
              ></NewStudySessionContainer>
            </div>
          </TabPanel>
        ))}
      </div>
    </div>
  )
}

export default GroupsEditor
