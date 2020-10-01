import React, { FunctionComponent, useEffect, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment, StudySession } from '../../../types/types'

import clsx from 'clsx'
import AddableAssessmentClick from './AddableAssessment'

import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'

const useStyles = makeStyles({
  root: { backgroundColor: '#E2E2E2', padding: '20px' },
  assessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
  ToggleA: {
    position: 'relative',
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

  ToggleASelected: {
    border: '2px solid blue',

    '& $Overlay': {
      opacity: 1,
    },
  },
})

type AssessmentSelectorProps = {
  activeGroup: Group
  onAddAssessment: Function
}

const AssessmentSelector: FunctionComponent<AssessmentSelectorProps> = ({
  activeGroup,
  onAddAssessment,
}: AssessmentSelectorProps) => {
  const assessments = useAssessments()
  const [assessmentTabIndex, setAssessmentTabIndex] = useState(0)
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [activeSession, setActiveSession] = useState<StudySession | undefined>(
    undefined,
  )
  console.log('redraw')

  useEffect(() => {
    console.log('effect')
    setActiveSession(activeGroup.sessions.find(session => session.active))
  }, [activeGroup.sessions])

  const classes = useStyles()

  const toggleAssessment = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: Assessment[],
  ) => {
    setSelectedAssessments(newFormats)
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
              classes={{
                root: classes.ToggleA,
                selected: classes.ToggleASelected,
              }}
            >
              <AssessmentCard
                index={index}
                assessment={a}
                key={index}
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
        <TabsMtb
          value={assessmentTabIndex}
          handleChange={(val: number) => setAssessmentTabIndex(val)}
          tabLabels={['Bookmarked Assessment', 'Assessment Library']}
        ></TabsMtb>

        <TabPanel value={assessmentTabIndex} index={0} key={'bkm_asmnt'}>
          {renderAssessmentTab(assessments.filter(a => a.bookmarked))}
        </TabPanel>

        <TabPanel value={assessmentTabIndex} index={1} key={'asmnt'}>
          {renderAssessmentTab(assessments)}
        </TabPanel>
        <div className={classes.root}>
          <Button
            disabled={!activeSession}
            variant="contained"
            color="primary"
            onClick={() =>
              onAddAssessment(
                activeGroup.id,
                activeSession?.id,
                selectedAssessments,
              )
            }
          >
            {!activeSession
              ? 'Please select group and session'
              : `Add Selected to ${activeGroup.name} ${activeSession.name} session`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentSelector
