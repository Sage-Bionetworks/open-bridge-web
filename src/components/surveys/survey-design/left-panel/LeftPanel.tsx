import {ReactComponent as DraggableIcon} from '@assets/surveys/draggable.svg'
import {ReactComponent as CompletionIcon} from '@assets/surveys/iconcomplete.svg'
import {ReactComponent as PreviewIcon} from '@assets/surveys/preview.svg'
import {ReactComponent as InstructionIcon} from '@assets/surveys/q_type_icons/icontitle.svg'
import {ReactComponent as SettingsIcon} from '@assets/surveys/settings.svg'
import {Box, styled} from '@mui/material'
import {theme} from '@style/theme'
import {Step, SurveyConfig} from '@typedefs/surveys'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import {NavLink, useLocation} from 'react-router-dom'
import QUESTIONS, {getQuestionId} from './QuestionConfigs'
import QuestionTypeDisplay, {DivContainer} from './QuestionTypeDisplay'

const linkStyle = {
  cursor: 'pointer',
  textDecoration: 'none',
  '&:focus, &:hover, &:visited, &:link, &:active': {
    textDecoration: 'none',
  },
}

const leftSideWidth = theme.spacing(37)

const Container = styled('div')(({theme}) => ({
  display: 'flex',
  flexGrow: 0,
  flexShrink: 0,
  width: leftSideWidth,

  backgroundColor: '#FCFCFC',
  flexDirection: 'column',
  // justifyContent: 'space-between',
  boxShadow: '2px 5px 5px rgba(42, 42, 42, 0.1)',
  borderRight: '1px solid #DFDFDF',
}))

const AddStepMenuContainer = styled('div', {label: 'addStepMenuContainer'})(
  ({theme}) => ({
    width: leftSideWidth,
    position: 'fixed',
    bottom: '0px',

    height: '50px',
  })
)

const Row = styled('div')(({theme}) => ({
  height: theme.spacing(6),

  width: '100%',
  borderTop: '1px solid #DFDFDF',

  color: '#3A3A3A',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: '#565656',
    color: '#fff',

    '& div': {
      color: '#fff',
    },
    '& svg, img ': {
      WebkitFilter: 'invert(1)',
      filter: 'invert(1)',
    },
  },
}))

const TitleStyledRow = styled('div')(({theme}) => ({
  height: theme.spacing(6),

  width: '100%',

  color: '#3A3A3A',
  textDecoration: 'none',
  borderTop: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: 0,
  '&>div, a': {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 0,
    flexGrow: 1,
    '&:hover': {
      backgroundColor: '#3A3A3A',
      color: '#fff',
      '& >svg, img ': {
        WebkitFilter: 'invert(1)',
        filter: 'invert(1)',
      },
    },
  },
}))

const StyledNavLink = styled(NavLink)(({theme}) => linkStyle)
const StyledNavAnchor = styled('a')(({theme}) => linkStyle)

