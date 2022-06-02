import {ReactComponent as CompletionIcon} from '@assets/surveys/completion.svg'
import {ReactComponent as PreviewIcon} from '@assets/surveys/preview.svg'
import {ReactComponent as SettingsIcon} from '@assets/surveys/settings.svg'
import {Box, styled} from '@mui/material'
import {theme} from '@style/theme'
import {Step, SurveyConfig} from '@typedefs/surveys'
import React from 'react'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
import {NavLink} from 'react-router-dom'
import {SURVEY_ICONS} from '../widgets/SurveyIcon'
import {getQuestionId} from './questions/QuestionConfigs'
import QuestionTypeDisplay, {
  DivContainer,
} from './questions/QuestionTypeDisplay'

const Container = styled('div')(({theme}) => ({
  display: 'flex',
  flexGrow: 0,
  width: theme.spacing(37),
  // border: '1px solid black',
  backgroundColor: '#FCFCFC',
  flexDirection: 'column',
  justifyContent: 'space-between',
  boxShadow: '2px 5px 5px rgba(42, 42, 42, 0.1)',
  borderRight: '1px solid #DFDFDF',
}))

const Row = styled('div')(({theme}) => ({
  height: theme.spacing(6),
  //padding: theme.spacing(2),
  width: '100%',
  borderTop: '1px solid #DFDFDF',
  //backgroundColor: 'transparent',
  color: '#3A3A3A',
  textDecoration: 'none',
  backgroundColor: 'beige',
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
  endIndex: number
): Step[] => {
  const [removed] = steps.splice(startIndex, 1)
  steps.splice(endIndex, 0, removed)

  return steps
}

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
    if (!result.destination || !surveyConfig?.steps) {
      return
    }

    const items = reorder(
      [...surveyConfig!.steps],
      result.source.index,
      result.destination.index
    )

    onUpdateSteps(items)
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Container id="left">
        <Box
          id="questions"
          sx={
            {
              /*height: 'calc(100vh - 110px)', overflow: 'scroll'*/
            }
          }>
          <StyledNavLink to={`/surveys/${guid}/design/intro`}>
            <Row sx={{borderTop: 'none'}}>
              {' '}
              <DivContainer
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingRight: theme.spacing(2),
                  '&>div': {display: 'flex', alignItems: 'center'},
                }}>
                <div>
                  <SettingsIcon style={{margin: '10px', maxWidth: '20px'}} />
                  <div>Survey ID: {surveyId}</div>
                </div>
                <div>
                  <PreviewIcon style={{margin: '10px', maxWidth: '20px'}} />
                  <div>Preview</div>
                </div>
              </DivContainer>
            </Row>
          </StyledNavLink>
          <StyledNavLink to={`/surveys/${guid}/design/title`}>
            <Row>
              {' '}
              <DivContainer>
                <img
                  src={getTitleImageSrc(titleImage)}
                  style={{maxWidth: '28px', margin: '0 10px'}}
                />
                <div>Title Page</div>
              </DivContainer>
            </Row>
          </StyledNavLink>
          <Droppable droppableId="questions">
            {provided => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {surveyConfig?.steps.map((step, index) => (
                  <Draggable
                    draggableId={step.identifier}
                    index={index}
                    key={step.identifier}>
                    {provided => (
                      <Row
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <StyledNavLink
                          to={`/surveys/${guid}/design/question?q=${index}`}>
                          <QuestionTypeDisplay
                            name={getQuestionId(step)}
                            title={step.title}
                          />
                        </StyledNavLink>
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
              {' '}
              <DivContainer>
                <CompletionIcon style={{margin: '10px', maxWidth: '20px'}} />
                <div>Completion Screen</div>
              </DivContainer>
            </Row>
          </StyledNavLink>
        </Box>
        {children}
      </Container>
    </DragDropContext>
  )
}
export default LeftPanel
