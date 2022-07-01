import {DisappearingInput} from '@components/surveys/widgets/SharedStyled'
import {Box, styled} from '@mui/material'
import {latoFont} from '@style/theme'
import {ChoiceQuestion, Step, WebUISkipOptions} from '@typedefs/surveys'
import {FunctionComponent} from 'react'
import {getQuestionId, QuestionTypeKey} from '../left-panel/QuestionConfigs'
import FreeText from './phone-subcontrols/FreeText'
import Select from './phone-subcontrols/Select'
import PhoneDisplay from './PhoneDisplay'
import QuestionPhoneBottomMenu from './QuestionPhoneBottomMenu'
import RequiredToggle from './RequiredToggle'

const StyledP2 = styled(DisappearingInput, {label: 'StyledP2'})(({theme}) => ({
  fontFamily: latoFont,
  fontWeight: 400,
  fontSize: '12px',
  color: '#2A2A2A',
}))

const StyledH1 = styled(DisappearingInput, {label: 'StyledH1'})(({theme}) => ({
  fontFamily: latoFont,

  fontWeight: 700,
  fontSize: '16px',

  color: '#2A2A2A',
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
        <Select
          step={args.step as ChoiceQuestion}
          onChange={args.onChange}
          isMulti={true}
        />
      )
      return <>CHECKBOX</>
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

const QuestionEditPhone: FunctionComponent<QuestionEditProps> = ({
  step,
  globalSkipConfiguration,
  onChange,
}) => {
  console.log('step changed', step, globalSkipConfiguration)
  // const [isRequired, setIsRequired] = React.useState(false)
  const questionId = step ? getQuestionId(step) : 0

  const shouldShowSkipButton = (): boolean => {
    return (
      globalSkipConfiguration === 'SKIP' ||
      !step!.shouldHideActions?.includes('skip')
    )
  }

  return (
    <Box bgcolor="#F8F8F8" px={5} border="1px solid black" margin="0 auto">
      QuestionEdit {step?.type}+{JSON.stringify(step?.subtitle)}
      {step ? (
        <>
          <PhoneDisplay
            sx={{marginBottom: '20px'}}
            phoneBottom={
              questionId === 'MULTI_SELECT' ||
              questionId === 'SINGLE_SELECT' ? (
                <QuestionPhoneBottomMenu
                  step={step as ChoiceQuestion}
                  onChange={s => onChange(s)}
                />
              ) : (
                <></>
              )
            }>
            <Box>
              {shouldShowSkipButton() && <> Skip Question</>}
              <div>
                <StyledP2
                  area-label="subtitle"
                  id="subtitle"
                  value={step.subtitle || ''}
                  placeholder="Subtitle"
                  onChange={e => onChange({...step, subtitle: e.target.value})}
                />
              </div>
              <div>
                <StyledH1
                  area-label="title"
                  id="title"
                  value={step.title || ''}
                  placeholder="Title"
                  onChange={e => onChange({...step, title: e.target.value})}
                />
              </div>
              <div>
                <StyledP2
                  area-label="detail"
                  id="detail"
                  maxRows={4}
                  multiline={true}
                  value={step.detail || ''}
                  placeholder="Description"
                  onChange={e => onChange({...step, detail: e.target.value})}
                />
              </div>
              {
                <Factory
                  {...{
                    step: {...step},
                    onChange: onChange,
                    q_type: getQuestionId(step),
                  }}></Factory>
              }
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
    </Box>
  )
}
export default QuestionEditPhone
