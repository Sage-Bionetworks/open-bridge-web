import SurveyUtils from '@components/surveys/SurveyUtils'
import {
  Box,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Radio,
  RadioGroup,
} from '@mui/material'
import {ChoiceQuestion, Step, SurveyRuleOperator} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import QUESTIONS, {
  getQuestionId,
} from '../survey-design/left-panel/QuestionConfigs'
import {StyledDropDown, StyledDropDownItem} from '../widgets/StyledDropDown'

const NextQ: FunctionComponent<{questions: Step[]; id: string}> = ({
  id,
  questions,
}) => {
  const {index, isLast} = SurveyUtils.getSequentialQuestionIndex(id, questions)
  if (isLast || index === -1) {
    return <></>
  }
  const q = questions[index + 1]
  return (
    <StyledDropDownItem width="170px">
      {QUESTIONS.get(getQuestionId(q))?.img}
      <div>{index + 2}</div>
    </StyledDropDownItem>
  )
}

const QMenu: FunctionComponent<{
  questions: Step[]
  excludeIds: string[]
  selectedIdentifier?: string

  onChangeSelected: (qIs: string) => void
}> = ({questions, selectedIdentifier, excludeIds, onChangeSelected}) => {
  return (
    <StyledDropDown
      value={selectedIdentifier || ''}
      width="200px"
      height="48px"
      //@ts-ignore
      onChange={(e: SelectChangeEvent<string>) => {
        onChangeSelected(e.target.value)
      }}
      input={<OutlinedInput />}
      inputProps={{'aria-label': 'Question Type:'}}>
      {questions.map(
        (opt, index) =>
          !excludeIds.includes(opt.identifier) && (
            <MenuItem value={opt.identifier} key={opt.identifier}>
              <StyledDropDownItem width="170px">
                {QUESTIONS.get(getQuestionId(opt))?.img}
                <div>{index + 1}</div>
              </StyledDropDownItem>
            </MenuItem>
          )
      )}
    </StyledDropDown>
  )
}

const BranchingConfig: FunctionComponent<{
  step: ChoiceQuestion
  questions: ChoiceQuestion[]
  sourceNodesIds: string[]
  onChange: (step: ChoiceQuestion[]) => void
}> = ({step, questions, sourceNodesIds, onChange}) => {
  const qTypeId = getQuestionId(step)
  console.log('sourceIds', sourceNodesIds)

  const onChangeNextId = (stepId: string) => {
    onChange(
      questions.map(_question =>
        _question.identifier === step.identifier
          ? {..._question, nextStepIdentifier: stepId}
          : _question
      )
    )
  }
  const onChangeNextOption = (hasNextDefined: string) => {
    let newSteps: ChoiceQuestion[]
    if (hasNextDefined === 'false') {
      newSteps = questions.map(_question =>
        _question.identifier === step.identifier
          ? {..._question, nextStepIdentifier: undefined}
          : _question
      )
    } else {
      newSteps = questions.map((_question, i) =>
        _question.identifier === step.identifier
          ? {..._question, nextStepIdentifier: questions[i + 1].identifier}
          : _question
      )
    }
    onChange(newSteps)
  }

  const changeRuleMapping = (
    optionValue: string | number | undefined,
    nextStepId: string
  ) => {
    let rules = [...(step.surveyRules || [])]
    const i = rules?.findIndex(r => r.matchingAnswer === optionValue)
    const rule = {
      matchingAnswer: optionValue,
      ruleOperator: SurveyRuleOperator.Equal,
      skipToIdentifier: nextStepId,
    }

    if (i === -1) {
      rules.push(rule)
    } else {
      rules[i] = rule
    }
    const newSteps = questions.map(_question =>
      _question.identifier === step.identifier
        ? {
            ..._question,
            surveyRules: rules,
          }
        : _question
    )
    console.log(newSteps)
    onChange(newSteps)
  }
  return (
    <Box>
      id: {step.identifier} title: {step.title}
      {qTypeId !== 'SINGLE_SELECT' ? (
        <RadioGroup
          onChange={e => onChangeNextOption(e.target.value)}
          value={Boolean(step.nextStepIdentifier)}>
          <FormControlLabel
            value={false}
            control={<Radio />}
            label={
              <div>
                Go to next screen in sequence :
                <NextQ questions={questions} id={step.identifier} />
              </div>
            }
          />
          <FormControlLabel
            value={true}
            control={<Radio />}
            label={
              <div>
                {' '}
                Skip To:{' '}
                <QMenu
                  questions={questions}
                  excludeIds={sourceNodesIds}
                  selectedIdentifier={step.nextStepIdentifier || ''}
                  onChangeSelected={nextStepId => onChangeNextId(nextStepId)}
                />
              </div>
            }
          />
        </RadioGroup>
      ) : (
        <Box>
          {
            SurveyUtils.getNextSequentialQuestion(step.identifier, questions)
              ?.identifier
          }
          {step.choices &&
            step.choices.map(c => (
              <div key={c.value}>
                <div>{c.value + '-->'}</div>
                <QMenu
                  questions={questions}
                  excludeIds={sourceNodesIds}
                  selectedIdentifier={
                    step.surveyRules?.find(
                      rule => rule.matchingAnswer === c.value
                    )?.skipToIdentifier || ''
                  }
                  onChangeSelected={nextStepId =>
                    changeRuleMapping(c.value, nextStepId)
                  }
                />
              </div>
            ))}
          {step.other && <div>{'OTHER'}</div>}
        </Box>
      )}
    </Box>
  )
}

export default BranchingConfig
