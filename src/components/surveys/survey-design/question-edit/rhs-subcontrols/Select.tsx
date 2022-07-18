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
import {
  ChoiceQuestion,
  ChoiceQuestionChoice,
  QuestionDataType,
} from '@typedefs/surveys'
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
  issinglechoice?: boolean
}> = ({answerDataType, issinglechoice}) => {
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
      Participant's answer{issinglechoice ? '' : 's'} will be recorded as{' '}
      {mapping[answerDataType][issinglechoice ? 0 : 1]}
      &nbsp;as defined below.
    </Typography>
  )
}

const ChoiceValueInputRow: React.FunctionComponent<{
  choice: ChoiceQuestionChoice
  allValues: (string | number | undefined)[]
  onChange: (e: string) => void
}> = ({choice, onChange, allValues}) => {
  const firstCell =
    choice.selectorType === 'all' || choice.selectorType === 'exclusive' ? (
      <>{choice.text}</>
    ) : (
      <>{choice.text} and some more</>
    )
  let inputCell = (
    <SimpleTextInput
      value={choice.value}
      onChange={e => onChange(e.target.value)}
    />
  )
  if (choice.selectorType === 'all') {
    inputCell = (
      <>
        [&nbsp;&nbsp;{allValues.filter(v => v !== undefined).join(', ')}
        &nbsp;&nbsp;]
      </>
    )
  }
  if (choice.selectorType === 'exclusive') {
    inputCell = <>[&nbsp;&nbsp;empty array&nbsp;&nbsp;]</>
  }

  return (
    <tr>
      <td>{firstCell}</td> <td> &rarr;</td>{' '}
      <td style={{width: '60px'}}>{inputCell}</td>
    </tr>
  )
}

const Select: React.FunctionComponent<{
  step: ChoiceQuestion

  onChange: (step: ChoiceQuestion) => void
}> = ({step, onChange}) => {
  const selectTypeOptions: QuestionTypeKey[] = ['MULTI_SELECT', 'SINGLE_SELECT']
  const answerDataTypeOptions: QuestionDataType[] = ['integer', 'string']

  const handleSelectTypeChange = (
    event: SelectChangeEvent<QuestionTypeKey>
  ) => {
    const {
      target: {value},
    } = event

    const isSwitchedToSingleSelect =
      !step.singleChoice && value === 'SINGLE_SELECT'

    onChange({
      ...step,
      singleChoice: value === 'SINGLE_SELECT',
      choices: isSwitchedToSingleSelect
        ? step.choices.filter(
            c => c.selectorType !== 'exclusive' && c.selectorType !== 'all'
          )
        : step.choices,
    })
  }

  const handleDataTypeChange = (
    event: SelectChangeEvent<typeof step.baseType>
  ) => {
    const {
      target: {value},
    } = event

    if (value !== step.baseType) {
      const updatedStep = {...step}
      updatedStep.baseType = value as typeof step.baseType
      let choices = [...step.choices]
      //switch from string to integer -- number them
      if (value === 'integer') {
        for (const [i, v] of choices.entries()) {
          v.value = i
        }
        //if changing to integer -- remove 'other'
        delete updatedStep.other
      } else {
        for (const [i, v] of choices.entries()) {
          v.value = v.text.replaceAll(' ', '_')
        }
      }

      onChange({...updatedStep, choices})
    }
  }

  const stepData = step as ChoiceQuestion

  return (
    <Box sx={{padding: theme.spacing(14, 3)}}>
      <StyledFormControl mb={2}>
        <StyledLabel14 mb={0.5}>Question Type:</StyledLabel14>

        <StyledDropDown
          value={step.singleChoice ? 'SINGLE_SELECT' : 'MULTI_SELECT'}
          width="200px"
          //@ts-ignore
          onChange={handleSelectTypeChange}
          input={<OutlinedInput />}
          inputProps={{'aria-label': 'Question Type:'}}>
          {selectTypeOptions.map(opt => (
            <MenuItem value={opt.toString()} key={opt.toString()}>
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
            <MenuItem value={opt.toString()} key={opt.toString()}>
              <StyledDropDownItem width="100px">
                <Box paddingLeft="13px">{UtilityObject.capitalize(opt)}</Box>{' '}
              </StyledDropDownItem>
            </MenuItem>
          ))}
        </StyledDropDown>
      </StyledFormControl>

      <PairingTableHeading
        answerDataType={step.baseType}
        issinglechoice={step.singleChoice}
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
          <tbody>
            <tr>
              <th>Response</th> <th></th>{' '}
              <th style={{width: '60px'}}>
                Value={UtilityObject.capitalize(step.baseType)}
              </th>
            </tr>

            {step.choices?.map((choice, index) => (
              <ChoiceValueInputRow
                choice={choice}
                allValues={step.choices.map(c => c.value)}
                onChange={val => {
                  const choices = step.choices.map((c, i) =>
                    i === index ? {...c, value: val} : c
                  )
                  onChange({...step, choices})
                }}
              />
            ))}
            {step.other && (
              <tr>
                <td>Other</td> <td> &rarr;</td>{' '}
                <td style={{width: '60px'}}>
                  [&nbsp;&nbsp;custom text&nbsp;&nbsp;]
                </td>
              </tr>
            )}
          </tbody>
        </ValueTable>
      </Box>
    </Box>
  )
}
export default Select
