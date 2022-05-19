import {Box, Button} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import {latoFont} from '@style/theme'
import {ControlType, Question, Step} from '@typedefs/surveys'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#464646',
    padding: theme.spacing(5),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
    color: 'white',
  },
  control: {
    backgroundColor: '#3A3939',
    color: '#fff',
    padding: theme.spacing(2),
    fontFamily: latoFont,
    textAlign: 'center',
    fontSize: '21px',
    lineHeight: '27px',
    width: '137px',
    display: 'block',
    height: '128px',
    '&:hover': {
      backgroundColor: '#252525',
    },
    '&.selected': {
      border: '1px solid white',
    },
    '&.Mui-disabled': {
      opacity: 0.3,
    },
  },
  icon: {
    width: '23px',
    height: '23px',
    margin: 'auto',
    marginBottom: theme.spacing(1),
    border: '1px solid white',
    '&.disabled': {
      borderColor: '#ddd',
    },
  },
}))

type ControlSelectorOwnProps = {
  step: Step
  onChange: (step: Step) => void
}

type Control = {
  title: string
  // type: ControlType
  replacements: ControlType[]
}

const controls: Map<ControlType, Control> = new Map([
  [
    'radio',
    {
      title: 'Select One',

      replacements: ['likert', 'checkbox', 'radio'],
    },
  ],
  [
    'checkbox',
    {
      title: 'Checkbox',

      replacements: ['likert', 'checkbox', 'radio'],
    },
  ],
  [
    'text',
    {
      title: 'Text input',
      replacements: [],
    },
  ],
  [
    'likert',
    {
      title: 'Likert Scale',
      replacements: ['likert', 'checkbox', 'radio'],
    },
  ],
  ['date', {title: 'Date', replacements: ['time']}],
  ['time', {title: 'Time', replacements: ['date']}],
])

const ControlToQuesitonType: Map<ControlType, any> = new Map([
  [
    'radio',
    {
      type: 'choiceQuestion',
      singleChoice: true,
      uiHint: 'radio',
      inputItem: undefined,
    },
  ],
  [
    'checkbox',
    {
      type: 'choiceQuestion',
      singleChoice: false,
      uiHint: 'checkmark',
      inputItem: undefined,
    },
  ],
  [
    'text',
    {
      type: 'simpleQuestion',
      inputItem: {type: 'string', placeholder: 'Enter text'},
    },
  ],
  [
    'likert',
    {
      type: 'choiceQuestion',
      singleChoice: true,
      uiHint: 'likert',
      inputItem: undefined,
    },
  ],

  [
    'time',
    {
      type: 'simpleQuestion',
      inputItem: {type: 'time', placeholder: 'Enter time'},
    },
  ],

  [
    'date',
    {
      type: 'simpleQuestion',
      inputItem: {type: 'year', placeholder: 'Enter year'},
    },
  ],
])

type ControlSelectorProps = ControlSelectorOwnProps

const ControlSelector: FunctionComponent<ControlSelectorProps> = ({
  step,
  onChange,
}) => {
  const classes = useStyles()
  //const [selectedControl, setSelectedControl] = React.useState<
  //   Control | undefined
  // >(controls.find(c => c.type === step?.controlType))

  const clickControl = (control: Control, type: ControlType) => {
    /* selectedControl?.type === control.type
      ? setSelectedControl(undefined)
      : setSelectedControl(control)*/

    if (type === step.controlType) {
      onChange({...step, controlType: undefined})
    } else {
      const props = ControlToQuesitonType.get(type)
      if (!props) {
        throw 'ERROR'
      }
      const updatedStep = {
        ...step,
        ...props,
        controlType: type,
      } as Question

      onChange(updatedStep)
    }
  }

  const isControlDisabled = (type: ControlType) => {
    if (!step?.controlType) {
      return false
    }
    return (
      !controls.get(type)?.replacements.includes(type) &&
      step?.controlType !== type
    )
  }

  return (
    <Box className={classes.root} px={5} border="1px solid black">
      ControlSelector
      {[...controls.keys()].map(type => (
        <Button
          key={type}
          className={clsx(
            classes.control,
            type === step?.controlType && 'selected'
          )}
          onClick={() => clickControl(controls.get(type)!, type)}
          disabled={isControlDisabled(type)}>
          <Box
            width={23}
            height={23}
            margin="auto"
            mb={1}
            borderColor="#fff"
            border={'1px solid white'}></Box>
          {controls.get(type)!.title}
        </Button>
      ))}
    </Box>
  )
}
export default ControlSelector
