import {ReactComponent as PauseIcon} from '@assets/surveys/pause.svg'
import SurveyUtils from '@components/surveys/SurveyUtils'
import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import {Box, styled, Typography, TypographyProps} from '@mui/material'
import {latoFont, theme} from '@style/theme'
import {
  ChoiceQuestion,
  ChoiceQuestionChoice,
  LikertQuestion,
  Step,
  WebUISkipOptions,
} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {getQuestionId, QuestionTypeKey} from '../left-panel/QuestionConfigs'
import FreeText from './phone-subcontrols/FreeText'
import Likert from './phone-subcontrols/Likert'
import Select from './phone-subcontrols/Select'
import SelectExtraActions from './phone-subcontrols/SelectExtraActions'
import PhoneDisplay from './PhoneDisplay'
import QuestionPhoneBottomMenu from './QuestionPhoneBottomMenu'
import RequiredToggle from './RequiredToggle'

const OuterContainer = styled('div')(({theme}) => ({
  bgcolor: '#F8F8F8',
  padding: theme.spacing(0, 5),
  border: '1px solid black',
  margin: '0 auto',
  position: 'relative',
}))

const SkipQuestion = styled(
  (props: TypographyProps) => <Typography {...props}>Skip question</Typography>,
  {label: 'skipQuestion'}
)(({}) => ({
  fontWeight: 400,
  fontSize: '12px',
  lineHeight: '18px',
  textDecoration: 'underline',
}))

const PhoneTop = styled('div')(({}) => ({
  display: 'flex',
  margin: '0 -15px 20px -15px',
  justifyContent: 'space-between',
}))

const StyledP2 = styled(DisappearingInput, {label: 'StyledP2'})(({theme}) => ({
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  color: '#2A2A2A',
  width: '100%',
  '& > input, textarea': {
    padding: theme.spacing(0.125, 1),
  },
}))

const StyledH1 = styled(DisappearingInput, {label: 'StyledH1'})(({theme}) => ({
  fontFamily: latoFont,

  fontWeight: 700,
  fontSize: '16px',

  color: '#2A2A2A',
  '& > input': {
    padding: theme.spacing(0.125, 1),
  },
}))

const ScrollableArea = styled('div')(({}) => ({
  height: '330px',
  marginLeft: '-10px',
  marginRight: '-10px',
  padding: '0 10px',
  overflowY: 'scroll',

  display: 'flex',
  flexDirection: 'column',
}))

/*

const useStyles = makeStyles(theme => ({


  title: {
    fontFamily: latoFont,

    fontWeight: 'bold',
    fontSize: '24px',
    lineHeight: '1.1',
    textAlign: 'center',



  //  color: theme.palette.text.secondary,
  },
  checkboxButton: {
    width: '100%',
    background: '#95CFF4',
    padding: theme.spacing(1, 1),

    boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
    borderRadius: '5px',

    fontFamily: latoFont,

    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '125%',
    textAlign: 'center',
    // display: 'flex',
    // alignItems: 'center',
    // letterSpacing: '0.04em',
    color: '#2A2A2A',
    margin: theme.spacing(1, 0),
  },
  radioSelectButton: {
    width: '100%',
    background: '#95CFF4',
    padding: theme.spacing(3),

    boxShadow: '1px 2px 3px rgba(42, 42, 42, 0.1)',
    borderRadius: '100px',
    fontFamily: latoFont,

    fontWeight: 'bold',
    fontSize: '20px',
    lineHeight: '125%',
    textAlign: 'center',
    // display: 'flex',
    // alignItems: 'center',
    // letterSpacing: '0.04em',
    color: '#2A2A2A',
    margin: theme.spacing(1, 0),
  },
}))*/

