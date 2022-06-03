import {ReactComponent as CompletionIcon} from '@assets/surveys/completion.svg'
import {ReactComponent as DraggableIcon} from '@assets/surveys/draggable.svg'
import {ReactComponent as PreviewIcon} from '@assets/surveys/preview.svg'
import {ReactComponent as SettingsIcon} from '@assets/surveys/settings.svg'
import {Box, styled} from '@mui/material'
import {Step, SurveyConfig} from '@typedefs/surveys'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import {NavLink} from 'react-router-dom'
import {SURVEY_ICONS} from '../../widgets/SurveyIcon'
import QUESTIONS, {getQuestionId} from './QuestionConfigs'
import QuestionTypeDisplay, {DivContainer} from './QuestionTypeDisplay'

const Container = styled('div')(({theme}) => ({
  display: 'flex',
  flexGrow: 0,
  width: theme.spacing(37),

  backgroundColor: '#FCFCFC',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '2px 5px 5px rgba(42, 42, 42, 0.1)',
  borderRight: '1px solid #DFDFDF',
}))

const Row = styled('div')(({theme}) => ({
  height: theme.spacing(6),

  width: '100%',
  borderTop: '1px solid #DFDFDF',

  color: '#3A3A3A',
  textDecoration: 'none',
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

const StyledNavLink = styled(NavLink)(({theme}) => ({
  textDecoration: 'none',

  '&:focus, &:hover, &:visited, &:link, &:active': {
    textDecoration: 'none',
  },
}))

const getTitleImageSrc = (imageName?: string): string => {
  return (
    SURVEY_ICONS.get(imageName || '')?.img || SURVEY_ICONS.get('GENERAL')!.img
  )
}

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
        <StyledNavLink
          to={`/surveys/${guid}/design/intro`}
          sx={{'& hover': {bgcolor: 'blue'}}}>
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

const StepLink: React.FunctionComponent<{
  guid: string
  index: number
  step: Step
  size: number
}> = ({guid, index, step, size}) => (
  <StyledNavLink to={`/surveys/${guid}/design/question?q=${index}`}>
    <DivContainer sx={{paddingRight: '20px'}}>
      <DivContainer sx={{height: '100%'}}>
        {QUESTIONS.get(getQuestionId(step))?.img}
        <Box
          sx={{
            whiteSpace: 'nowrap',
            width: '200px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}>
          {' '}
          {`${index < 9 ? '0' : ''}${index + 1}. ${step.title}`}
        </Box>
      </DivContainer>
      {size > 1 && <DraggableIcon />}
    </DivContainer>
  </StyledNavLink>
)

const LeftPanel: React.FunctionComponent<{
  //children: React.ReactNode
  guid: string
  surveyId?: string
  titleImage?: string
  surveyConfig?: SurveyConfig
  onUpdateSteps: (s: Step[]) => void
}> = ({guid, surveyConfig, children, titleImage, surveyId, onUpdateSteps}) => {
  console.log(
    'rerender steps',
    surveyConfig?.steps.map(s => s.identifier)
  )
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
    <DragDropContext onDragEnd={onDragEnd}>
      <Container id="left">
        <Box id="questions">
          <TitleRow surveyId={surveyId} guid={guid} />
          <StyledNavLink to={`/surveys/${guid}/design/title`}>
            <Row>
              <QuestionTypeDisplay>
                <img src={getTitleImageSrc(titleImage)} />
                <div>Title Page</div>
              </QuestionTypeDisplay>
            </Row>
          </StyledNavLink>
          <Droppable droppableId="questions">
            {provided => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{
                  maxHeight: 'calc(100vh - 200px)',
                  overflow: 'scroll',
                  bgColor: 'beige',
                }}>
                {surveyConfig?.steps.map((step, index) => (
                  <Draggable
                    draggableId={step.identifier}
                    isDragDisabled={surveyConfig?.steps.length < 2}
                    index={index}
                    key={step.identifier}>
                    {provided => (
                      <Row
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <StepLink
                          guid={guid}
                          size={surveyConfig?.steps.length}
                          index={index}
                          step={step}
                        />
                      </Row>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>

          <StyledNavLink to={`/surveys/${guid}/design/completion`}>
            <Row>
              <QuestionTypeDisplay>
                <CompletionIcon />
                <div>Completion Screen</div>
              </QuestionTypeDisplay>
            </Row>
          </StyledNavLink>
        </Box>
        {children}
      </Container>
    </DragDropContext>
  )
}
export default LeftPanel
