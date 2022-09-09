import {ReactComponent as DraggableIcon} from '@assets/surveys/draggable.svg'
import {ReactComponent as SettingsIcon} from '@assets/surveys/settings.svg'
import SurveyUtils from '@components/surveys/SurveyUtils'
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
import {DivContainer} from './QuestionTypeDisplay'

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

const Row = styled('div', {label: 'Row'})(({theme}) => ({
  height: theme.spacing(6),

  width: '100%',
  borderTop: '1px solid #DFDFDF',

  textDecoration: 'none',

  '&:hover, &.current': {
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
const StyledNavAnchor = styled('a', {label: 'styledNavAnchor'})(
  ({theme}) => linkStyle
)

const StyledQuestionText = styled('div', {label: 'styledQuestionText'})(
  ({theme}) => ({
    whiteSpace: 'nowrap',
    width: '200px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  })
)

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
      {/*AGendel: future feature   <div>
        <StyledNavLink to={`/surveys/${guid}/preview`}>
          <PreviewIcon style={{margin: '10px', maxWidth: '20px'}} />
          <div>Preview</div>
        </StyledNavLink>
  </div>*/}
    </TitleStyledRow>
  )
}

const StepLink: React.FunctionComponent<{
  //guid: string
  index: number
  step: Step
  size: number
  isCurrentStep: boolean
  provided: DraggableProvided
  onClick: () => void
}> = ({index, step, size, isCurrentStep, provided, onClick}) => {
  let title = `${index < 9 ? '0' : ''}${index}. ${step.title}`
  if (index === size - 1) {
    title = 'Completion Screen'
  }
  if (index === 0) {
    title = 'Title Page'
  }

  return (
    <Row
      className={isCurrentStep ? 'current' : ''}
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
            <StyledQuestionText>{title}</StyledQuestionText>
          </DivContainer>
          {size > 3 && index > 0 && index < size - 1 && <DraggableIcon />}
        </DivContainer>
      </StyledNavAnchor>
    </Row>
  )
}

const LeftPanel: React.FunctionComponent<{
  guid: string
  surveyId?: string
  surveyConfig?: SurveyConfig
  currentStepIndex?: number
  onUpdateSteps: (s: Step[]) => void
  onNavigateStep: (id: number) => void
}> = ({
  guid,
  surveyConfig,
  children,
  surveyId,
  currentStepIndex,
  onNavigateStep,
  onUpdateSteps,
}) => {
  const location = useLocation()

  const onDragEnd = (result: DropResult) => {
    if (!surveyConfig?.steps) {
      return
    }

    let resultDesinationIndex = result.destination?.index || 1 //title is first
    if (resultDesinationIndex === surveyConfig.steps.length - 1) {
      resultDesinationIndex = surveyConfig.steps.length - 2
    }

    const items = SurveyUtils.reorder(
      [...surveyConfig!.steps],
      result.source.index,
      resultDesinationIndex
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
            {/* <StaticStepLink
              onClick={() => onNavigateStep('title')}
              //  path={`/surveys/${guid}/design/title`}
              isCurrentStep={location.pathname.includes('/design/title')}>
              <InstructionIcon />
              <div>Title Page</div>
          </StaticStepLink>*/}
            {surveyConfig?.steps && (
              <>
                <Droppable droppableId="questions">
                  {provided => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {surveyConfig!.steps!.map((step, index) => (
                        <Draggable
                          draggableId={step.identifier}
                          isDragDisabled={
                            surveyConfig?.steps!.length < 3 ||
                            step.type === 'overview' ||
                            step.type == 'completion'
                          }
                          index={index}
                          key={step.identifier}>
                          {provided => (
                            <StepLink
                              provided={provided}
                              isCurrentStep={currentStepIndex === index}
                              //  guid={guid}
                              onClick={() => onNavigateStep(index)}
                              size={surveyConfig?.steps!.length}
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
              </>
            )}
          </Box>
        </Box>
        {surveyConfig && (
          <AddStepMenuContainer>{children}</AddStepMenuContainer>
        )}
      </DragDropContext>
    </Container>
  )
}
export default LeftPanel