const StyledQuestionText = styled('div', {label: 'styledQuestionText'})(
  ({theme}) => ({
    whiteSpace: 'nowrap',
    width: '200px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  })
)

// a little function to help us with reordering the result
const reorder = (
  steps: Step[],
  startIndex: number,
  endIndex?: number
): Step[] => {
  console.log('end', endIndex)
  const [removed] = steps.splice(startIndex, 1)
  if (endIndex !== undefined) {
    steps.splice(endIndex, 0, removed)
  }
  return steps
}

const TitleRow: React.FunctionComponent<{surveyId?: string; guid?: string}> = ({
  surveyId,
  guid,
}) => {
  return (
    <TitleStyledRow id="top">
      <div>
        <StyledNavLink to={`/surveys/${guid}/design/intro`}>
          <SettingsIcon style={{margin: '10px', maxWidth: '20px'}} />
          <div>Survey ID: {surveyId}</div>
        </StyledNavLink>
      </div>
      <div>
        <StyledNavLink to={`/surveys/${guid}/preview`}>
          <PreviewIcon style={{margin: '10px', maxWidth: '20px'}} />
          <div>Preview</div>
        </StyledNavLink>
      </div>
    </TitleStyledRow>
  )
}

const StaticStepLink: React.FunctionComponent<{
  isCurrentStep: boolean
  // path: string
  onClick: () => void
}> = ({isCurrentStep, children, onClick}) => {
  return (
    <StyledNavAnchor onClick={onClick}>
      <Row
        sx={{
          backgroundColor: isCurrentStep ? 'red' : 'inherit',
        }}>
        <QuestionTypeDisplay>{children}</QuestionTypeDisplay>
      </Row>
    </StyledNavAnchor>
  )
}

const StepLink: React.FunctionComponent<{
  //guid: string
  index: number
  step: Step
  size: number
  isCurrent: boolean
  provided: DraggableProvided
  onClick: () => void
}> = ({index, step, size, isCurrent, provided, onClick}) => (
  <Row
    sx={{
      backgroundColor: isCurrent ? 'red' : 'inherit',
    }}
    {...provided.draggableProps}
    {...provided.dragHandleProps}
    ref={provided.innerRef}>
    <StyledNavAnchor onClick={onClick}>
      <DivContainer
        sx={{
          paddingRight: '20px',
        }}>
        <DivContainer sx={{height: '100%'}}>
          {QUESTIONS.get(getQuestionId(step))?.img}
          <StyledQuestionText>
            {`${index < 9 ? '0' : ''}${index + 1}. ${step.title}`}
          </StyledQuestionText>
        </DivContainer>
        {size > 1 && <DraggableIcon />}
      </DivContainer>
    </StyledNavAnchor>
  </Row>
)

const LeftPanel: React.FunctionComponent<{
  guid: string
  surveyId?: string
  surveyConfig?: SurveyConfig
  currentStepIndex?: number
  onUpdateSteps: (s: Step[]) => void
  onNavigateStep: (id: number | 'title' | 'completion') => void
}> = ({
  guid,
  surveyConfig,
  children,
  surveyId,
  currentStepIndex,
  onNavigateStep,
  onUpdateSteps,
}) => {
  console.log(
    'rerender steps',
    surveyConfig?.steps.map(s => s.identifier)
  )
  const location = useLocation()
  const onDragEnd = (result: DropResult) => {
    if (!surveyConfig?.steps) {
      return
    }

    const items = reorder(
      [...surveyConfig!.steps],
      result.source.index,
      result.destination?.index
    )

    onUpdateSteps(items)
  }
  return (
    <Container id="left">
      <DragDropContext onDragEnd={onDragEnd}>
        <Box id="questions">
          <TitleRow surveyId={surveyId} guid={guid} />
          <Box
            sx={{
              height: 'calc(100vh - 150px)',
              overflow: 'scroll',
            }}>
            <StaticStepLink
              onClick={() => onNavigateStep('title')}
              //  path={`/surveys/${guid}/design/title`}
              isCurrentStep={location.pathname.includes('/design/title')}>
              <InstructionIcon />
              <div>Title Page</div>
            </StaticStepLink>
            <Droppable droppableId="questions">
              {provided => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {surveyConfig?.steps.map((step, index) => (
                    <Draggable
                      draggableId={step.identifier}
                      isDragDisabled={surveyConfig?.steps.length < 2}
                      index={index}
                      key={step.identifier}>
                      {provided => (
                        <StepLink
                          provided={provided}
                          isCurrent={currentStepIndex === index}
                          //  guid={guid}
                          onClick={() => onNavigateStep(index)}
                          size={surveyConfig?.steps.length}
                          index={index}
                          step={step}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
            <StaticStepLink
              onClick={() => onNavigateStep('completion')}
              isCurrentStep={location.pathname.includes('/design/completion')}>
              <CompletionIcon style={{margin: '4px 0'}} />
              <div>Completion Screen</div>
            </StaticStepLink>
          </Box>
        </Box>
        <AddStepMenuContainer>{children}</AddStepMenuContainer>
      </DragDropContext>
    </Container>
  )
}
export default LeftPanel
