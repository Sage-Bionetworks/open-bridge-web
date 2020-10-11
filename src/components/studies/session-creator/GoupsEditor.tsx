import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'

import { Group } from '../../../types/types'
import StudySessionContainer from './StudySessionContainer'

import NewStudySessionContainer from './NewStudySessionContainer'

import Button from '@material-ui/core/Button/Button'
import { FormatListBulletedOutlined } from '@material-ui/icons'

const useStyles = makeStyles({})

type GroupsEditorProps = {
  onAddGroup: Function
  onCopyGroup: Function
  onRemoveGroup: Function
  onSetActiveGroup: Function
  groups: Group[]
  onRenameGroup: Function
  children: React.ReactNode
}

const GroupsEditor: FunctionComponent<GroupsEditorProps> = ({
  groups,
  onAddGroup,
  onCopyGroup,
  onRemoveGroup,
  onSetActiveGroup,

  onRenameGroup,

  children,
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

      <div >
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
            { label: 'Copy Previous Group', fn: onCopyGroup },
          ]}
        ></TabsMtb>

        {children}
      </div>
  )
}

export default GroupsEditor
