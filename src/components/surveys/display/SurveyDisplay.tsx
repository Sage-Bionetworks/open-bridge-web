import DatePicker from '@components/widgets/DatePicker'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'
import test from '../sample.json'
import {
  ChoiceQuestion,
  InputItem,
  Instruction,
  MultipleInputQuestion,
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
    case 'comboBoxQuestion': {
      const s = step as ChoiceQuestion
      return <SurveyChoiceQuestion {...s}></SurveyChoiceQuestion>
    }
    case 'multipleInputQuestion': {
      const s = step as MultipleInputQuestion
      return <SurveyMultipleInputQuestion {...s}></SurveyMultipleInputQuestion>
    }

    default:
      return <div>unknown</div>
  }
}

type SurveyQuestionProps = SurveyQuestionOwnProps/*& RouteComponentProps*/

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
  InputItem & {
    isDisabled: boolean
    identifier: string
    val: string
    onChange: (e: string) => void
  }
> = inputItem => {
  // const [textVal, setTextVal] = React.useState<string | Date | null>('')
  return (
    <TextField
      id={inputItem.identifier}
      label={inputItem.fieldLabel}
      onChange={e => inputItem.onChange(e.target.value)}
      disabled={inputItem.isDisabled}
      value={inputItem.val || ''}
      defaultValue={inputItem.placeholder}
    />
  )
}

const CheckboxSimpleQuestion: FunctionComponent<
  InputItem & {
    isDisabled: boolean
    identifier: string
    val: boolean
    onChange: (e: boolean) => void
  }
> = inputItem => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={inputItem.val === true}
          onChange={e => inputItem.onChange(e.target.checked)}
          name={inputItem.identifier}
          disabled={inputItem.isDisabled}
        />
      }
      label={inputItem.fieldLabel}
    />
  )
}

const DateSimpleQuestion: FunctionComponent<
  InputItem & {
    isDisabled: boolean
    identifier: string
    val: Date | null
    onChange: (e: Date | null) => void
  }
> = inputItem => {
  return (
    <DatePicker
      isYearOnly={true}
      disabled={inputItem.isDisabled}
      label={inputItem.fieldLabel}
      id={inputItem.identifier}
      value={inputItem.val}
      onChange={e => inputItem.onChange(e)}></DatePicker>
  )
}

const SimpleInputItem: FunctionComponent<
  Question & {
    isDisabled: boolean
    val: Date | string | boolean | null
    onChange: (e: any) => void
  }
> = inst => {
  const props = {
    ...inst.inputItem,
    isDisabled: inst.isDisabled,
    identifier: inst.identifier,
  }
  switch (inst.inputItem.type) {
    case 'checkbox':
      return (
        <CheckboxSimpleQuestion
          {...{...props, val: inst.val as boolean, onChange: inst.onChange}}
        />
      )
    case 'string':
      return (
        <TextSimpleQuestion
          {...{...props, val: inst.val as string, onChange: inst.onChange}}
        />
      )
    case 'year':
      return (
        <DateSimpleQuestion
          {...{...props, val: inst.val as Date, onChange: inst.onChange}}
        />
      )
    default:
      return <></>
  }
}

const SimpleSurveyQuestion: FunctionComponent<Question> = inst => {
  const [val, setVal] = React.useState<boolean | string | Date | null>(false)

  const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

  return (
    <>
      {inst.skipCheckbox ? (
        <Box display="flex">
          <SimpleInputItem
            {...{
              ...inst,
              isDisabled,
              val,
              onChange: (e: boolean | string | Date | null) => setVal(e),
            }}
          />
          <SkipCheckbox
            fieldLabel={inst.skipCheckbox.fieldLabel}
            onChecked={(isChecked: boolean) => {
              if (isChecked) {
                setVal(null)
              }
              setIsDisabled(isChecked)
            }}
          />
        </Box>
      ) : (
        <SimpleInputItem
          {...{
            ...inst,
            isDisabled,
            val,
            onChange: (e: boolean | string | Date | null) => setVal(e),
          }}
        />
      )}
    </>
  )
}

const SurveyChoiceQuestion: FunctionComponent<
  ChoiceQuestion & {isCombo?: boolean}
> = inst => {
  const [state, setState] = React.useState({})
  const [checkChoice, setCheckChoice] = React.useState<
    (string | undefined | null)[]
  >([])

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

  const radioControl = (
    <FormControl>
      <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel>
      <RadioGroup
        aria-labelledby={inst.title}
        name={inst.identifier}
        value={Number(checkChoice[0] || '0')}
        onChange={e => {
          console.log(e.target.value)
          setCheckChoice([e.target.value])
        }}>
        {inst.choices?.map((choice, index) => (
          <FormControlLabel
            key={index}
            value={choice.value || null}
            control={<Radio />}
            label={choice.text}
          />
        ))}
      </RadioGroup>
    </FormControl>
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
      {inst.singleChoice ? radioControl : checkboxList}
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

const SurveyMultipleInputQuestion: FunctionComponent<MultipleInputQuestion> =
  inst => {
    const [val, setVal] = React.useState<(boolean | string | Date | null)[]>([])

    const [isDisabled, setIsDisabled] = React.useState<boolean>(false)

    //  const items = inst.inputItems.map((item, index) => {
    /*    <SimpleInputItem
      {...{
        ...item,
        isDisabled,
        val: val[index],
        title: '',
        identifier: item.fieldLabel

        onChange: (e: boolean | string | Date | null) => setVal(e),
      }

    />}*/
    return <>not supported</>
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
