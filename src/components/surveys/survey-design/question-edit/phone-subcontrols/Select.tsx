import {ReactComponent as DraggableIcon} from '@assets/surveys/draggable.svg'
import SurveyUtils from '@components/surveys/SurveyUtils'
import {Box, styled} from '@mui/material'
import {ChoiceQuestion, Step} from '@typedefs/surveys'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

const Option = styled('div')(({theme}) => ({
  background: '#FFFFFF',
  boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
  borderRadius: '2px',
  padding: theme.spacing(1.5, 1),
  fontSize: '15px',
  fontWeight: 700,
  marginBottom: '6px',
  textAlign: 'left',
  display: 'flex',

  alignItems: 'center',
  '& >div': {
    width: '14px',
    height: '14px',
    border: '2px solid black',
    marginRight: '6px',
  },
  '& svg': {
    marginLeft: 'auto',
    marginRight: 0,
  },
}))

const Select: React.FunctionComponent<{
  step: Step
  isMulti?: boolean
  onChange: (step: ChoiceQuestion) => void
}> = ({step, onChange}) => {
  const stepData = step as ChoiceQuestion
  const onDragEnd = (result: DropResult) => {
    if (!stepData.choices) {
      return
    }

    const items = SurveyUtils.reorder(
      [...stepData.choices],
      result.source.index,
      result.destination?.index
    )

    onChange({...stepData, choices: items})
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="options">
        {provided => (
          <Box ref={provided.innerRef} {...provided.droppableProps}>
            {stepData.choices!.map((choice, index) => (
              <Draggable
                draggableId={choice.value.toString()}
                isDragDisabled={index % 2 > 0}
                index={index}
                key={choice.value}>
                {provided => (
                  <Option
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}>
                    <div /> {choice.text}
                    {index % 2 === 0 && <DraggableIcon />}
                  </Option>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  )
}
export default Select
