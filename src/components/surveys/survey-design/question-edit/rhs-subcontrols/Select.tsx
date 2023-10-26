import SurveyUtils from '@components/surveys/SurveyUtils'
import {StyledFormControl, StyledLabel14} from '@components/surveys/widgets/SharedStyled'
import {StyledDropDown, StyledDropDownItem} from '@components/surveys/widgets/StyledDropDown'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import {SimpleTextInput} from '@components/widgets/StyledComponents'
import UtilityObject from '@helpers/utility'
import ArrowRightAltTwoToneIcon from '@mui/icons-material/ArrowRightAltTwoTone'
import GenerateId from '@mui/icons-material/JoinInnerTwoTone'
import {Box, Button, MenuItem, OutlinedInput, styled, Typography} from '@mui/material'
import {SelectChangeEvent} from '@mui/material/Select'
import {theme} from '@style/theme'
import {ChoiceQuestion, ChoiceQuestionChoice, QuestionDataType} from '@typedefs/surveys'
import React from 'react'
import QUESTIONS, {QuestionTypeKey} from '../../left-panel/QuestionConfigs'
import { toInteger } from 'lodash'

const ValueTable = styled('table')(({theme}) => ({
  width: 'calc(100% + 64px)',
  marginLeft: theme.spacing(-4),
  marginRight: theme.spacing(-4),
  borderSpacing: 0,

  '& th': {
    fontSize: '14px',
    textAlign: 'left',

    fontWeight: 700,
    color: '#22252A',
    '&:first-of-type': {
      paddingLeft: theme.spacing(4),
    },
    '&:last-of-type': {
      paddingRight: theme.spacing(7),
    },
  },
  '& td': {
    height: theme.spacing(7),
    borderTop: '1px solid #F1F3F5',
    color: '#353A3F',
    fontSize: '16px',
    '&:first-of-type': {
      paddingLeft: theme.spacing(4),
    },
    '&:last-of-type': {
      paddingRight: theme.spacing(7),
    },
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
        marginLeft: theme.spacing(2),
      }}>
      Participant's answer{isSingleChoice ? '' : 's'} will be recorded as{' '}
      {mapping[answerDataType][isSingleChoice ? 0 : 1]}
      &nbsp;as defined below.
    </Typography>
  )
}

const ChoiceValueInputRow: React.FunctionComponent<{
  choice: ChoiceQuestionChoice
  allValues: (string | number | boolean | undefined)[]
  onChange: (e: string) => void
}> = ({choice, onChange, allValues}) => {
  const isDefault = !SurveyUtils.isSpecialSelectChoice(choice)
  const firstCell = (
    <div style={{display: 'flex'}}>
      {choice.text}
      {!isDefault && (
        <InfoCircleWithToolTip
          style={{marginLeft: '4px'}}
          tooltipDescription={choice.selectorType === 'all' ? 'Selects all responses' : 'Deselects all responses'}
          variant="info"
        />
      )}
    </div>
  )

  let inputCell = <SimpleTextInput value={choice.value} onChange={e => onChange(e.target.value)} />
  if (!isDefault) {
    inputCell = (
      <div style={{padding: ' 0 8px'}}>
        {choice.selectorType === 'all' ? allValues.filter(v => v !== undefined).join(', ') : 'empty array'}
      </div>
    )
  }

  return (
    <tr>
      <td>{firstCell}</td>{' '}
      <td style={{width: '60px'}}>
        <ArrowRightAltTwoToneIcon />{' '}
      </td>
      <td style={{minWidth: '80px'}}>{inputCell}</td>
    </tr>
  )
}

