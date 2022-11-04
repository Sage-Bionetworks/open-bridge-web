import AssessmentCard from '@components/assessments/AssessmentCard'
import AssessmentLibraryWrapper from '@components/assessments/AssessmentLibraryWrapper'
import AssessmentSmall from '@components/assessments/AssessmentSmall'
import Loader from '@components/widgets/Loader'
import useFeatureToggles, {FeatureToggles} from '@helpers/FeatureToggle'
import CheckIcon from '@mui/icons-material/Check'
import {ToggleButton, ToggleButtonGroup} from '@mui/material'
import {styled} from '@mui/material/styles'
import {useAssessmentsWithResources} from '@services/assessmentHooks'
import {StudySession} from '@typedefs/scheduling'
import {Assessment, AssessmentsType, ViewType} from '@typedefs/types'
import React, {FunctionComponent, useState} from 'react'

const StyledToggleButton = styled(ToggleButton, {label: 'StyledToggleButton'})<{
  disabled?: boolean
  selected?: boolean
  viewMode?: ViewType
}>(({theme, disabled, selected, viewMode}) => ({
  position: 'relative',
  padding: '0',
  border: disabled ? 'none' : selected ? '2px solid #ccc' : '0px solid transparent',
  opacity: disabled ? '.3' : selected ? 0.8 : 1,
  display: viewMode === 'LIST' ? 'block' : 'inherit',
  width: viewMode === 'LIST' ? '100%' : 'inherit',

  '& div.overlay': {
    position: 'absolute',
    bottom: '0',
    background: 'rgba(0, 0, 0, 0.5)' /* Black see-through */,
    width: '100%',
    transition: '.5s ease',
    height: '100%',
    opacity: selected ? '1' : '0',
    color: 'white',
    display: 'flex', // make us of Flexbox
    alignItems: 'center', // does vertically center the desired content
    justifyContent: 'center', // horizontally centers single line items
    textClign: 'center', // optional, but helps horizontally center text that breaks into multiple lines
    padding: '20px',
  },

  '& div.overlayBackdrop': {
    position: 'absolute',
    height: '100%',
    width: '100%',
    opacity: selected ? '0.8' : '0',
    backgroundColor: '#fff',
  },

  '&  div.overlayBg': {
    position: 'absolute',
    width: '100%',
    height: '100%',
    border: '10px solid #333',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}))

type AssessmentSelectorProps = {
  //active: {group: Group, session: StudySession | undefined}
  activeSession: StudySession | undefined
  onUpdateAssessments: Function
  selectedAssessments: Assessment[]
}

const SelectableAssessment: FunctionComponent<{
  assessment: Assessment
  index: number
  isDisabled: boolean
  onUpdateAssessments: (a: Assessment[]) => void
  value: Assessment[]
  viewMode?: ViewType
}> = ({assessment, index, isDisabled, onUpdateAssessments, value, viewMode}) => {
  const toggleAssessment = (event: React.MouseEvent<HTMLElement>, selectedAssessments: Assessment[]) => {
    onUpdateAssessments(selectedAssessments)
  }
  return (
    <ToggleButtonGroup
      value={value}
      onChange={toggleAssessment}
      aria-label={assessment.title}
      key={assessment.guid}
      sx={{display: viewMode === 'LIST' ? 'block' : 'inherit'}}>
      <StyledToggleButton aria-label="bold" value={assessment} disabled={isDisabled} viewMode={viewMode}>
        {viewMode === 'GRID' ? (
          <AssessmentCard index={index} assessment={assessment} key={assessment.guid}></AssessmentCard>
        ) : (
          <AssessmentSmall assessment={assessment} key={assessment.guid}></AssessmentSmall>
        )}
        <div className="overlay">
          <div className="overlayBackdrop" />
          <div className="overlayBg">
            <CheckIcon sx={{position: 'absolute', fontSize: '8rem', color: '#333'}}></CheckIcon>
          </div>
        </div>
      </StyledToggleButton>
    </ToggleButtonGroup>
  )
}

const AssessmentSelector: FunctionComponent<AssessmentSelectorProps> = ({
  activeSession,
  selectedAssessments,
  onUpdateAssessments,
}: AssessmentSelectorProps) => {
  const surveyToggle = useFeatureToggles<FeatureToggles>()
  const [filteredAssessments, setFilteredAssessments] = useState<Assessment[] | undefined>(undefined)
  const [assessmentsType, setAssessmentsType] = React.useState<AssessmentsType>('OTHER')
  const {data, isLoading, status} = useAssessmentsWithResources(false, false)
  const [viewMode, setViewMode] = React.useState<ViewType>('GRID')
  const {data: surveys} = useAssessmentsWithResources(false, true)

  if ((!data?.assessments || !data?.tags) && status === 'success') {
    return <>No Data </>
  }

  const isAssessmentInSession = (session: StudySession, assessmentId: string): boolean =>
    session.assessments?.find(item => item.originGuid === assessmentId) !== undefined
  const getAssessments = () => {
    if ((assessmentsType === 'OTHER' && !data) || (assessmentsType === 'SURVEY' && !surveys)) {
      return []
    }
    if (assessmentsType === 'OTHER') {
      return filteredAssessments || data!.assessments
    } else {
      return filteredAssessments || surveys!.assessments
    }
  }
  return (
    <Loader reqStatusLoading={isLoading} variant="full">
      {data && (
        <div>
          <AssessmentLibraryWrapper
            isAssessmentLibrary={false}
            assessmentsType={assessmentsType}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            assessments={data.assessments}
            onChangeAssessmentsType={t => setAssessmentsType(t)}
            onChangeTags={(assessments: Assessment[]) => setFilteredAssessments(assessments) /*setFilterTags(tags)*/}>
            {getAssessments().map((a, index) => (
              <SelectableAssessment
                value={selectedAssessments}
                assessment={a}
                index={index}
                viewMode={viewMode}
                onUpdateAssessments={a => onUpdateAssessments(a)}
                isDisabled={!activeSession || isAssessmentInSession(activeSession, a.guid!)}
              />
            ))}
          </AssessmentLibraryWrapper>
        </div>
      )}
    </Loader>
  )
}

export default AssessmentSelector
