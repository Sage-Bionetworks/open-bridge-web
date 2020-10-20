import React, { FunctionComponent} from 'react'

import { makeStyles } from '@material-ui/core'

import TabsMtb from '../../widgets/TabsMtb'

import { Group } from '../../../types/types'


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

const GroupsEditor: FunctionComponent<GroupsEditorProps> =React.memo( ({
  groups,
  onAddGroup,
  onCopyGroup,
  onRemoveGroup,
  onSetActiveGroup,
  onRenameGroup,

  children,
}: GroupsEditorProps) => {
  //const [groupTabIndex, setGroupTabIndex] = useState(0)

  const classes = useStyles()
 
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
          value={groups.findIndex(item => item.active === true)}
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
})

export default GroupsEditor
