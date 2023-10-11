import {ReactComponent as PauseIcon} from '@assets/surveys/pause.svg'
import SurveyUtils from '@components/surveys/SurveyUtils'
import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import {Box, styled, Typography, TypographyProps} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import {
  BaseStep,
  ChoiceQuestion,
  ChoiceQuestionChoice,
  NumericQuestion,
  Question,
  ScaleQuestion,
  Step,
  WebUISkipOptions,
} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {getQuestionId, QuestionTypeKey} from '../left-panel/QuestionConfigs'
import Completion from './phone-subcontrols/Completion'
import Numeric from './phone-subcontrols/Numeric'
import Scale from './phone-subcontrols/Scale'
import Select from './phone-subcontrols/Select'
import SelectExtraActions from './phone-subcontrols/SelectExtraActions'
import SurveyTitle from './phone-subcontrols/SurveyTitle'
import TimeDuration from './phone-subcontrols/TimeDuration'
import PhoneDisplay from './PhoneDisplay'
import RequiredToggle from './RequiredToggle'
import SelectPhoneBottomMenu from './SelectPhoneBottomMenu'
import FreeText from './phone-subcontrols/FreeText'

const OuterContainer = styled('div', {label: 'PhoneOuterContainer'})(({theme}) => ({
  //backgroundColor: '#F8F8F8',
  padding: theme.spacing(0, 5),

  margin: '0 auto',
  position: 'relative',
}))

const SkipQuestion = styled((props: TypographyProps) => <Typography {...props}>Skip Question</Typography>, {
  label: 'skipQuestion',
})(() => ({
  fontWeight: 900,
  fontSize: '12px',
  lineHeight: '18px',
  color: theme.palette.primary.main,
}))

const PhoneTop = styled('div', {label: 'PhoneTop'})(() => ({
  display: 'flex',
  margin: '0 0px 18px -6px',
  justifyContent: 'space-between',
}))

const StyledP2 = styled(DisappearingInput, {label: 'StyledP2'})(({theme}) => ({
  fontFamily: latoFont,
  fontWeight: 700,
  fontSize: '14px',
  color: '#2A2A2A',
  width: '100%',
  '& > input, textarea': {
    backgroundColor: '#fff',
    padding: theme.spacing(0.125, 1),
  },
}))

const StyledH1 = styled(DisappearingInput, {label: 'StyledH1'})(({theme}) => ({
  fontFamily: latoFont,

  fontWeight: 400,
  fontSize: '24px',

  color: '#2A2A2A',
  '& > input': {
    padding: theme.spacing(0.125, 1),
    backgroundColor: '#fff',
  },
}))

const ScrollableArea = styled('div', {
  label: 'ScrollableArea',
  shouldForwardProp: prop => prop !== 'height',
})<{height: number}>(({theme, height}) => ({
  height: `${height}px`,
  marginLeft: '-10px',
  marginRight: '-10px',
  padding: '0 10px',
  overflowY: 'scroll',

  display: 'flex',
  flexDirection: 'column',
}))

type QuestionEditProps = {
  isDynamic: boolean
  step?: Step
  globalSkipConfiguration: WebUISkipOptions
  completionProgress: number

  onChange: (step: Step) => void
}

function isSelectQuestion(questionType: QuestionTypeKey | 0): boolean {
  return questionType === 'MULTI_SELECT' || questionType === 'SINGLE_SELECT'
}

function Factory(args: {
  step: Step
  onChange: (step: Step) => void

  q_type: QuestionTypeKey
}) {
  switch (args.q_type) {
    case 'SINGLE_SELECT': {
      return <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
    }

    case 'MULTI_SELECT':
      return <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
    case 'SLIDER':
    case 'LIKERT':
      return <Scale step={args.step as ScaleQuestion} onChange={args.onChange} />
    case 'NUMERIC':
      return <Numeric step={args.step as NumericQuestion} onChange={args.onChange} />
    case 'DURATION':
      return <TimeDuration />
    case 'TIME':
      return <TimeDuration type="TIME" />
    case 'YEAR':
      return <Numeric step={args.step as NumericQuestion} onChange={args.onChange} />
    case 'FREE_TEXT':
      return <FreeText step={args.step as Question} />
    case 'COMPLETION': {
      return <Completion step={args.step as BaseStep} onChange={args.onChange} />
    }
    case 'OVERVIEW': {
      return <SurveyTitle step={args.step as BaseStep} onChange={args.onChange} />
    }
    case 'INSTRUCTION': {
      return <></> // Instructions do not have any fields in addition to title, subtitle, and detail.
    }
    default:
      return <>TODO: {args.q_type} not supported</>
  }
}

