import SurveyUtils from '@components/surveys/SurveyUtils'
import DraggableIcon from '@mui/icons-material/DragIndicatorTwoTone'
import SettingsIcon from '@mui/icons-material/SettingsTwoTone'
import {Box, styled, Theme} from '@mui/material'
import {Step, SurveyConfig} from '@typedefs/surveys'
import React from 'react'
import {DragDropContext, Draggable, DraggableProvided, Droppable, DropResult} from 'react-beautiful-dnd'
import {NavLink} from 'react-router-dom'
import QUESTIONS, {getQuestionId} from './QuestionConfigs'
import {DivContainer} from './QuestionTypeDisplay'

const linkStyle = {
  cursor: 'pointer',
  textDecoration: 'none',
  '&:focus, &:hover, &:visited, &:link, &:active': {
    textDecoration: 'none',
  },
}

const leftSideWidth = '296'

const Container = styled('div', {label: 'Container'})(() => ({
  display: 'flex',
  flexGrow: 0,
  flexShrink: 0,
  width: `${leftSideWidth}px`,

  backgroundColor: '#FFF',
  flexDirection: 'column',
  // justifyContent: 'space-between',
  //boxShadow: '2px 5px 5px rgba(42, 42, 42, 0.1)',
  borderRight: '1px solid #DFDFDF',
}))

const RowStyle = (theme: Theme) => ({
  height: theme.spacing(6),
  width: '100%',
  textDecoration: 'none',
  '&:hover, &.current': {
    backgroundColor: theme.palette.accent.purple,
    color: '#fff',

    '& div, a': {
      color: '#fff',
    },
    '& svg, img ': {
      color: '#fff',
    },
  },
})

const Row = styled('div', {label: 'Row'})(({theme}) => ({
  ...RowStyle(theme),
  height: theme.spacing(6),

  borderTop: '1px solid #DFDFDF',
}))

const TitleStyledRow = styled('div', {label: 'TitleStyledRow'})(({theme}) => ({
  ...RowStyle(theme),

  borderTop: 'none',
  display: 'flex',
  justifyContent: 'space-between',
  paddingRight: 0,
  paddingLeft: '10px',
  '& svg': {
    color: ' #878E95',
  },
  '&>div, a': {
    display: 'flex',
    alignItems: 'center',
    paddingRight: 0,
    flexGrow: 1,
    fontWeight: 900,
  },
}))

const StyledNavLink = styled(NavLink)(() => linkStyle)
const StyledNavAnchor = styled('a', {label: 'styledNavAnchor'})(() => linkStyle)

const StyledQuestionText = styled('div', {label: 'styledQuestionText'})(() => ({
  whiteSpace: 'nowrap',
  width: '200px',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
}))

const TitleRow: React.FunctionComponent<{
  surveyId?: string
  guid?: string
  isCurrent?: boolean
}> = ({surveyId, guid, isCurrent}) => {
  return (
    <TitleStyledRow id="top" className={isCurrent ? 'current' : ''}>
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

function canDrag(isReadOnly: boolean, size: number, index: number) {
  return !isReadOnly && size > 3 && index > 0 && index < size - 1
}

const StepLink: React.FunctionComponent<{
  //guid: string
  index: number
  step: Step
  size: number
  isCurrentStep: boolean
  isReadOnly: boolean
  provided: DraggableProvided
  onClick: () => void
}> = ({index, step, size, isCurrentStep, isReadOnly, provided, onClick}) => {
  let title = `${index < 9 ? '0' : ''}${index}. ${step.title}`
  if (index === size - 1) {
    title = 'Completion Screen'
  }
  if (index === 0) {
    title = 'Title Page'
  }
  if (step.type === 'completion' && index === 1) {
    //dont display completion unless it has other steps
    return <></>
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
          {canDrag(isReadOnly, size, index) && <DraggableIcon sx={{color: '#DFE2E6'}} />}
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
  isReadOnly: boolean
  onReorderSteps: (s: Step[]) => void
  onNavigateStep: (id: number) => void
}> = ({guid, surveyConfig, children, surveyId, currentStepIndex, isReadOnly, onNavigateStep, onReorderSteps}) => {
  const onDragEnd = (result: DropResult) => {
    if (!surveyConfig?.steps) {
      return
    }

    let resultDesinationIndex = result.destination?.index || 1 //title is first
    if (resultDesinationIndex === surveyConfig.steps.length - 1) {
      resultDesinationIndex = surveyConfig.steps.length - 2
    }

    const items = SurveyUtils.reorder([...surveyConfig!.steps], result.source.index, resultDesinationIndex)

    onReorderSteps(items)
  }
  return (
    <Container id="left">
      {surveyConfig && <>{children}</>}
      <DragDropContext onDragEnd={onDragEnd}>
        <Box id="questions">
          <TitleRow surveyId={surveyId} guid={guid} isCurrent={currentStepIndex === undefined} />

          <Box
            sx={
              {
                // height: 'calc(100vh - 150px)',
                //  overflow: 'scroll',
              }
            }>
            {surveyConfig?.steps && (
              <>
                <Droppable droppableId="questions">
                  {provided => (
                    <Box ref={provided.innerRef} {...provided.droppableProps}>
                      {surveyConfig!.steps!.map((step, index) => (
                        <Draggable
                          draggableId={step.identifier}
                          isDragDisabled={!canDrag(isReadOnly, surveyConfig?.steps!.length, index)}
                          index={index}
                          key={step.identifier}>
                          {provided => (
                            <StepLink
                              isReadOnly={isReadOnly}
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
      </DragDropContext>
    </Container>
  )
}
export default LeftPanel
