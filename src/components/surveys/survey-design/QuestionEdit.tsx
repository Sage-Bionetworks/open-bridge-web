import DatePicker from '@components/widgets/DatePicker'
import EditableTextbox from '@components/widgets/EditableTextbox'
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import React, {FunctionComponent} from 'react'
import {ChoiceQuestion, ChoiceQuestionChoice, InputItem, Step} from '../types'
import PhoneDisplay from '../widgets/PhoneDisplay'

const useStyles = makeStyles(theme => ({
  root: {},
  phone: {
    height: '590px',
    width: '307px',
    border: '1px solid black',
    borderRadius: '25px',
    padding: theme.spacing(5, 2),
  },
  title: {
    fontFamily: latoFont,

    fontWeight: 'bold',
    fontSize: '24px',
    lineHeight: '1.1',
    textAlign: 'center',

    /* Black: Dark Font */

    color: theme.palette.text.secondary,
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
}))

type QuestionEditOwnProps = {
  step?: Step
  onChange: (step: Step) => void
  //  onAdd: (a: string) => void
  // onNavigate: (id: string) => void
}

const CheckboxQuestion: FunctionComponent<InputItem> = inputItem => {
  const classes = useStyles()
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

type QuestionEditProps = QuestionEditOwnProps

function Factory(args: {step: Step; onChange: (step: Step) => void}) {
  const type = args.step.controlType === 'checkbox' ? 'checkbox' : 'string'
  const props: InputItem = {
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
  }

  switch (args.step.controlType) {
    case 'radio': {
      let _step = args.step as ChoiceQuestion
      return (
        <RadioQuestion
          {...{
            ...props,
            onChange: updateStepWithChoices,
            choices: _step.choices || [],
          }}
        />
      )
    }

    case 'checkbox':
      return <CheckboxQuestion {...props} />
    case 'text':
      return <TextQuestion {...props} />
    case 'time':
      return <TimeQuestion {...props} />
    case 'date':
      return <DateQuestion {...props} />
    case 'likert':
      return <LikertQuestion {...props} />
    default:
      return <>nothing</>
  }
}

const QuestionEdit: FunctionComponent<QuestionEditProps> = ({
  step,
  onChange,
}) => {
  const classes = useStyles()
  console.log('step changed')

  return (
    <Box bgcolor="#F8F8F8" px={5} border="1px solid black">
      QuestionEdit
      <PhoneDisplay>
        {step ? (
          <Box>
            <div className={classes.title}>
              <EditableTextbox
                styleProps={{padding: '8px 0'}}
                initValue={step.title}
                onTriggerUpdate={(newText: string) =>
                  onChange({...step, title: newText})
                }></EditableTextbox>
            </div>

            <Factory {...{step: {...step}, onChange: onChange}}></Factory>
          </Box>
        ) : (
          <></>
        )}
      </PhoneDisplay>
    </Box>
  )
}
export default QuestionEdit
