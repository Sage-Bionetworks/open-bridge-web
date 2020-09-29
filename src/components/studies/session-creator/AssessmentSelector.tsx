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
  root: {backgroundColor: '#E2E2E2',
  padding: '20px',},
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
  groups: Group[]
  onAddAssessment: Function
}

const getActiveGroupAndSession = (
  groups: Group[],
): { group?: Group; session?: StudySession } => {
  const group = groups.find(group => group.active)
  const session = group?.sessions.find(session => session.active)
  return { group, session }
}

const AssessmentSelector: FunctionComponent<AssessmentSelectorProps> = ({
  groups,
  onAddAssessment,
}: AssessmentSelectorProps) => {
  const assessments = useAssessments()
  const [assessmentTabIndex, setAssessmentTabIndex] = useState(0)
  const [groupTabIndex, setGroupTabIndex] = useState(0)
  const [selectedAssessments, setSelectedAssessments] = useState<Assessment[]>(
    [],
  )
  const [activeGroupSession, setActiveGroupSession] = useState<{
    group?: Group
    session?: StudySession
  }>({})

  useEffect(() => {
    setActiveGroupSession(getActiveGroupAndSession(groups))
  }, [groups])

  const classes = useStyles()

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: Assessment[],
  ) => {
    setSelectedAssessments(newFormats)
  }

  const renderAssessmentTab = (assessments: Assessment[]): JSX.Element => {
    return (
      <div
        className={clsx('assesmentContainer', classes.assessments)}
      >
        {assessments.map((a, index) => (
          <ToggleButtonGroup
            value={selectedAssessments}
            onChange={handleFormat}
            aria-label="text formatting"
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
          disabled={!activeGroupSession.session}
          variant="contained"
          color="primary"
          onClick={() =>
            onAddAssessment(
              activeGroupSession.group?.id,
              activeGroupSession.session?.id,
              selectedAssessments,
            )
          }
        >
          {!activeGroupSession.session
            ? 'Please select group and session'
            : `Add Selected to ${activeGroupSession.group?.name} ${activeGroupSession.session?.name} session` }
        </Button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentSelector
