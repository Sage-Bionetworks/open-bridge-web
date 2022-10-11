import SurveyUtils from '@components/surveys/SurveyUtils'
import AlertWithTextWrapper from '@components/widgets/AlertWithTextWrapper'
import {
  DialogButtonPrimary,
  DialogButtonSecondary
} from '@components/widgets/StyledComponents'
import CloseIcon from '@mui/icons-material/Close'
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
  Typography
} from '@mui/material'
import { latoFont, theme } from '@style/theme'
import { ChoiceQuestion, Step, SurveyRuleOperator } from '@typedefs/surveys'
import React, { FunctionComponent } from 'react'
import Draggable from 'react-draggable'
import useQuestionInfo from '../hooks/useQuestionInfo'
import QUESTIONS, {
  getQuestionId
} from '../survey-design/left-panel/QuestionConfigs'
import { DivContainer } from '../survey-design/left-panel/QuestionTypeDisplay'
import { StyledDropDown, StyledDropDownItem } from '../widgets/StyledDropDown'
import { detectCycle, getEdgesFromSteps } from './GetNodesToPlot'

// agendel TODO: refactor duplicate
const getBgColor = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light' ? '#F2F2F2' : '#565656'
}
const getColor = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light' ? '#4D4D4D' : '#fff'
}

const getSvgFilter = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light'
    ? {}
    : {
      WebkitFilter: 'invert(1)',
      filter: 'invert(1)',
    }
}

const getBoxShadow = (mode: 'light' | 'dark' = 'dark') => {
  return mode === 'light' ? ' 1px 2px 3px rgba(42, 42, 42, 0.1);' : 'none'
}

const StyledQuestionDisplay = styled(Box, { label: 'StyledQuestionDisplay' })<{
  mode?: 'dark' | 'light'
}>(({ theme, mode = 'dark' }) => ({
  backgroundColor: getBgColor(mode),
  width: '80px',
  height: '48px',
  boxShadow: getBoxShadow(mode),
  '& > div, > div div ': {
    backgroundColor: getBgColor(mode),

    color: getColor(mode),
  },
  '& svg, img ': getSvgFilter(mode),
}))

const StyledSmallFont = styled(Typography, { label: 'StyledSmallFont' })(
  ({ theme }) => ({
    fontFamily: latoFont,
    fontWeight: 400,
    fontSize: '12px',
    color: '#fff',
    width: '100%',
    padding: theme.spacing(1, 0, 0.5, 0),
    '&:last-child': {
      padding: theme.spacing(1.5, 0, 0, 0),
    },
  })
)

const StyledDialogTitle = styled(DialogTitle, { label: 'StyledDialogTitle' })(
  ({ theme }) => ({
    background: ' #565656',
    color: '#fff',
    padding: theme.spacing(3, 3, 2, 3),
    fontSize: '16px',
    fontWeight: 700,
    position: 'relative',
  })
)

const StyledTable = styled('table', { label: 'StyledTable' })(({ theme }) => ({
  marginTop: theme.spacing(2.5),
  padding: theme.spacing(1),
  backgroundColor: '#fff',
  '& td': {
    borderBottom: '1px solid #BBC3CD',
    width: '100%',
    borderSpacing: 0,
    verticalAlign: 'middle',
    padding: theme.spacing(1),
  },
}))

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

