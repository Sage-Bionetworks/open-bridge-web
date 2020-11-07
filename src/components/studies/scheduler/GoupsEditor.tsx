//@ts-nocheck
import React, { FunctionComponent } from 'react'

import { makeStyles } from '@material-ui/core'

import TabsMtb from '../../widgets/TabsMtb'

import { StudyArm} from '../../../types/types'

const useStyles = makeStyles({})

type StudyArmsEditorProps = {
  onAddStudyArm: Function
  onCopyStudyArm: Function
  onRemoveStudyArm: Function
  onSetActiveStudyArm: Function
  studyArms: StudyArm[]
  onRenameStudyArm: Function
  children: React.ReactNode
}

const StudyArmsEditor: FunctionComponent<StudyArmsEditorProps> = React.memo(
  ({
    studyArms,
    onAddStudyArm,
    onCopyStudyArm,
    onRemoveStudyArm,
    onSetActiveStudyArm,
    onRenameStudyArm,

    children,
  }: StudyArmsEditorProps) => {
    //const [studyArmTabIndex, setStudyArmTabIndex] = useState(0)

    const classes = useStyles()

    const handleStudyArmChange = (studyArmIndex: number) => {
      if (studyArmIndex !== studyArms.length) {
        onSetActiveStudyArm(studyArms[studyArmIndex].id)
      }
    }

    const getTabDataObjects = (): { label: string; id: string }[] => {
      const result = studyArms.map(studyArm => ({ label: studyArm.name, id: studyArm.id }))
      return result
    }

    return (
      <div>
        <TabsMtb
          value={studyArms.findIndex(item => item.active === true)}
          handleChange={(val: number) => {
            handleStudyArmChange(val)
          }}
          tabDataObjects={getTabDataObjects()}
          addNewLabel={/*"+"*/ undefined}
          onDelete={undefined /*onRemoveStudyArm*/}
          onRenameTab={onRenameStudyArm}
          menuItems={undefined /*[
            { label: 'Add StudyArm', fn: onAddStudyArm },
            { label: 'Copy Previous StudyArm', fn: onCopyStudyArm },
          ]*/}
        ></TabsMtb>

        {children}
      </div>
    )
  },
)

export default StudyArmsEditor
