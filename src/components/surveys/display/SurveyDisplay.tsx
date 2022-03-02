import DatePicker from '@components/widgets/DatePicker'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  makeStyles,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'
import test from '../sample.json'
import {
  ChoiceQuestion,
  InputItem,
  Instruction,
  Question,
  Step,
  Survey,
} from '../types'

const useStyles = makeStyles(theme => ({
  root: {},
}))

type SurveyQuestionOwnProps = {
  studyId?: string
}

function Factory(step: Step) {
  switch (step.type) {
    case 'instruction':
      return <SurveyInstruction {...step} />
    case 'simpleQuestion':
      const s = step as Question
      return <SimpleSurveyQuestion {...s} />
    case 'choiceQuestion': {
      const s = step as ChoiceQuestion
      return <SurveyChoiceQuestion {...s}></SurveyChoiceQuestion>
    }
    case 'multipleInputQuestion': {
    }

    default:
      return <div>unknown</div>
  }
}

type SurveyQuestionProps = SurveyQuestionOwnProps /*& RouteComponentProps*/

const SkipCheckbox: FunctionComponent<{
  fieldLabel: string
  onChecked: Function
}> = args => {
  const [val, setVal] = React.useState(false)
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={val === true}
          onChange={e => {
            setVal(e.target.checked)

            args.onChecked(e.target.checked)
          }}
          name={'skip'}
        />
      }
      label={args.fieldLabel}
    />
  )
}

const TextSimpleQuestion: FunctionComponent<
  InputItem & {isDisabled: boolean; identifier: string}
> = inputItem => {
  const [textVal, setTextVal] = React.useState<string | Date | null>('')
  return (
    <TextField
      id={inputItem.identifier}
      label={inputItem.fieldLabel}
      onChange={e => setTextVal(e.target.value)}
      disabled={inputItem.isDisabled}
      value={textVal || ''}
      defaultValue={inputItem.placeholder}
    />
  )
}

const CheckboxSimpleQuestion: FunctionComponent<
  InputItem & {isDisabled: boolean; identifier: string}
> = inputItem => {
  const [val, setVal] = React.useState<boolean | null>(false)
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={val === true}
          onChange={e => setVal(e.target.checked)}
          name={inputItem.identifier}
          disabled={inputItem.isDisabled}
        />
      }
      label={inputItem.fieldLabel}
    />
  )
}

const DateSimpleQuestion: FunctionComponent<
  InputItem & {isDisabled: boolean; identifier: string}
> = inputItem => {
  const [val, setVal] = React.useState<Date | null>(null)
  return (
    <DatePicker
      isYearOnly={true}
      disabled={inputItem.isDisabled}
      label={inputItem.fieldLabel}
      id={inputItem.identifier}
      value={val as Date}
      onChange={e => {
        setVal(e || null)
      }}></DatePicker>
  )
}

const SimpleInputItem: FunctionComponent<Question & {isDisabled: boolean}> =
  inst => {
    const props = {
      ...inst.inputItem,
      isDisabled: inst.isDisabled,
      identifier: inst.identifier,
    }
    switch (inst.inputItem.type) {
      case 'checkbox':
        return <CheckboxSimpleQuestion {...props} />
      case 'string':
        return <TextSimpleQuestion {...props} />
      case 'year':
        return <DateSimpleQuestion {...props} />
      default:
        return <></>
    }
  }

const SimpleSurveyQuestion: FunctionComponent<Question> = inst => {
  const [val, setVal] = React.useState<boolean | null>(false)
  const [textVal, setTextVal] = React.useState<string | Date | null>('')
  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  return (
    <>
      {inst.skipCheckbox ? (
        <Box display="flex">
          <SimpleInputItem {...{...inst, isDisabled}} />
          <SkipCheckbox
            fieldLabel={inst.skipCheckbox.fieldLabel}
            onChecked={(isChecked: boolean) => {
              if (isChecked) {
                setVal(null)
                setTextVal(null)
              }
              setIsDisabled(isChecked)
            }}
          />
        </Box>
      ) : (
        <SimpleInputItem {...{...inst, isDisabled}} />
      )}
    </>
  )
}

const SurveyChoiceQuestion: FunctionComponent<ChoiceQuestion> = inst => {
  const [state, setState] = React.useState({
    gilad: true,
    jason: false,
    antoine: false,
  })
  const [checkChoice, setCheckChoice] = React.useState<(string | undefined)[]>(
    []
  )

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState({...state, [event.target.name]: event.target.checked})
  }
  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    isExclusive?: boolean
  ) => {
    if (isExclusive) {
      if (event.target.checked) {
        setCheckChoice([undefined])
      } else {
        setCheckChoice([])
      }
    } else {
      if (event.target.checked) {
        setCheckChoice(prev =>
          prev.includes(event.target.value)
            ? [...prev]
            : [...prev, event.target.value.toString()].filter(
                e => e !== undefined
              )
        )
        console.log(checkChoice)
      } else {
        setCheckChoice(prev =>
          prev.filter(x => x !== event.target.value.toString())
        )
      }
    }
    console.log(checkChoice)
  }

  /* "singleChoice": false,
      "baseType": "integer",
      "uiHint": "checkmark",*/

  const selectControl = (
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={''}
      onChange={e => {}}>
      {inst.choices?.map(choice => (
        <MenuItem value={choice.value}>{choice.text}</MenuItem>
      ))}
    </Select>
  )

  const checkboxList = (
    <FormGroup>
      {inst.choices?.map(choice => (
        <>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkChoice.includes(choice.value?.toString())}
                value={choice.value}
                onChange={e => handleCheckboxChange(e, choice.exclusive)}
                name={choice.text}
              />
            }
            label={choice.text}
          />
        </>
      ))}
    </FormGroup>
  )

  return (
    <SurveyInstruction {...inst} optional={inst.optional}>
      {inst.singleChoice ? selectControl : checkboxList}
    </SurveyInstruction>
  )
}

const SurveyInstruction: FunctionComponent<
  Instruction & {children?: React.ReactNode; optional?: boolean}
> = inst => {
  return (
    <div>
      <h1>
        {inst.title}
        {!inst.optional && '*'}
      </h1>
      {inst.subtitle && <h2>{inst.subtitle}</h2>}
      {inst.detail && <Typography>{inst.detail}</Typography>}
      {inst.children && inst.children}
      {inst.footnote && <Typography>{inst.footnote}</Typography>}
    </div>
  )
}

const SurveyDisplay: FunctionComponent<SurveyQuestionProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const classes = useStyles()
  const [survey, setSurvey] = React.useState<Survey>()
  return (
    <Box>
      <h1> {test.title}</h1>
      <h2> {test.subtitle}</h2>
      <p>{test.detail}</p>
      <p>minutes: {test.estimatedMinutes}</p>
      <Box>
        {test.steps
          .map(step => step as Step)
          .map(step => (
            <Accordion>
              <AccordionSummary key={step.identifier} id={step.identifier}>
                <Typography>{step.title}</Typography>
              </AccordionSummary>
              <AccordionDetails style={{display: 'block'}}>
                <Factory {...step}></Factory>
              </AccordionDetails>
            </Accordion>
          ))}
      </Box>
    </Box>
  )
}
export default SurveyDisplay