const PhoneProgressLine: FunctionComponent<{
  completionProgress: number
}> = ({completionProgress}) => {
  return (
    <Box
      id="progress-line"
      sx={{
        //  width: '100%',
        position: 'relative',
        height: '3px',
        margin: '-3px -20px 8px -15px',
        backgroundColor: '  #DFE2E6;',
      }}>
      <Box
        sx={{
          width: `${completionProgress * 100}%`,
          height: '100%',
          backgroundColor: '#63A650;',
        }}></Box>
    </Box>
  )
}

const QuestionEditPhone: FunctionComponent<QuestionEditProps> = ({
  step,
  globalSkipConfiguration,
  completionProgress,
  isDynamic,
  onChange,
}) => {
  const questionId = step ? getQuestionId(step) : 0

  const shouldShowSkipButton = (): boolean => {
    //show skip button if not required in global config and is not hidden on local config
    return globalSkipConfiguration !== 'NO_SKIP' && !step!.shouldHideActions?.includes('skip')
  }

  const sortSelectChoices = (choiceQ: ChoiceQuestion, direction: 1 | -1): ChoiceQuestionChoice[] => {
    const qNum = SurveyUtils.getNumberOfRegularSelectChoices(choiceQ.choices)
    const sortableOptions = choiceQ.choices.splice(0, qNum)
    sortableOptions.sort((a, b) => {
      return (a.text > b.text ? 1 : -1) * direction
    })
    const opts = [...sortableOptions, ...choiceQ.choices]
    return opts
  }

  const getPhoneBottom = () => {
    return (step && isSelectQuestion(questionId)) 
    ? <SelectPhoneBottomMenu step={step as ChoiceQuestion} onChange={s => onChange(s)} />
    : <></>
  }

  return (
    <OuterContainer>
      {isSelectQuestion(questionId) && (
        <SelectExtraActions
          onSort={dir => {
            const opts = sortSelectChoices(step as ChoiceQuestion, dir)
            const updatedStep: ChoiceQuestion = {
              ...(step as ChoiceQuestion),
              choices: opts,
            }
            onChange(updatedStep)
          }}
        />
      )}

      {step && (
        <>
          <PhoneDisplay sx={{marginBottom: theme.spacing(4), textAlign: 'left'}} phoneBottom={getPhoneBottom()}>
            <Box>
              {isDynamic && (
                <>
                  <PhoneProgressLine completionProgress={completionProgress} />
                  <PhoneTop>
                    <PauseIcon />
                    {shouldShowSkipButton() && <SkipQuestion />}
                  </PhoneTop>
                </>
              )}
              <ScrollableArea height={isDynamic ? 410 : 400} >
                {isDynamic && (
                  <>    
                    <StyledP2
                      aria-label="subtitle"
                      id="subtitle"
                      multiline={true}
                      value={step.subtitle || ''}
                      placeholder="Subtitle"
                      onChange={e => onChange({...step, subtitle: e.target.value})}
                    />
                    <StyledH1
                      aria-label="title"
                      id="title"
                      multiline={true}
                      value={step.title || ''}
                      placeholder="Title"
                      onChange={e => onChange({...step, title: e.target.value})}
                    />
                    <StyledP2
                      aria-label="detail"
                      id="detail"
                      multiline={true}
                      value={step.detail || ''}
                      placeholder="Description"
                      sx={{marginBottom: theme.spacing(2.5), fontSize: '16px', fontWeight: 400}}
                      onChange={e => onChange({...step, detail: e.target.value})}
                    />
                  </>
                )}

                {
                  <Factory
                    {...{
                      step: {...step},
                      onChange: onChange,
                      q_type: getQuestionId(step),
                    }}></Factory>
                }
              </ScrollableArea>
            </Box>
          </PhoneDisplay>

          {globalSkipConfiguration === 'CUSTOMIZE' && isDynamic && (
            <RequiredToggle
              shouldHideActionsArray={step.shouldHideActions || []}
              onChange={shouldHideActions =>
                onChange({
                  ...step,
                  shouldHideActions,
                })
              }
            />
          )}
        </>
      )}
    </OuterContainer>
  )
}

export default QuestionEditPhone