const Select: React.FunctionComponent<{
  step: ChoiceQuestion
  isReadOnly?: boolean
  onChange: (step: ChoiceQuestion) => void
}> = ({step, isReadOnly, onChange}) => {
  const selectTypeOptions: QuestionTypeKey[] = ['MULTI_SELECT', 'SINGLE_SELECT']
  const [isTypeConversionWarning, setIsTypeConversionWarning] = React.useState(false)
  const answerDataTypeOptions: QuestionDataType[] = ['integer', 'string']

  type ChangeValue = {
    choice: ChoiceQuestionChoice
    index: number
    newValue?: number | string | boolean | undefined
  }

  const mapTypeCheckedValue = (value: string | undefined, baseType?: typeof step.baseType) => {
    const trimmedValue = value?.toString().trim()
    switch (baseType ?? step.baseType) {
      case 'number': {
        return trimmedValue && trimmedValue !== '' ? Number(trimmedValue) : undefined 
      }
      case 'integer': {
        return trimmedValue && trimmedValue !== '' ? toInteger(trimmedValue) : undefined
      }
      case 'string': {
        return value?.toString().replaceAll(' ', '_').replaceAll(',', '_')
      }
      case 'boolean': {
        return trimmedValue && trimmedValue !== '' ? Boolean(trimmedValue) : undefined
      }
    }
  }

  function generateValue(choice: ChoiceQuestionChoice, setTo?: number, baseType?: typeof step.baseType) {
    return SurveyUtils.isSpecialSelectChoice(choice) ? choice.value : (setTo ?? mapTypeCheckedValue(choice.text, baseType))
  }

  const findNewValue = (changes: ChangeValue[], index: number, choice: ChoiceQuestionChoice) => {
    const change = changes.find(c => c.index === index)
    return change ? change.newValue : choice.value
  }

  const getNewRules = (changes: ChangeValue[]) => step.surveyRules?.map(rule => ({
    ...rule,
    matchingAnswer: changes.find(change => change.choice.guid === rule.choiceGuid)?.newValue,
  }))

  const getNewChoices = (changes: ChangeValue[]) => step.choices.map((choice, ii) => ({
    ...choice,
    value: findNewValue(changes, ii, choice)
  }))

  const updateChoicesAndRules = (changes: ChangeValue[], updatedStep?: ChoiceQuestion) => {
    const surveyRules = getNewRules(changes)
    const choices = getNewChoices(changes)
    onChange({
      ...(updatedStep ?? step),
      choices,
      surveyRules,
    })
  }

  const handleSelectTypeChange = (event: SelectChangeEvent<QuestionTypeKey>) => {
    const {
      target: {value},
    } = event

    const isSwitchedToSingleSelect = !step.singleChoice && value === 'SINGLE_SELECT'

    const updatedStep = {...step}
    const choices = isSwitchedToSingleSelect
    ? step.choices.filter(c => !SurveyUtils.isSpecialSelectChoice(c))
    : step.choices
    if (!isSwitchedToSingleSelect) {
      // if changing to a multiple select -- remove 'other'
      delete updatedStep.other
    } 

    onChange({
      ...updatedStep,
      singleChoice: value === 'SINGLE_SELECT',
      choices: choices,
    })
  }

  const handleDataTypeChange = (value: typeof step.baseType, shouldForceChange?: boolean) => {
    if (value !== step.baseType) {
      const isSwitchToInteger = value === 'integer'

      if (isSwitchToInteger && !shouldForceChange && step.other) {
        setIsTypeConversionWarning(true)
        return
      }
      const updatedStep = {...step}
      updatedStep.baseType = value as typeof step.baseType

      if (isSwitchToInteger) {
        // Other field is not valid for an integer
        delete updatedStep.other
      }

      // generate the appropriate mapping for switch of base type
      const changes: ChangeValue[] = step.choices.map((choice, ii) => ({
        choice: choice, 
        index: ii,
        newValue:  generateValue(choice, isSwitchToInteger ? ii : undefined, value)
      }))

      updateChoicesAndRules(changes, updatedStep)
    }
  }

  const matchAllResponseLabels = () => {
    // this function will only apply to the baseType of string
    if (step.baseType !== 'string') return

    // generate new values
    const changes: ChangeValue[] = step.choices.map((choice, index) => ({
      choice: choice,
      index: index,
      newValue: generateValue(choice),
    }))

    updateChoicesAndRules(changes)
  }

  return (
    <>
      <StyledFormControl mb={2} sx={{padding: theme.spacing(0, 2)}}>
        <StyledLabel14 mb={0.5}>Question Type:</StyledLabel14>

        <StyledDropDown
          readOnly={isReadOnly}
          value={step.singleChoice ? 'SINGLE_SELECT' : 'MULTI_SELECT'}
          width="200px"
          height="40px"
          //@ts-ignore
          onChange={handleSelectTypeChange}
          input={<OutlinedInput />}
          inputProps={{'aria-label': 'Question Type:'}}>
          {selectTypeOptions.map(opt => (
            <MenuItem value={opt.toString()} key={opt.toString()}>
              <StyledDropDownItem>
                {QUESTIONS.get(opt)?.img}
                <div>{QUESTIONS.get(opt)?.title}</div>
              </StyledDropDownItem>
            </MenuItem>
          ))}
        </StyledDropDown>
      </StyledFormControl>

      <StyledFormControl mb={2} sx={{padding: theme.spacing(0, 2)}}>
        <StyledLabel14 mb={0.5}>Set Response Value Pairing:</StyledLabel14>

        <StyledDropDown
          readOnly={isReadOnly}
          value={step.baseType}
          height="48px"
          width="130px"
          //@ts-ignore
          onChange={e => handleDataTypeChange(e.target.value)}
          input={<OutlinedInput />}
          inputProps={{'aria-label': 'Set Response Value Pairing:'}}>
          {answerDataTypeOptions.map(opt => (
            <MenuItem value={opt.toString()} key={opt.toString()}>
              <StyledDropDownItem>
                <Box paddingLeft="13px">{UtilityObject.capitalize(opt)}</Box>{' '}
              </StyledDropDownItem>
            </MenuItem>
          ))}
        </StyledDropDown>
      </StyledFormControl>

      <PairingTableHeading answerDataType={step.baseType} isSingleChoice={step.singleChoice} />

      <Box sx={{backgroundColor: '#fff', padding: theme.spacing(2, 1.5)}}>
        {step.baseType === 'string' && !isReadOnly && (
          <Button
            variant="text"
            startIcon={<GenerateId />}
            sx={{fontSize: '14px', fontWeight: 900}}
            disabled={step.surveyRules?.find(r => r.matchingAnswer !== undefined) !== undefined}
            onClick={matchAllResponseLabels}>
            {' '}
            Match All Response Labels
          </Button>
        )}
        <ValueTable>
          <tbody>
            <tr>
              <th>Response</th>
              <th></th>
              <th style={{minWidth: '80px'}}>Value={UtilityObject.capitalize(step.baseType)}</th>
            </tr>

            {step.choices?.map((choice, index) => (
              <ChoiceValueInputRow
                key={choice.guid ?? index.toString()}
                choice={choice}
                allValues={step.choices.map(c => c.value)}
                onChange={val => {
                  updateChoicesAndRules([{
                    choice: choice,
                    index: index,
                    newValue: mapTypeCheckedValue(val),
                  }])
                }}
              />
            ))}
            {step.other && (
              <tr>
                <td>{step.other.fieldLabel || 'Other'}</td>{' '}
                <td style={{width: '60px'}}>
                  {' '}
                  <ArrowRightAltTwoToneIcon />
                </td>
                <td style={{minWidth: '80px', padding: '0 8px'}}>custom text</td>
              </tr>
            )}
          </tbody>
        </ValueTable>
      </Box>
      <ConfirmationDialog
        isOpen={isTypeConversionWarning}
        title={'Changing to Integer removes "Other"'}
        type={'CUSTOM'}
        actionText={'Proceed and remove "Other" '}
        width={580}
        onCancel={() => setIsTypeConversionWarning(false)}
        onConfirm={() => {
          handleDataTypeChange('integer', true)
          setIsTypeConversionWarning(false)
        }}>
        <div>
          <p>
            Setting your Response Value Pairing to Integer will remove "Other" from this question because it is based on
            custom text and cannot be defined as an integer.
          </p>
          <p>Are you sure you would like to proceed?</p>
        </div>
      </ConfirmationDialog>
    </>
  )
}
export default Select
