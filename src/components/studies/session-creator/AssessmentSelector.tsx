import React, { FunctionComponent, useState } from 'react'

import { makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment } from '../../../types/types'

import clsx from 'clsx'
import AddableAssessment from './AddableAssessment'
import GroupsEditor from './GoupsEditor'

const useStyles = makeStyles({
  root: {},
  bookmarkedAssessments: {
    backgroundColor: '#E2E2E2',
    padding: '20px',
  },
})



type AssessmentSelectorProps ={
    groups: Group[]
    onAddAssessment: Function
}

const AssessmentSelector: FunctionComponent<AssessmentSelectorProps> = ({groups, onAddAssessment}: AssessmentSelectorProps) => {
  const assessments = useAssessments()
  const [assessmentTabIndex, setAssessmentTabIndex] = useState(0)
  const [groupTabIndex, setGroupTabIndex] = useState(0)



  const classes = useStyles()

  const getActiveGroupSessions = () =>
    groups.find(group => group.active)?.sessions


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
                <AddableAssessment
                  key={index + 'a'}
                  onAddFn={(sessionId: string) =>
                    onAddAssessment(groups[groupTabIndex].id, sessionId, a)
                  }
                  sessions={getActiveGroupSessions() || []}
                >
                  <AssessmentCard
                    index={index}
                    assessment={a}
                    key={index}
                  ></AssessmentCard>
                </AddableAssessment>
              ))}
          </div>
        </TabPanel>

        <TabPanel value={assessmentTabIndex} index={1}>
          <div
            className={clsx(
              'assesmentContainer',
              classes.bookmarkedAssessments,
            )}
          >
            {assessments.map((a, index) => (
              <AddableAssessment
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
              </AddableAssessment>
            ))}
          </div>
        </TabPanel>
      </div>

   
    </div>
  )
}

export default AssessmentSelector
