import React, { FunctionComponent, useEffect, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment, StudySession } from '../../../types/types'

import clsx from 'clsx'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Session } from 'inspector'

const useStyles = makeStyles({
  root: { backgroundColor: '#E2E2E2', padding: '20px' },
  assessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
  ToggleA: {
    position: 'relative',
  },
  ToggleADisabled: {
    border: 'none',
    opacity: '.3',
  },
  ToggleASelected: {
    border: '2px solid blue',

    '& $Overlay': {
      opacity: 1,
    },
  },

  Overlay: {
    position: 'absolute',
    bottom: '0',

    //background: 'rgba(0, 0, 0, 0.5)', /* Black see-through */

    width: '100%',
    transition: '.5s ease',
    height: '100%',
    opacity: '0',
    color: 'white',
    display: 'flex', // make us of Flexbox
    alignItems: 'center', // does vertically center the desired content
    justifyContent: 'center', // horizontally centers single line items
    textClign: 'center', // optional, but helps horizontally center text that breaks into multiple lines

    padding: '20px',
  },
})

type AssessmentSelectorProps = {
  active: {group: Group, session: StudySession | undefined}

  onUpdateAssessments: Function
  selectedAssessments: Assessment[]
}

const AssessmentSelector: FunctionComponent<AssessmentSelectorProps> = ({
  active,
  selectedAssessments,
  onUpdateAssessments
}:
AssessmentSelectorProps) => {
  const assessments = useAssessments()
  const [assessmentTabIndex, setAssessmentTabIndex] = useState(0)
  /*const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )*/
/*  const [activeSession, setActiveSession] = useState<StudySession | undefined>(
    undefined,
  )*/


 /* useEffect(() => {
    console.log('effect')
    setActiveSession(activeGroup.sessions.find(session => session.active))
  }, [activeGroup.sessions])*/

  const classes = useStyles()

  const isAssessmentInSession = (
    session: StudySession,
    assessmentId: string,
  ): boolean =>
    session.assessments.find(item => item.id === assessmentId) !== undefined

  const toggleAssessment = (
    event: React.MouseEvent<HTMLElement>,
    selectedAssessments: Assessment[],
  ) => {
    onUpdateAssessments(selectedAssessments)
   // setSelectedAssessments(selectedAssessments)
  }

  const renderAssessmentTab = (assessments: Assessment[]): JSX.Element => {
    return (
      <div className={clsx('assesmentContainer', classes.assessments)}>
        {assessments.map((a, index) => (
          <ToggleButtonGroup
            value={selectedAssessments}
            onChange={toggleAssessment}
            aria-label={a.title}
            key={a.id}
          >
            <ToggleButton
              aria-label="bold"
              value={a}
              disabled={
                !active.session || isAssessmentInSession(active.session, a.id)
              }
              classes={{
                root: classes.ToggleA,
                selected: classes.ToggleASelected,
                disabled: classes.ToggleADisabled,
              }}
            >
              <AssessmentCard
                index={index}
                assessment={a}
                key={a.id}
              ></AssessmentCard>
              <div className={classes.Overlay}>
                <CheckCircleIcon
                  color={'primary'}
                  style={{ backgroundColor: '#fff' }}
                ></CheckCircleIcon>
              </div>
            </ToggleButton>
          </ToggleButtonGroup>
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="assessmentTabs">
      {/*  <TabsMtb
          value={assessmentTabIndex}
          handleChange={(val: number) => setAssessmentTabIndex(val)}
          tabDataObjects={[{label:'Bookmarked Assessment'}, {label: 'Assessment Library'}]}
        ></TabsMtb>

        <TabPanel value={assessmentTabIndex} index={0} key={'bkm_asmnt'}>
          {renderAssessmentTab(assessments.filter(a => a.bookmarked))}
        </TabPanel>

      <TabPanel value={assessmentTabIndex} index={1} key={'asmnt'}>*/}
          {renderAssessmentTab(assessments)}
      
     </div>
    </div>
  )
}

export default AssessmentSelector
