import React, { FunctionComponent, useEffect, useRef, useState } from 'react'

import {
  Dialog,
  DialogContent,
  GridList,
  GridListTile,
  makeStyles,
} from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'

import { Assessment, Group, StudySession } from '../../../types/types'
import StudySessionContainer from './StudySessionContainer'
import clsx from 'clsx'

import { DragDropContext } from 'react-beautiful-dnd'
import NewStudySessionContainer from './NewStudySessionContainer'

import Button from '@material-ui/core/Button/Button'
import { FormatListBulletedOutlined } from '@material-ui/icons'
import AssessmentSelector from './AssessmentSelector'

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    position: 'relative',

    overflowX: 'scroll',
    padding: '20px',
    backgroundColor: '#E2E2E2',
  },
  gridList: {
    display: 'flex',
    flexWrap: 'nowrap',
    width: '100%',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  } /*,
  arrowButton: {
    position: 'absolute',
    left: '0px',
    top: '50%',
    zIndex: 10

  }*/,
})

type GroupsEditorProps = {
  onShowAssessments: Function
  onAddGroup: Function
  onSetActiveGroup: Function
  groups: Group[]
  onAddSession: Function
  onRemoveSession: Function
  onSetActiveSession: Function
  onUpdateAssessmentList: Function
}

const GroupsEditor: FunctionComponent<GroupsEditorProps> = ({
  onShowAssessments,
  groups,
  onAddGroup,
  onSetActiveGroup,
  onAddSession,
  onRemoveSession,
  onSetActiveSession,
  onUpdateAssessmentList,
}: GroupsEditorProps) => {
  const [groupTabIndex, setGroupTabIndex] = useState(0)
  const [width, setWidth] = useState(window.innerWidth)
  const [parentWidth, setParentWidth] = useState(0)
  //const groups = useStudySessionsState()


  const classes = useStyles()
  console.log('rerender')
  const parentRef = useRef<HTMLDivElement>(null)
  const resized = (evt: any) => {
    console.log('evt' + evt)
  }

  const updateWidthAndHeight = () => {
    setWidth(window.innerWidth)
    console.log('width', window.innerWidth)
    if (parentRef?.current) {
      let parentWidth = parentRef.current.offsetWidth
      console.log('pwidth', parentWidth)
      setParentWidth(parentWidth)
    }
  }

  useEffect(() => {
   
    const activeIndex = groups.findIndex(item=> item.active === true)
    setGroupTabIndex(activeIndex)
  }, [groups])

  useEffect(() => {
    console.log('hi2')
    if (parentRef.current) {
      let parentWidth = parentRef.current.offsetWidth
      setParentWidth(parentWidth)
      console.log('parentWidth', parentWidth)
    }
  }, [parentRef])

  useEffect(() => {
    console.log('hi1')
    window.addEventListener('resize', updateWidthAndHeight)
    return () => window.removeEventListener('resize', updateWidthAndHeight)

    /*if(parentRef.current){
          
        parentRef.current.addEventListener("resize", resized);
          let parentHeight = parentRef.current.offsetHeight;
          let parentWidth  = parentRef.current.offsetWidth;
          console.log(parentWidth)
          console.log('hi2')
      }*/
  })

  const handleGroupChange = (groupIndex: number) => {
    if (groupIndex === groups.length) {
      //onAddGroup()
      //onAddGroup(Date.now().toString(), true)
    } else {
     
      onSetActiveGroup(groups[groupIndex].id)
      //onSetActiveGroup(groups[groupIndex].id)
    }
 
    //setGroupTabIndex(groupIndex)
  }

  const getCols = (numberOfSessions: number): number => {
    const result = Math.floor((numberOfSessions + 1) * 291)
    console.log(result)
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
              className={classes.root}
              ref={parentRef}
            >
              <div
                className={classes.gridList}
                style={{ width: getCols(group.sessions.length) + 'px' }}
              >
                {group.sessions.map((session, index) => (
                  <StudySessionContainer
                    key={index}
                    studySession={session}
                    onShowAssessments={onShowAssessments}
                    onSetActiveSession={onSetActiveSession}
                    onRemoveSession={onRemoveSession}
                    onUpdateAssessmentList={onUpdateAssessmentList}
                  ></StudySessionContainer>
                ))}

                <NewStudySessionContainer
                  key={group.sessions.length}
                  sessions={group.sessions}
                  onAddSession={onAddSession}
                ></NewStudySessionContainer>
              </div>
            </div>
          </TabPanel>
        ))}
      </div>
    </div>
  )
}

export default GroupsEditor
