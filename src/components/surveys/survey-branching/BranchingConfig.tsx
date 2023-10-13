import SurveyUtils from '@components/surveys/SurveyUtils'
import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {DialogButtonPrimary, DialogButtonSecondary} from '@components/widgets/StyledComponents'
import CloseIcon from '@mui/icons-material/Close'
import EastIcon from '@mui/icons-material/East'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  PaperProps,
  Radio,
  RadioGroup,
  styled,
} from '@mui/material'
import {theme} from '@style/theme'
import {ChoiceQuestion, Step, SurveyRuleOperator} from '@typedefs/surveys'
import React, {FunctionComponent} from 'react'
import Draggable from 'react-draggable'
import useQuestionInfo from '../hooks/useQuestionInfo'
import QUESTIONS, {getQuestionId} from '../survey-design/left-panel/QuestionConfigs'
import {StyledDropDown, StyledDropDownItem} from '../widgets/StyledDropDown'
import {detectCycle, getEdgesFromSteps} from './GetNodesToPlot'

const StyledQuestionDisplay = styled(Box, {label: 'StyledQuestionDisplay'})<{}>(({theme}) => ({
  height: '48px',
  display: 'flex',

  alignItems: 'center',
  fontSize: '20px',
  fontWeight: 700,

  '& svg, img ': {color: theme.palette.primary.main, marginRight: theme.spacing(1)},
}))

const StyledDialogTitle = styled(DialogTitle, {label: 'StyledDialogTitle'})(({theme}) => ({
  padding: theme.spacing(1, 0, 1, 0),
  fontSize: '16px',
  fontWeight: 700,
  position: 'relative',
}))

const StyledTable = styled('table', {label: 'StyledTable'})(({theme}) => ({
  margin: theme.spacing(2.5, 8, 5, 5),
  padding: theme.spacing(1),

  '& td': {
    borderSpacing: 0,
    verticalAlign: 'middle',
    padding: theme.spacing(1),
    '&:first-of-type': {
      paddingLeft: 0,
    },
  },
}))

function PaperComponent(props: PaperProps) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

const NextQuestionDropdown: FunctionComponent<{
  questions: Step[]
  excludeIds: string[]
  selectedIdentifier?: string
  isReadOnly: boolean

  onChangeSelected: (qIs: string) => void
}> = ({questions, selectedIdentifier, excludeIds, isReadOnly, onChangeSelected}) => {
  return (
    <StyledDropDown
      readOnly={isReadOnly}
      value={selectedIdentifier || ''}
      width="112px"
      height="48px"
      mode="light"
      //@ts-ignore
      onChange={(e: SelectChangeEvent<string>) => {
        onChangeSelected(e.target.value)
      }}
      input={<OutlinedInput />}
      inputProps={{'aria-label': 'Question Type:'}}>
      {questions.map(
        (opt, index) =>
          !excludeIds.includes(opt.identifier) &&
          index > 0 && (
            <MenuItem value={opt.identifier} key={opt.identifier}>
              <StyledDropDownItem mode="light">
                {QUESTIONS.get(getQuestionId(opt))?.img}
                <div>{index}</div>
              </StyledDropDownItem>
            </MenuItem>
          )
      )}
    </StyledDropDown>
  )
}

const ErrorDisplay: FunctionComponent<{
  qNumber?: number
  isRuleError: boolean
}> = ({qNumber, isRuleError}) => {
  if (qNumber === undefined && !isRuleError) {
    return <></>
  }
  const textObj = {
    rule: {
      title: 'Unreachable Selection.',
      body: (
        <>
          You should either leave some choices undefined <br />
          or have a 'Skip To' value that mathes on of the choices'
        </>
      ),
    },
    cycle: {
      title: 'Cycles detected..',
      body: (
        <>
          {' '}
          <span>{`Skipping to Question ${qNumber} will cause an infinite loop.`} </span>
          <br />
          <span>Please select another question to skip to.</span>
        </>
      ),
    },
  }
  const textToUse = qNumber !== undefined ? textObj.cycle : textObj.rule
  return (
    <Box sx={{bgcolor: theme.palette.error.light, padding: theme.spacing(1, 1.5), margin: '0 -44px 0 -44px'}}>
      <AlertWithTextWrapper>
        <Box sx={{color: 'black', fontSize: '12px'}}>
          <strong>{textToUse.title}</strong>
          <div>{textToUse.body}</div>
        </Box>
      </AlertWithTextWrapper>
    </Box>
  )
}

