import {ReactComponent as GenerateId} from '@assets/surveys/actions/generate_id.svg'
import {
  StyledFormControl,
  StyledLabel14,
} from '@components/surveys/widgets/SharedStyled'
import {
  StyledDropDown,
  StyledDropDownItem,
} from '@components/surveys/widgets/StyledDropDown'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import UtilityObject from '@helpers/utility'
import {
  Box,
  Button,
  MenuItem,
  OutlinedInput,
  styled,
  Typography,
} from '@mui/material'
import {SelectChangeEvent} from '@mui/material/Select'
import {theme} from '@style/theme'
import {ChoiceQuestion, QuestionDataType} from '@typedefs/surveys'
import React from 'react'
import QUESTIONS, {QuestionTypeKey} from '../../left-panel/QuestionConfigs'

const ValueTable = styled('table')(({theme}) => ({
  width: '100%',
  borderSpacing: 0,

  '& th': {
    fontSize: '12px',
    textAlign: 'left',
    fontWeight: 'normal',
  },
  '& td': {
    height: theme.spacing(7),
    borderTop: '1px solid  #BBC3CD',
  },
}))

const PairingTableHeading: React.FunctionComponent<{
  answerDataType: QuestionDataType
  isSingleChoice?: boolean
}> = ({answerDataType, isSingleChoice}) => {
  const mapping = {
    number: [],
    boolean: [],
    integer: [
      <>
        an <strong>integer</strong>
      </>,
      <>
        an <strong>array of integers</strong>
      </>,
    ],
    string: [
      <>
        {' '}
        a <strong>string</strong>
      </>,
      <>
        {' '}
        an <strong>array of strings</strong>
      </>,
    ],
  }

  return (
    <Typography
      component="p"
      sx={{
        fontSize: '16px',
        fontStyle: 'italic',
        marginBottom: theme.spacing(2),
      }}>
      Participant's answer{isSingleChoice ? '' : 's'} will be recorded as{' '}
      {mapping[answerDataType][isSingleChoice ? 0 : 1]}
      &nbsp;as defined below.
    </Typography>
  )
}

const Select: React.FunctionComponent<{
  step: ChoiceQuestion

  onChange: (step: ChoiceQuestion) => void
}> = ({step, onChange}) => {
  const [selectType, setSelectType] = React.useState<
    'MULTI_SELECT' | 'SINGLE_SELECT'
  >('MULTI_SELECT')
  /*  const [answerDataType, setAnswerDataType] = React.useState<
    'Integer' | 'String'
  >('String')*/
  const selectTypeOptions: QuestionTypeKey[] = ['MULTI_SELECT', 'SINGLE_SELECT']
  const answerDataTypeOptions: QuestionDataType[] = ['integer', 'string']

  const handleSelectTypeChange = (
    event: SelectChangeEvent<typeof selectType>
  ) => {
    const {
      target: {value},
    } = event

    setSelectType(value as typeof selectType)
  }

  const handleDataTypeChange = (
    event: SelectChangeEvent<typeof step.baseType>
  ) => {
    const {
      target: {value},
    } = event
    if (value !== step.baseType) {
      let choices = [...step.choices]
      //switch from string to integer -- number them
      if (value === 'integer') {
        for (const [i, v] of choices.entries()) {
          v.value = i
        }
      } else {
        for (const [i, v] of choices.entries()) {
          v.value = v.text.replaceAll(' ', '_')
        }
      }

      onChange({...step, baseType: value as typeof step.baseType, choices})
    }
  }

  const stepData = step as ChoiceQuestion

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
          value={step.baseType}
          width="130px"
          //@ts-ignore
          onChange={handleDataTypeChange}
          input={<OutlinedInput />}
          inputProps={{'aria-label': 'Set Response Value Pairing:'}}>
          {answerDataTypeOptions.map(opt => (
            <MenuItem value={opt.toString()}>
              <StyledDropDownItem width="100px">
                <Box paddingLeft="13px">{UtilityObject.capitalize(opt)}</Box>{' '}
              </StyledDropDownItem>
            </MenuItem>
          ))}
        </StyledDropDown>
      </StyledFormControl>

      <PairingTableHeading
        answerDataType={step.baseType}
        isSingleChoice={step.singleChoice}
      />

      <Box sx={{backgroundColor: '#fff', padding: theme.spacing(2, 1.5)}}>
        {step.baseType === 'string' && (
          <Button
            sx={{marginRight: 0, float: 'right'}}
            onClick={() =>
              onChange({
                ...step,
                choices: step.choices.map(c => ({
                  ...c,
                  value: c.text.replaceAll(' ', '_'),
                })),
              })
            }>
            <GenerateId />
            Match All Response Labels
          </Button>
        )}
        <ValueTable>
          <tr>
            <th>Response</th> <th></th>{' '}
            <th style={{width: '60px'}}>
              Value={UtilityObject.capitalize(step.baseType)}
            </th>
          </tr>

          {step.choices?.map((choice, index) => (
            <tr>
              <td>{choice.text}</td> <td> &rarr;</td>{' '}
              <td style={{width: '60px'}}>
                <SimpleTextInput
                  value={choice.value}
                  onChange={e => {
                    const choices = step.choices.map((c, i) =>
                      i === index ? {...c, value: e.target.value} : c
                    )
                    onChange({...step, choices})
                  }}
                />
              </td>
            </tr>
          ))}
        </ValueTable>
      </Box>
    </Box>
  )
}
export default Select
