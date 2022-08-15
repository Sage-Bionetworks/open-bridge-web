import SurveyUtils from '@components/surveys/SurveyUtils'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
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
  Typography,
} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import {ChoiceQuestion, Step, SurveyRuleOperator} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import Draggable from 'react-draggable'
import QUESTIONS, {
  getQuestionId,
} from '../survey-design/left-panel/QuestionConfigs'
import {DivContainer} from '../survey-design/left-panel/QuestionTypeDisplay'
import {StyledDropDown, StyledDropDownItem} from '../widgets/StyledDropDown'

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

const StyledQuestionDisplay = styled(Box, {label: 'StyledQuestionDisplay'})<{
  mode?: 'dark' | 'light'
}>(({theme, mode = 'dark'}) => ({
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

const StyledSmallFont = styled(Typography, {label: 'StyledSmallFont'})(
  ({theme}) => ({
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

const StyledDialogTitle = styled(DialogTitle, {label: 'StyledDialogTitle'})(
  ({theme}) => ({
    background: ' #565656',
    color: '#fff',
    padding: theme.spacing(3, 3, 2, 3),
    fontSize: '16px',
    fontWeight: 700,
    position: 'relative',
  })
)

const StyledTable = styled('table', {label: 'StyledTable'})(({theme}) => ({
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

const QuestionDisplay: FunctionComponent<{
  questions: Step[]
  id: string

  mode: 'light' | 'dark'
}> = ({id, questions, mode}) => {
  const {index, isLast} = SurveyUtils.getSequentialQuestionIndex(id, questions)
  if (index === -1) {
    return <></>
  }
  const q = questions[index]
  return (
    <StyledQuestionDisplay mode={mode}>
      <DivContainer>
        {QUESTIONS.get(getQuestionId(q))?.img}
        <div>{index + 1}</div>
      </DivContainer>
    </StyledQuestionDisplay>
  )
}

const NextQuestionDropdown: FunctionComponent<{
  questions: Step[]
  excludeIds: string[]
  selectedIdentifier?: string

  onChangeSelected: (qIs: string) => void
}> = ({questions, selectedIdentifier, excludeIds, onChangeSelected}) => {
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
      inputProps={{'aria-label': 'Question Type:'}}>
      {questions.map(
        (opt, index) =>
          !excludeIds.includes(opt.identifier) && (
            <MenuItem value={opt.identifier} key={opt.identifier}>
              <StyledDropDownItem width="112px" mode="light">
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
  step?: ChoiceQuestion
  questions: ChoiceQuestion[]
  invalidTargetStepIds: string[]
  onCancel: () => void
  onSave: () => void
  onChange: (step: ChoiceQuestion[]) => void
  isOpen: boolean
}> = ({
  step,
  questions,
  invalidTargetStepIds,
  onChange,
  onCancel,
  isOpen,
  onSave,
}) => {
  if (!step) {
    return <></>
  }
  const qTypeId = getQuestionId(step)

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
    optionValue: string | number | boolean | undefined,
    nextStepId: string
  ) => {
    let rules = [...(step.surveyRules || [])]
    const i = rules?.findIndex(r => r.matchingAnswer === optionValue)
    const rule = {
      matchingAnswer: optionValue,
      ruleOperator: 'eq' as SurveyRuleOperator,
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
    <Dialog
      aria-labelledby="draggable-dialog-title"
      maxWidth="sm"
      PaperComponent={PaperComponent}
      open={isOpen}
      scroll="body">
      <StyledDialogTitle style={{cursor: 'move'}} id="draggable-dialog-title">
        <CloseIcon
          onClick={onCancel}
          fontSize="large"
          sx={{
            color: '#fff',
            position: 'absolute',
            top: '10px',

            right: '10px',
          }}></CloseIcon>
        <QuestionDisplay
          questions={questions}
          id={step.identifier}
          mode={'dark'}
        />
        <StyledSmallFont> {step.subtitle}</StyledSmallFont> {step.title}
        <StyledSmallFont> {step.detail}</StyledSmallFont>
      </StyledDialogTitle>

      <DialogContent>
        <Box sx={{padding: theme.spacing(3)}}>
          <pre>{JSON.stringify(step, null, 2)}</pre>
          <RadioGroup
            onChange={e => onChangeNextOption(e.target.value)}
            value={Boolean(step.nextStepIdentifier)}>
            <FormControlLabel
              value={false}
              control={<Radio />}
              label={
                <div style={{display: 'flex'}}>
                  <div
                    style={{
                      width: '148px',
                      margin: '12px 8px',
                      alignItems: 'center',
                    }}>
                    Go to next
                    <br />
                    screen in sequence:
                  </div>
                  {/*    <QuestionDisplay
                  questions={questions}
                  id={step.identifier}
                  isNext={true}
                  mode={'light'}
                />*/}
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
                    onChangeSelected={nextStepId => onChangeNextId(nextStepId)}
                  />
                </div>
              }
            />
          </RadioGroup>
          {qTypeId === 'SINGLE_SELECT' && (
            <Box>
              {step.choices && (
                <StyledTable>
                  {step.choices.map(c => (
                    <tr key={c.value?.toString() || 'undefined'}>
                      <td>{c.value}</td>
                      <td style={{fontSize: '15px'}}>&rarr;</td>

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
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <DialogButtonSecondary onClick={onCancel}>Cancel</DialogButtonSecondary>
        <DialogButtonPrimary onClick={onSave}>Save Changes</DialogButtonPrimary>
      </DialogActions>
    </Dialog>
  )
}

export default BranchingConfig