const BranchingConfig: FunctionComponent<{
  error?: string
  step: Step
  questions: Step[]
  invalidTargetStepIds: string[]
  onCancel: () => void
  onSave: () => void
  onChange: (step: Step[]) => void
  isOpen: boolean
  isReadOnly: boolean
}> = ({error, step, questions, invalidTargetStepIds, onChange, onCancel, isOpen, isReadOnly, onSave}) => {
  const [cycleErrQNum, setCycleErrQNum] = React.useState<number | undefined>(undefined)
  const [hasUnreachableState, setHasUnreachableState] = React.useState(false)
  const extendedStepInfo = useQuestionInfo(step, questions)
  if (!step) {
    return <></>
  }
  // const qTypeId = getQuestionId(step)

  const validateAndSave = (updatedSteps: Step[], changedStepId: string) => {
    setCycleErrQNum(undefined)
    setHasUnreachableState(false)
    const updatedStep = updatedSteps.find(s => s.identifier === step.identifier) as ChoiceQuestion
    if (!updatedStep) {
      return
    }

    if (updatedStep.choices && updatedStep?.surveyRules) {
      //if we have rules for each step and skip to is not one of them then we have an error
      if (
        updatedStep.choices.length === updatedStep.surveyRules.length &&
        !updatedStep.surveyRules.find(r => r.skipToIdentifier === updatedStep.nextStepIdentifier)
      ) {
        setHasUnreachableState(true)
        return
      }
    }

    const edges = getEdgesFromSteps(updatedSteps)

    const cycles = detectCycle(edges.edges)
    if (cycles) {
      setCycleErrQNum(SurveyUtils.getSequentialQuestionIndex(changedStepId, questions).index)
    } else {
      onChange(updatedSteps)
    }
  }

  //change the skip to question in a dropdown
  const onChangeNextId = (stepId: string) => {
    validateAndSave(
      questions.map(_question =>
        _question.identifier === step.identifier ? {..._question, nextStepIdentifier: stepId} : _question
      ),
      stepId
    )
  }
  //radio button change
  const onChangeNextOption = (hasNextDefined: string) => {
    if (isReadOnly) return
    let newSteps: Step[]
    const stepIndex = SurveyUtils.getSequentialQuestionIndex(step.identifier, questions).index
    if (hasNextDefined === 'false') {
      newSteps = questions.map(_question =>
        _question.identifier === step.identifier
          ? {..._question, nextStepIdentifier: undefined, surveyRules: []}
          : _question
      )
    } else {
      newSteps = questions.map((_question, i) =>
        _question.identifier === step.identifier
          ? {
              ..._question,
              nextStepIdentifier: questions[stepIndex + 1]?.identifier,
            }
          : _question
      )
    }
    validateAndSave(newSteps, questions[stepIndex + 1]?.identifier)
  }

  const changeRuleMapping = (optionValue: string | number | boolean | undefined, nextStepId: string) => {
    if (isReadOnly) return 

    //make a copy of the rules
    let rules = [...((step as ChoiceQuestion).surveyRules || [])]
    const ruleIndexToUpdate = rules?.findIndex(r => r.matchingAnswer === optionValue)
    const rule = {
      matchingAnswer: optionValue,
      ruleOperator: 'eq' as SurveyRuleOperator,
      skipToIdentifier: nextStepId,
    }
    //update the rules
    if (ruleIndexToUpdate === -1) {
      rules.push(rule)
    } else {
      rules[ruleIndexToUpdate] = rule
    }

    //if we have the rule we will always have nextStepIdentifier
    const newSteps = questions.map(_question =>
      _question.identifier === step.identifier
        ? {
            ..._question,
            surveyRules: rules,
            nextStepIdentifier: step.nextStepIdentifier || nextStepId,
          }
        : _question
    )
    console.log(newSteps)
    validateAndSave(newSteps, nextStepId)
  }

  const closeModal = () => {
    setCycleErrQNum(undefined)
    setHasUnreachableState(false)
    onCancel()
  }
  const isSaveDisabled = () => {
    return cycleErrQNum !== undefined || hasUnreachableState
  }
  return (
    <Dialog
      aria-labelledby="configure_branching"
      maxWidth="sm"
      fullWidth={true}
      PaperComponent={PaperComponent}
      open={isOpen}
      scroll="body">
      <StyledDialogTitle style={{cursor: 'move'}} id="configure_branching">
        <CloseIcon
          onClick={closeModal}
          fontSize="medium"
          sx={{
            color: '#878E95',
            position: 'absolute',
            top: '20px',
            right: '0px',
          }}></CloseIcon>
        <StyledQuestionDisplay>
          {QUESTIONS.get(extendedStepInfo.stepType)?.img}
          <div>
            {extendedStepInfo.index}. {step.title}
          </div>
        </StyledQuestionDisplay>
      </StyledDialogTitle>
      <ErrorDisplay qNumber={cycleErrQNum} isRuleError={hasUnreachableState} />
      <DialogContent sx={{padding: theme.spacing(2, 0.5), overflow: 'visible'}}>
        <Box>
          {error && <div>{error}</div>}
          <RadioGroup onChange={e => onChangeNextOption(e.target.value)} value={Boolean(step.nextStepIdentifier)}>
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={
                <div style={{display: 'flex'}}>
                  <div
                    style={{
                      margin: '12px 8px',
                      alignItems: 'center',
                    }}>
                    Go to next screen in sequence
                  </div>
                </div>
              }
            />
            <FormControlLabel
              value={true}
              control={<Radio />}
              label={
                <div style={{display: 'flex'}}>
                  <div
                    style={{
                      width: '88px',
                      margin: '12px 8px',
                      alignItems: 'center',
                    }}>
                    Skip To:{' '}
                  </div>
                  <NextQuestionDropdown
                    questions={questions}
                    excludeIds={invalidTargetStepIds}
                    selectedIdentifier={step.nextStepIdentifier || ''}
                    isReadOnly={isReadOnly}
                    onChangeSelected={nextStepId => onChangeNextId(nextStepId)}
                  />
                </div>
              }
            />
          </RadioGroup>
          {extendedStepInfo.stepType === 'SINGLE_SELECT' && (
            <Box sx={{backgroundColor: '#FBFBFC', margin: '40px -46px 40px -46px'}}>
              {(step as ChoiceQuestion).choices && (
                <StyledTable>
                  {(step as ChoiceQuestion).choices.map(c => (
                    <tr key={c.value?.toString() || 'undefined'}>
                      <td>{c.value}</td>
                      <td>
                        <Box
                          sx={{
                            display: 'flex',
                            minWidth: '100px',
                            alignItems: 'center',
                            color: '#878E95',
                            position: 'relative',
                          }}>
                          <Box
                            sx={{
                              height: '1px',
                              borderBottom: '2px solid #878E95',
                              width: '100%',
                            }}></Box>
                          <EastIcon sx={{position: 'absolute', right: '-1px'}} />
                        </Box>
                      </td>

                      <td>
                        {' '}
                        <NextQuestionDropdown
                          questions={questions}
                          excludeIds={invalidTargetStepIds}
                          selectedIdentifier={
                            (step as ChoiceQuestion).surveyRules?.find(rule => rule.matchingAnswer === c.value)
                              ?.skipToIdentifier || ''
                          }
                          isReadOnly={isReadOnly}
                          onChangeSelected={nextStepId => changeRuleMapping(c.value, nextStepId)}
                        />
                      </td>
                    </tr>
                  ))}
                </StyledTable>
              )}
              {/*(step as ChoiceQuestion).other && <div>{'OTHER'}</div>*/}
            </Box>
          )}
        </Box>
      </DialogContent>
      {!isReadOnly && (
      <DialogActions>
        <DialogButtonSecondary onClick={closeModal}>Cancel</DialogButtonSecondary>
        <DialogButtonPrimary onClick={onSave} disabled={isSaveDisabled()}>
          Save Changes
        </DialogButtonPrimary>
      </DialogActions>
      )}
    </Dialog>
  )
}

export default BranchingConfig
