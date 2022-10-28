import {ReactComponent as DraggableIcon} from '@assets/surveys/draggable.svg'
import SurveyUtils from '@components/surveys/SurveyUtils'
import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import ClearIcon from '@mui/icons-material/Clear'
import {Box, IconButton, styled, Typography} from '@mui/material'
import {theme} from '@style/theme'
import {
  ChoiceQuestion,
  ChoiceQuestionChoice,
  ChoiceSelectorType,
} from '@typedefs/surveys'
import React, {FunctionComponent} from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableProvided,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'

const OptionList = styled('div', {label: 'OptionList'})(({theme}) => ({}))

const Option = styled('div', {
  name: 'Option',
  shouldForwardProp: prop => prop !== 'isSingleChoice',
})<{isSingleChoice?: boolean}>(({theme, isSingleChoice}) => ({
  background: '#FFFFFF',
  boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',

  padding: theme.spacing(0.75, 1.5),
  fontSize: '15px',
  fontWeight: 700,
  marginBottom: '6px',
  textAlign: 'left',
  display: 'flex',

  alignItems: 'center',
  borderRadius: isSingleChoice ? '28px' : '2px',
  //checkbox square
  '& div:first-of-type': {
    width: '16px',
    height: '16px',
    border: '2px solid black',
    flexShrink: 0,
    marginRight: '6px',
    borderRadius: isSingleChoice ? '7px' : '0px',
  },
  '& div:last-of-type': {
    marginLeft: 'auto',
    marginRight: 0,

    display: 'flex',
    alignItems: 'center',
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

const SelectOption: FunctionComponent<{
  choice: ChoiceQuestionChoice
  onDelete: (t: string, type?: string) => void
  onRename: (t: string) => void
  options: {
    provided?: DraggableProvided
    isStatic?: boolean
    isSingleChoice?: boolean
    isOther?: boolean
  }
}> = ({choice, onDelete, onRename, options}) => {
  const [title, setTitle] = React.useState(choice.text)
  const {provided, isStatic, isSingleChoice} = options
  return (
    <Option
      {...provided?.draggableProps}
      {...provided?.dragHandleProps}
      ref={provided?.innerRef}
      isSingleChoice={isSingleChoice}>
      <div />
      {isStatic ? (
        <Typography sx={{padding: theme.spacing(0.5, 0.5)}}>{title}</Typography>
      ) : (
        <DisappearingInput
          sx={{'& input': {padding: theme.spacing(0.25, 0.5)}}}
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={e => onRename(e.target.value)}
        />
      )}

      <div>
        {provided !== undefined && <DraggableIcon />}
        <IconButton
          onClick={() => onDelete(title)}
          sx={{padding: 0, marginLeft: '4px'}}
          title="delete">
          <ClearIcon fontSize="small" />
        </IconButton>
      </div>
    </Option>
  )
}

const Select: React.FunctionComponent<{
  step: ChoiceQuestion

  onChange: (step: ChoiceQuestion) => void
}> = ({step: stepData, onChange}) => {
  // const stepData = step as ChoiceQuestion
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

  const deleteOtherOption = () => {
    if (stepData.choices) {
      onChange({...stepData, other: undefined})
    }
  }

  const deleteOption = (index: number, selectorType?: ChoiceSelectorType) => {
    if (stepData.choices) {
      const newChoices = [...stepData.choices]
      let newRules = undefined

      if ((index > -1 && selectorType) || (index === -1 && !selectorType)) {
        throw new Error('question badly formed')
      }

      const deleteIndex = selectorType
        ? stepData.choices.findIndex(c => c.selectorType === selectorType)
        : index
      //if this value is in the surveyRules - remove it
      if (stepData.surveyRules) {
        const rulesDeleteIndex = stepData.surveyRules!.findIndex(
          r =>
            r.matchingAnswer &&
            r.matchingAnswer === stepData.choices[deleteIndex].value
        )
        newRules = [...stepData.surveyRules]
        if (rulesDeleteIndex !== -1) {
          newRules.splice(rulesDeleteIndex, 1)
        }
      }

      newChoices.splice(deleteIndex, 1)

      onChange({
        ...stepData,
        choices: newChoices,
        surveyRules: newRules,
      })
    }
  }

  const renameOption = (
    newName: string,
    index: number,
    selectorType?: ChoiceSelectorType
  ) => {
    if (stepData.choices) {
      const newChoices = [...stepData.choices]
      if ((index > -1 && selectorType) || (index === -1 && !selectorType)) {
        throw new Error('question badly formed')
      }

      const changeIndex = selectorType
        ? stepData.choices.findIndex(c => c.selectorType === selectorType)
        : index

      newChoices[changeIndex].text = newName

      onChange({
        ...stepData,
        choices: newChoices,
      })
    }
  }

  const renameOtherOption = (newName: string) => {
    //if index === -1 we are dealing with the 'other

    onChange({
      ...stepData,
      other: {type: 'string', fieldLabel: newName},
    })
  }

  const shouldShowExclusiveQuestion = () => {
    return (
      stepData.choices &&
      getIndexOfTheLastRealQuestion() < stepData.choices.length - 1
    )
  }
  const getIndexOfTheLastRealQuestion = (): number => {
    if (!stepData.choices) {
      return -1
    }
    const firstExclusiveQIndex =
      stepData.choices.findIndex(
        o => o.selectorType === 'all' || o.selectorType === 'exclusive'
      ) ?? -1
    //if index=== -1 -- all questions are real questions
    if (firstExclusiveQIndex === -1) {
      return stepData.choices.length - 1
    }
    return firstExclusiveQIndex - 1
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <OptionList>
        <Droppable droppableId="options">
          {provided => (
            <Box ref={provided.innerRef} {...provided.droppableProps}>
              {[...stepData.choices!]
                .slice(0, getIndexOfTheLastRealQuestion() + 1)
                .map((choice, index) => (
                  <Draggable
                    draggableId={choice.value?.toString() || ''}
                    isDragDisabled={false}
                    index={index}
                    key={choice.value?.toString()}>
                    {provided => (
                      <SelectOption
                        options={{
                          isSingleChoice: stepData.singleChoice,
                          provided,
                        }}
                        onRename={qText => renameOption(qText, index)}
                        choice={choice}
                        onDelete={() => deleteOption(index)}
                      />
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>

        {shouldShowExclusiveQuestion() &&
          [...stepData.choices!]
            .slice(getIndexOfTheLastRealQuestion() + 1)
            //  .sort((a, b) => (a.text < b.text ? -1 : 1))
            .map((choice, index) => (
              <SelectOption
                options={{isSingleChoice: stepData.singleChoice}}
                onRename={qText => renameOption(qText, -1, choice.selectorType)}
                choice={choice}
                key={choice.text}
                onDelete={() => deleteOption(-1, choice.selectorType)}
              />
            ))}
        {stepData.other && (
          <SelectOption
            options={{isSingleChoice: stepData.singleChoice, isOther: true}}
            onRename={qText => renameOtherOption(qText)}
            choice={{
              text: (stepData.other.fieldLabel || 'Other') + '_________',
            }}
            onDelete={qText => deleteOtherOption()}
          />
        )}
      </OptionList>
    </DragDropContext>
  )
}
export default Select