type QuestionEditProps = {
  step?: Step
  globalSkipConfiguration: WebUISkipOptions
  completionProgress: number

  onChange: (step: Step) => void

  //  onAdd: (a: string) => void
  // onNavigate: (id: string) => void
}
/*
const CheckboxQuestion: FunctionComponent<InputItem> = inputItem => {

  const [choices, setChoices] = React.useState<ChoiceQuestionChoice[]>([])
  const newChoice: ChoiceQuestionChoice = {
    text: 'New Input',
    value: 'New Input',
  }
  return (
    <Box border="1px solid black">
      {' '}
      QuestionEdit
      <FormGroup>
        {choices.map((choice, index) => (
          <FormControlLabel
            className={classes.checkboxButton}
            control={<Checkbox defaultChecked />}
            label={
              <EditableTextbox
                styleProps={{padding: '8px 0'}}
                initValue={choice.text}
                onTriggerUpdate={(newText: string) => {
                  const _choice = {...choice, text: newText, value: newText}
                  const _choices = [...choices]
                  _choices[index] = _choice
                  setChoices(_choices)
                }}></EditableTextbox>
            }
          />
        ))}
      </FormGroup>
      <Button
        className={classes.checkboxButton}
        onClick={() => {
          setChoices(prev => [...prev, {...newChoice}])
        }}>
        + Add Input
      </Button>
    </Box>
  )
}

const RadioQuestion: FunctionComponent<
  InputItem & {
    choices: ChoiceQuestionChoice[]
    onChange: (c: ChoiceQuestionChoice[]) => void
  }
> = ({onChange, choices, ...props}) => {
  const classes = useStyles()
  //const [choices, setChoices] = React.useState<ChoiceQuestionChoice[]>([])
  const [checkChoice, setCheckChoice] = React.useState<
    number | string | undefined
  >()
  const newChoice: ChoiceQuestionChoice = {
    text: 'New Input',
    value: 'New Input',
  }
  const allChoice: ChoiceQuestionChoice = {
    text: 'All of the above',
    value: 'all',
    exclusive: true,
  }
  const noneChoice: ChoiceQuestionChoice = {
    text: 'None of the above',
    value: 'none',
    exclusive: true,
  }
  const setChoices = (choices: ChoiceQuestionChoice[]) => {
    onChange(choices)
  }
  return (
    <Box>
      <FormGroup>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={checkChoice}
          onChange={e => {
            console.log(e.target.value)
            setCheckChoice(e.target.value)
          }}>
          {choices.map((choice, index) => (
            <FormControlLabel
              className={classes.radioSelectButton}
              control={<Radio value={choice.value || null} />}
              label={
                <EditableTextbox
                  styleProps={{padding: '8px 0'}}
                  initValue={choice.text}
                  onTriggerUpdate={(newText: string) => {
                    const _choice = {...choice, text: newText, value: newText}
                    const _choices = [...choices]
                    _choices[index] = _choice
                    setChoices(_choices)
                  }}></EditableTextbox>
              }
            />
          ))}
        </RadioGroup>
      </FormGroup>

      <Button
        className={classes.radioSelectButton}
        onClick={() => {
          setChoices([...choices, {...newChoice}])
        }}>
        + Add Input
      </Button>
      <Button
        className={classes.radioSelectButton}
        onClick={() => {
          setChoices([...choices, {...allChoice}])
        }}>
        + Add All of the above
      </Button>
      <Button
        className={classes.radioSelectButton}
        onClick={() => {
          setChoices([...choices, {...noneChoice}])
        }}>
        + Add none of the above
      </Button>
    </Box>
  )
}

const TextQuestion: FunctionComponent<InputItem> = inputItem => {
  return <TextField />
}

const DateQuestion: FunctionComponent<InputItem> = inputItem => {
  return (
    <DatePicker
      isYearOnly={true}
      id={'any'}
      value={null}
      onChange={() => {}}
      label={inputItem.fieldLabel}></DatePicker>
  )
}
const TimeQuestion: FunctionComponent<InputItem> = inputItem => {
  return (
    <DatePicker
      isYearOnly={true}
      id={'any'}
      value={null}
      onChange={() => {}}
      label={inputItem.fieldLabel}></DatePicker>
  )
}

const LikertQuestion: FunctionComponent<InputItem> = inputItem => {
  return (
    <FormControl>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group">
        <FormControlLabel value="female" control={<Radio />} label="Female" />
        <FormControlLabel value="male" control={<Radio />} label="Male" />
        <FormControlLabel value="other" control={<Radio />} label="Other" />
        <FormControlLabel
          value="disabled"
          disabled
          control={<Radio />}
          label="other"
        />
      </RadioGroup>
    </FormControl>
  )
}
*/
//type QuestionEditProps = QuestionEditOwnProps

function isSelectQuestion(questionType: QuestionTypeKey | 0): boolean {
  return questionType === 'MULTI_SELECT' || questionType === 'SINGLE_SELECT'
}

