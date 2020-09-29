import React, { FunctionComponent, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment } from '../../../types/types'

import clsx from 'clsx'
import AddableAssessmentClick from './AddableAssessmentClick'
import GroupsEditor from './GoupsEditor'
import {ToggleButtonGroup, ToggleButton} from '@material-ui/lab'
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const useStyles = makeStyles({
  root: {},
  bookmarkedAssessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
  ToggleA: {
    position: 'relative'

  },

  Overlay: {
    position: 'absolute',
    bottom: '0',

    //background: 'rgba(0, 0, 0, 0.5)', /* Black see-through */

    width: '100%',
    transition: '.5s ease',
    height: '100%',
    opacity:'0',
    color: 'white',
    display: 'flex', // make us of Flexbox
    alignItems: 'center', // does vertically center the desired content
    justifyContent: 'center', // horizontally centers single line items
    textClign: 'center', // optional, but helps horizontally center text that breaks into multiple lines
  
    padding: '20px',
 

  },

  ToggleASelected: {
    border: '2px solid blue',
  
    '& $Overlay': {
        opacity: 1
  
    }

  },

 
})



type AssessmentSelectorClickProps ={
    groups: Group[]
    onAddAssessment: Function
  
}

const AssessmentSelectorClick: FunctionComponent<AssessmentSelectorClickProps> = ({groups, onAddAssessment}: AssessmentSelectorClickProps) => {
  const assessments = useAssessments()
  const [assessmentTabIndex, setAssessmentTabIndex] = useState(0)
  const [groupTabIndex, setGroupTabIndex] = useState(0)
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>([])



  const classes = useStyles()

  const getActiveGroupSessions = () =>
    groups.find(group => group.active)?.sessions

    const handleFormat = (event: React.MouseEvent<HTMLElement>, newFormats: Assessment[]) => {
      setSelectedAssessments(newFormats);
    };


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
                <ToggleButtonGroup value={selectedAssessments} onChange={handleFormat} aria-label="text formatting">
                <ToggleButton  aria-label="bold" value={a} classes={{root: classes.ToggleA, selected: classes.ToggleASelected}}>
                  <AssessmentCard
                    index={index}
                    assessment={a}
                    key={index}
                  ></AssessmentCard>
                   <div className={classes.Overlay}>
                   <CheckCircleIcon  color={'primary'} style={{backgroundColor: '#fff'}}></CheckCircleIcon>
                   </div>
             
  
                  </ToggleButton> 
                 </ToggleButtonGroup>
              ))}
          </div>
          <Button onClick={()=>onAddAssessment(groups[groupTabIndex].id, 'x', selectedAssessments)}>Add Selected</Button>
        </TabPanel>

        <TabPanel value={assessmentTabIndex} index={1}>
          <div
            className={clsx(
              'assesmentContainer',
              classes.bookmarkedAssessments,
            )}
          >
            {assessments.map((a, index) => (
              <AddableAssessmentClick
                key={index + 'b'}
                onAddFn={(sessionId: string) =>
                  onAddAssessment(groups[groupTabIndex].id, sessionId, a)
                }
                sessions={getActiveGroupSessions() || []}
              >
                <AssessmentCard
                  index={index}
                  assessment={a}
                  key={index + 'b'}
                ></AssessmentCard>
              </AddableAssessmentClick>
            ))}
          </div>
        </TabPanel>
      </div>

   
    </div>
  )
}

export default AssessmentSelectorClick
