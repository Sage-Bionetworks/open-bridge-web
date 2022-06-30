import SurveyUtils from '@components/surveys/SurveyUtils'
import {
  StyledFormControl,
  StyledLabel14,
} from '@components/surveys/widgets/SharedStyled'
import {
  StyledDropDown,
  StyledDropDownItem,
} from '@components/surveys/widgets/StyledDropDown'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import {Box, Button, MenuItem, OutlinedInput, Typography} from '@mui/material'
import {SelectChangeEvent} from '@mui/material/Select'
import {theme} from '@style/theme'
import {ChoiceQuestion} from '@typedefs/surveys'
import React from 'react'
import {DropResult} from 'react-beautiful-dnd'
import QUESTIONS, {QuestionTypeKey} from '../../left-panel/QuestionConfigs'

const Select: React.FunctionComponent<{
  step: ChoiceQuestion
  isMulti?: boolean
  onChange: (step: ChoiceQuestion) => void
}> = ({step, onChange}) => {
  const [selectType, setSelectType] = React.useState<
    'MULTI_SELECT' | 'SINGLE_SELECT'
  >('MULTI_SELECT')
  const [answerDataType, setAnswerDataType] = React.useState<
    'Integer' | 'String'
  >('String')
  const selectTypeOptions: QuestionTypeKey[] = ['MULTI_SELECT', 'SINGLE_SELECT']
  const answerDataTypeOptions: ('Integer' | 'String')[] = ['Integer', 'String']

  const handleSelectTypeChange = (
    event: SelectChangeEvent<typeof selectType>
  ) => {
    const {
      target: {value},
    } = event

    setSelectType(value as typeof selectType)
  }

  const handleDataTypeChange = (
    event: SelectChangeEvent<typeof answerDataType>
  ) => {
    const {
      target: {value},
    } = event

    setAnswerDataType(value as typeof answerDataType)
  }

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
    <Box sx={{padding: theme.spacing(14, 3)}}>
      <StyledFormControl mb={2}>
        <StyledLabel14 mb={0.5}>Question Type:</StyledLabel14>

        <StyledDropDown
          value={selectType}
          width="200px"
          //@ts-ignore
          onChange={handleSelectTypeChange}
          input={<OutlinedInput />}
          inputProps={{'aria-label': 'Question Type:'}}>
          {selectTypeOptions.map(opt => (
            <MenuItem value={opt.toString()}>
              <StyledDropDownItem width="170px">
                {QUESTIONS.get(opt)?.img}
                <div>{QUESTIONS.get(opt)?.title}</div>
              </StyledDropDownItem>
            </MenuItem>
          ))}
        </StyledDropDown>
      </StyledFormControl>

      <StyledFormControl mb={2}>
        <StyledLabel14 mb={0.5}>Set Response Value Pairing:</StyledLabel14>

        <StyledDropDown
          value={answerDataType}
          width="130px"
          //@ts-ignore
          onChange={handleDataTypeChange}
          input={<OutlinedInput />}
          inputProps={{'aria-label': 'et Response Value Pairing:'}}>
          {answerDataTypeOptions.map(opt => (
            <MenuItem value={opt.toString()}>
              <StyledDropDownItem width="100px">
                <Box paddingLeft="13px">{opt}</Box>{' '}
              </StyledDropDownItem>
            </MenuItem>
          ))}
        </StyledDropDown>
      </StyledFormControl>

      <Typography sx={{fontSize: '16px', fontStype: 'italic'}}>
        Participant's answers will be recorded as an{' '}
        <strong>
          array of {answerDataType === 'String' ? 'strings' : 'integers'}
        </strong>{' '}
        as defined below.
      </Typography>
      <Box bgcolor={'#fff'}>
        <Button>Match All Response Labels</Button>
        <table>
          <tr>
            <th>Response</th> <th></th> <th>Value={answerDataType}</th>
          </tr>

          {step.choices?.map(choice => (
            <tr>
              <td>{choice.text}</td> <td> &rarr;</td>{' '}
              <td>
                <SimpleTextInput value={choice.value} />
              </td>
            </tr>
          ))}
        </table>
      </Box>
    </Box>
  )
}
export default Select
