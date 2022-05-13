import AssessmentCard from '@components/assessments/AssessmentCard';
import AssessmentLibraryWrapper from '@components/assessments/AssessmentLibraryWrapper';
import { useAssessmentsWithResources } from '@components/studies/assessmentHooks';
import Loader from '@components/widgets/Loader';
import CheckIcon from '@mui/icons-material/Check';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { StudySession } from '@typedefs/scheduling';
import { Assessment } from '@typedefs/types';
import React, { FunctionComponent, useState } from 'react';

const useStyles = makeStyles({
  toggleA: {
    position: 'relative',
    padding: '0',
    border: '0px solid transparent',
  },
  toggleADisabled: {
    border: 'none',
    opacity: '.3',
  },
  toggleASelected: {
    border: '2px solid #ccc',
    opacity: 0.8,

    '& $overlay': {
      opacity: 1,
      zIndex: 200,
    },
    '& $overlayBackdrop': {
      opacity: 0.8,
    },
  },

  overlay: {
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
  overlayBackdrop: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
  overlayBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '10px solid #333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  check: {
    position: 'absolute',
    fontSize: '8rem',
    color: '#333',
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

  const classes = useStyles()

  const [filteredAssessments, setFilteredAssessments] = useState<
    Assessment[] | undefined
  >(undefined)

  const { data, isLoading, status } = useAssessmentsWithResources()

  if ((!data?.assessments || !data?.tags) && status === 'success') {
    return <>No Data </>
  }

  const isAssessmentInSession = (
    session: StudySession,
    assessmentId: string
  ): boolean =>
    session.assessments?.find(item => item.originGuid === assessmentId) !==
    undefined

  const toggleAssessment = (
    event: React.MouseEvent<HTMLElement>,
    selectedAssessments: Assessment[]
  ) => {
    onUpdateAssessments(selectedAssessments)
  }
  return (
    <Loader reqStatusLoading={isLoading} variant="full">
      {data && (
        <div>
          <AssessmentLibraryWrapper

            isAssessmentLibrary={false}
            assessments={data.assessments}
            onChangeTags={
              (assessments: Assessment[]) =>
                setFilteredAssessments(assessments) /*setFilterTags(tags)*/
            }>
            {(filteredAssessments || data.assessments).map((a, index) => (
              <ToggleButtonGroup
                value={selectedAssessments}
                onChange={toggleAssessment}
                aria-label={a.title}
                key={a.guid}>
                <ToggleButton
                  aria-label="bold"
                  value={a}
                  disabled={
                    !activeSession || isAssessmentInSession(activeSession, a.guid!)
                  }
                  classes={{
                    root: classes.toggleA,
                    selected: classes.toggleASelected,
                    disabled: classes.toggleADisabled,
                  }}>
                  <AssessmentCard
                    index={index}
                    assessment={a}
                    key={a.guid}></AssessmentCard>
                  <div className={classes.overlay}>
                    <div className={classes.overlayBackdrop}></div>
                    <div className={classes.overlayBg}>
                      <CheckIcon className={classes.check}></CheckIcon>
                    </div>
                  </div>
                </ToggleButton>
              </ToggleButtonGroup>
            ))}
          </AssessmentLibraryWrapper>
        </div>)}
    </Loader>
  )
}

export default AssessmentSelector
