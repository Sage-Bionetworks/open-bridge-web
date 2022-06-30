import {ReactComponent as DraggableIcon} from '@assets/surveys/draggable.svg'
import SurveyUtils from '@components/surveys/SurveyUtils'
import ClearIcon from '@mui/icons-material/Clear'
import {Box, IconButton, styled} from '@mui/material'
import {ChoiceQuestion} from '@typedefs/surveys'
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

const OptionList = styled('div', {label: 'OptionList'})(({theme}) => ({
  height: '300px',
  marginLeft: '-10px',
  marginRight: '-10px',
  padding: '0 10px',
  overflowY: 'scroll',
  backgroundColor: 'beige',
}))

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

/*
NOTE1:
 “selectorType” has a default value of “default”. If and only if the selectorType is default then “value” is required and that is what is added to the array.
 For both “exclusive” and “all”, selection/deselection is handled within the UI. For “all” that means “select all default choices
 (ie. does not select “other” or “exclusive” or “all”) and add their “value” to the array”. For “exclusive”, that means “deselect all other values”. 
 If these objects (exclusive, all) have a value, that value is also added to the array in addition to either selecting or deselecting the order of the “all of the above” 
 and “none of the above” is incorrect b/c “all of the above” will not select “none of the above” even though it is above it.
*/

/* NOTE2:
order should be:
{
  other,  "All of the above",  "None of the above

  */

const Select: React.FunctionComponent<{
  step: ChoiceQuestion
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

  const deleteOption = (index: number) => {
    if (stepData.choices) {
      const newChoices = [...stepData.choices]
      newChoices.splice(index, 1)

      onChange({
        ...stepData,
        choices: newChoices,
      })
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <OptionList>
        <Droppable droppableId="options">
          {provided => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {stepData
                .choices!.filter(choice => !choice.selectorType)
                .map((choice, index) => (
                  <Draggable
                    draggableId={choice.value?.toString() || ''}
                    isDragDisabled={false}
                    index={index}
                    key={choice.value}>
                    {provided => (
                      <Option
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}>
                        <div /> {choice.text}
                        <DraggableIcon />
                        <IconButton
                          component={ClearIcon}
                          onClick={() => deleteOption(index)}
                        />
                      </Option>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        {stepData
          .choices!.filter(choice => choice.selectorType)
          .sort((a, b) => (a.text < b.text ? -1 : 1))
          .map((choice, index) => (
            <Option>
              <div /> {choice.text}
            </Option>
          ))}
        {step.other && (
          <Option>
            <div /> Other _________
          </Option>
        )}
      </OptionList>
    </DragDropContext>
  )
}
export default Select