const NextQuestionDropdown: FunctionComponent<{
  questions: Step[]
  excludeIds: string[]
  selectedIdentifier?: string

  onChangeSelected: (qIs: string) => void
}> = ({ questions, selectedIdentifier, excludeIds, onChangeSelected }) => {
  return (
    <StyledDropDown
      value={selectedIdentifier || ''}
      width="112px"
      height="48px"
      mode="light"
      //@ts-ignore
      onChange={(e: SelectChangeEvent<string>) => {
        onChangeSelected(e.target.value)
      }}
      input={<OutlinedInput />}
      inputProps={{ 'aria-label': 'Question Type:' }}>
      {questions.map(
        (opt, index) =>
          (!excludeIds.includes(opt.identifier) && index > 0) && (
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

const ErrorDisplay: FunctionComponent<{ qNumber?: number, isRuleError: boolean }> = ({ qNumber, isRuleError }) => {

  if (qNumber === undefined && !isRuleError) {
    return <></>
  }
  const textObj = {
    rule: {
      title: 'Unreachable Selection.',
      body: (<>You should either leave some choices undefined <br />
        or have a 'Skip To' value that mathes on of the choices'</>)

    },
    cycle: {
      title: 'Cycles detected..',
      body: (<>{`Skipping to Question ${qNumber} will cause an infinite loop<br />
      Please select another question to skip to.`}</>)

    }
  }
  const textToUse = qNumber !== undefined ? textObj.cycle : textObj.rule
  return (
    <Box sx={{ bgcolor: theme.palette.error.light, padding: theme.spacing(1, 1.5) }}>
      <AlertWithTextWrapper>
        <Box sx={{ color: 'black', fontSize: '12px' }}>
          <strong>{textToUse.title}</strong>
          <div>{textToUse.body}</div>
        </Box>
      </AlertWithTextWrapper>
    </Box>
  )
}



const BranchingConfig: FunctionComponent<{
  error?: string

  step: ChoiceQuestion
  questions: ChoiceQuestion[]
  invalidTargetStepIds: string[]
  onCancel: () => void
  onSave: () => void
  onChange: (step: ChoiceQuestion[]) => void
  isOpen: boolean
}> = ({
  error,
  step,
  questions,
  invalidTargetStepIds,
  onChange,
  onCancel,
  isOpen,
  onSave,
}) => {

    const [cycleErrQNum, setCycleErrQNum] = React.useState<number | undefined>(undefined)
    const [hasUnreachableState, setHasUnreachableState] = React.useState(false)
    const extendedStepInfo = useQuestionInfo(step, questions)
    if (!step) {
      return <></>
    }
    // const qTypeId = getQuestionId(step)


    const validateAndSave = (updatedSteps: ChoiceQuestion[], changedStepId: string) => {
      setCycleErrQNum(undefined)
      setHasUnreachableState(false)
      const updatedStep = updatedSteps.find(s => s.identifier === step.identifier)
      if (updatedStep?.choices && updatedStep?.surveyRules) {
        //if we have rules for each step and skip to is not one of them then we have an error
        if (updatedStep.choices.length === updatedStep.surveyRules.length && !updatedStep.surveyRules.find(r => r.skipToIdentifier === updatedStep.nextStepIdentifier)) {
          setHasUnreachableState(true)
          return
        }
      }

      const edges = getEdgesFromSteps(updatedSteps)

      const cycles = detectCycle(edges.edges)
      if (cycles) {
        setCycleErrQNum(SurveyUtils.getSequentialQuestionIndex(changedStepId, questions).index)
      }
      else {
        onChange(updatedSteps)
      }
    }

    //change the skip to question in a dropdown
    const onChangeNextId = (stepId: string) => {
      validateAndSave(
        questions.map(_question =>
          _question.identifier === step.identifier
            ? { ..._question, nextStepIdentifier: stepId }
            : _question
        ), stepId
      )
    }
    //radio button change
    const onChangeNextOption = (hasNextDefined: string) => {
      let newSteps: ChoiceQuestion[]
      const stepIndex = SurveyUtils.getSequentialQuestionIndex(step.identifier, questions).index
      if (hasNextDefined === 'false') {
        newSteps = questions.map(_question =>
          _question.identifier === step.identifier
            ? { ..._question, nextStepIdentifier: undefined, surveyRules: [] }
            : _question
        )
      } else {
        newSteps = questions.map((_question, i) =>
          _question.identifier === step.identifier
            ? { ..._question, nextStepIdentifier: questions[stepIndex + 1]?.identifier }
            : _question
        )
      }
      validateAndSave(newSteps, questions[stepIndex + 1]?.identifier)
    }

    const changeRuleMapping = (
      optionValue: string | number | boolean | undefined,
      nextStepId: string
    ) => {
      //make a copy of the rules
      let rules = [...(step.surveyRules || [])]
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
            nextStepIdentifier: step.nextStepIdentifier || nextStepId
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
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        PaperComponent={PaperComponent}
        open={isOpen}
        scroll="body">
        <StyledDialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          <CloseIcon
            onClick={closeModal}
            fontSize="large"
            sx={{
              color: '#fff',
              position: 'absolute',
              top: '10px',

              right: '10px',
            }}></CloseIcon>
          <StyledQuestionDisplay mode='dark'>
            <DivContainer>
              {QUESTIONS.get(extendedStepInfo.stepType)?.img}
              <div>{extendedStepInfo.index}</div>
            </DivContainer>
          </StyledQuestionDisplay>

          <StyledSmallFont> {step.subtitle}</StyledSmallFont> {step.title}
          <StyledSmallFont> {step.detail}</StyledSmallFont>

        </StyledDialogTitle>
        <ErrorDisplay qNumber={cycleErrQNum} isRuleError={hasUnreachableState} />

        <DialogContent>
          <Box sx={{ padding: theme.spacing(3) }}>
            {error && <div>{error}</div>}
            <RadioGroup
              onChange={e => onChangeNextOption(e.target.value)}
              value={Boolean(step.nextStepIdentifier)}>
              <FormControlLabel
                value={false}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex' }}>
                    <div
                      style={{
                        width: '148px',
                        margin: '12px 8px',
                        alignItems: 'center',
                      }}>
                      Go to next
                      <br />
                      screen in sequence
                    </div>
                  </div>
                }
              />
              <FormControlLabel
                value={true}
                control={<Radio />}
                label={
                  <div style={{ display: 'flex' }}>
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
                      onChangeSelected={nextStepId => onChangeNextId(nextStepId)}
                    />
                  </div >
                }
              />
            </RadioGroup >
            {extendedStepInfo.stepType === 'SINGLE_SELECT' && (
              <Box>
                {step.choices && (
                  <StyledTable>
                    {step.choices.map(c => (
                      <tr key={c.value?.toString() || 'undefined'}>
                        <td>{c.value}</td>
                        <td style={{ fontSize: '15px' }}>&rarr;</td>

                        <td>
                          {' '}
                          <NextQuestionDropdown
                            questions={questions}
                            excludeIds={invalidTargetStepIds}
                            selectedIdentifier={
                              step.surveyRules?.find(
                                rule => rule.matchingAnswer === c.value
                              )?.skipToIdentifier || ''
                            }
                            onChangeSelected={nextStepId =>
                              changeRuleMapping(c.value, nextStepId)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </StyledTable>
                )}
                {step.other && <div>{'OTHER'}</div>}
              </Box >
            )}
          </Box >
        </DialogContent >
        <DialogActions>
          <DialogButtonSecondary onClick={closeModal}>Cancel</DialogButtonSecondary>
          <DialogButtonPrimary onClick={onSave} disabled={isSaveDisabled()}>Save Changes</DialogButtonPrimary>
        </DialogActions>
      </Dialog >
    )
  }

export default BranchingConfig