function Factory(args: {
  step: Step
  onChange: (step: Step) => void
  q_type: QuestionTypeKey
}) {
  // const type = args.step.controlType === 'checkbox' ? 'checkbox' : 'string'
  /* const props: InputItem = {
    type: type,
    placeholder: 'enter data',
    fieldLabel: args.step.title,
  }
  const updateStepWithChoices = (choices: ChoiceQuestionChoice[]) => {
    console.log('update')
    let result = {...args.step} as ChoiceQuestion
    result.choices = [...choices]
    console.log(result)
    args.onChange(result)
  }*/

  switch (args.q_type) {
    case 'SINGLE_SELECT': {
      let _step = args.step as ChoiceQuestion
      /*  return (
        <RadioQuestion
          {...{
            ...props,
            onChange: updateStepWithChoices,
            choices: _step.choices || [],
          }}
        />
      )*/
      return (
        <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
      )
    }

    case 'MULTI_SELECT':
      return (
        <Select step={args.step as ChoiceQuestion} onChange={args.onChange} />
      )

    case 'LIKERT':
      return (
        <Likert step={args.step as LikertQuestion} onChange={args.onChange} />
      )
    case 'FREE_TEXT':
      return <FreeText step={args.step} onChange={args.onChange} />
    // return <TextQuestion {...props} />
    /* case 'time':
      return <>TIME</>
    // return <TimeQuestion {...props} />

    case 'date':
      return <>DATE</>
    // return <DateQuestion {...props} />
    case 'likert':
      return <>LIKERT</>
    // return <LikertQuestion {...props} />*/
    default:
      return <>nothing</>
  }
}

const PhoneProgressLine: FunctionComponent<{
  completionProgress: number
}> = ({completionProgress}) => {
  return (
    <Box
      sx={{
        //  width: '100%',
        position: 'relative',
        height: '3px',
        margin: '-3px -25px 8px -25px',
        backgroundColor: ' #A7A19C',
      }}>
      <Box
        sx={{
          width: `${completionProgress * 100}%`,
          height: '100%',
          backgroundColor: '#8FD6FF',
        }}></Box>
    </Box>
  )
}

const QuestionEditPhone: FunctionComponent<QuestionEditProps> = ({
  step,
  globalSkipConfiguration,
  completionProgress,
  onChange,
}) => {
  console.log('step changed', step, globalSkipConfiguration)
  const questionId = step ? getQuestionId(step) : 0

  const shouldShowSkipButton = (): boolean => {
    return (
      globalSkipConfiguration === 'SKIP' ||
      !step!.shouldHideActions?.includes('skip')
    )
  }

  const sortSelectChoices = (
    choiceQ: ChoiceQuestion,
    direction: 1 | -1
  ): ChoiceQuestionChoice[] => {
    const qNum = SurveyUtils.getNumberOfRegularSelectChoices(choiceQ.choices)
    const sortableOptions = choiceQ.choices.splice(0, qNum)
    sortableOptions.sort((a, b) => {
      return (a.text > b.text ? 1 : -1) * direction
    })
    const opts = [...sortableOptions, ...choiceQ.choices]
    return opts
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

      {/* QuestionEdit {step?.type}+{JSON.stringify(step?.subtitle)}*/}
      {step ? (
        <>
          <PhoneDisplay
            sx={{marginBottom: '20px', textAlign: 'left'}}
            phoneBottom={
              isSelectQuestion(questionId) ? (
                <QuestionPhoneBottomMenu
                  step={step as ChoiceQuestion}
                  onChange={s => onChange(s)}
                />
              ) : (
                <></>
              )
            }>
            <Box>
              <PhoneProgressLine completionProgress={completionProgress} />
              <PhoneTop>
                <PauseIcon />
                {shouldShowSkipButton() && <SkipQuestion />}
              </PhoneTop>

              <StyledP2
                area-label="subtitle"
                id="subtitle"
                value={step.subtitle || ''}
                placeholder="Subtitle"
                onChange={e => onChange({...step, subtitle: e.target.value})}
              />

              <StyledH1
                area-label="title"
                id="title"
                value={step.title || ''}
                placeholder="Title"
                onChange={e => onChange({...step, title: e.target.value})}
              />
              <ScrollableArea>
                <StyledP2
                  area-label="detail"
                  id="detail"
                  maxRows={4}
                  multiline={true}
                  value={step.detail || ''}
                  placeholder="Description"
                  sx={{marginBottom: theme.spacing(2.5)}}
                  onChange={e => onChange({...step, detail: e.target.value})}
                />

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

          {globalSkipConfiguration === 'CUSTOMIZE' && (
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
      ) : (
        <></>
      )}
    </OuterContainer>
  )
}

export default QuestionEditPhone
