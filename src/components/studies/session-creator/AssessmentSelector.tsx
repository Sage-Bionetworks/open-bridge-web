import React, { FunctionComponent, useEffect, useState } from 'react'

import { Button, makeStyles } from '@material-ui/core'
import TabPanel from '../../widgets/TabPanel'
import TabsMtb from '../../widgets/TabsMtb'
import useAssessments from '../../../helpers/hooks'
import AssessmentCard from '../../assessments/AssessmentCard'

import { Group, Assessment, StudySession, StringDictionary } from '../../../types/types'

import clsx from 'clsx'
import { ToggleButtonGroup, ToggleButton } from '@material-ui/lab'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { Session } from 'inspector'
import AssessmentService from '../../../services/assessment.service'
import { useAsync } from '../../../helpers/AsyncHook'
import { useErrorHandler } from 'react-error-boundary'
import { useSessionDataState } from '../../../helpers/AuthContext'
import AssessmentLibraryWrapper from '../../assessments/AssessmentLibraryWrapper'

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
  //active: {group: Group, session: StudySession | undefined}
  activeSession: StudySession | undefined
  onUpdateAssessments: Function
  selectedAssessments: Assessment[]
}

const AssessmentSelector: FunctionComponent<AssessmentSelectorProps> = ({
  activeSession,
  selectedAssessments,
  onUpdateAssessments,
}: AssessmentSelectorProps) => {

  const { token } = useSessionDataState()

  const handleError = useErrorHandler()
  const classes = useStyles()

  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[]| undefined>(undefined)


  const { data, status, error, run, setData } = useAsync<{
    assessments: Assessment[]
    tags: StringDictionary<number>
  }>({
    status: 'PENDING',
    data: null,
  })




  React.useEffect(() => {
    ///your async call
    return run(AssessmentService.getAssessmentsWithResources(undefined, token))
  }, [run])
  if (status === 'PENDING') {
    return <>loading component here</>
  }
  if (status === 'REJECTED') {
    handleError(error!)
  }

  if (!data?.assessments || (!data?.tags && status === 'RESOLVED')) {
    return <>No Data </>
  }





  const isAssessmentInSession = (
    session: StudySession,
    assessmentId: string,
  ): boolean =>
    session.assessments.find(item => item.guid === assessmentId) !== undefined

  const toggleAssessment = (
    event: React.MouseEvent<HTMLElement>,
    selectedAssessments: Assessment[],
  ) => {
    onUpdateAssessments(selectedAssessments)
    // setSelectedAssessments(selectedAssessments)
  }



  return (
    <AssessmentLibraryWrapper tags={data.tags} assessments={data.assessments} onChangeTags={(assessments: Assessment[])=> setFilteredAssessments(assessments)/*setFilterTags(tags)*/}>
     

  
        {(filteredAssessments|| data.assessments).map((a, index) => (
          <ToggleButtonGroup
            value={selectedAssessments}
            onChange={toggleAssessment}
            aria-label={a.title}
            key={a.guid}
          >
            <ToggleButton
              aria-label="bold"
              value={a}
              disabled={
                !activeSession || isAssessmentInSession(activeSession, a.guid)
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
                key={a.guid}
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
 
        </AssessmentLibraryWrapper>
  )
}

export default AssessmentSelector
