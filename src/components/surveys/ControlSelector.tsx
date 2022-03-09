import {Box, Button, makeStyles} from '@material-ui/core'
import {latoFont} from '@style/theme'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {ControlType, Question, Step} from './types'

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#464646',
    padding: theme.spacing(5),
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
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
  type: ControlType
  replacements: ControlType[]
}

const controls: Control[] = [
  {
    title: 'Select One',
    type: 'radio',
    replacements: ['likert', 'checkbox', 'radio'],
  },
  {
    title: 'Checkbox',
    type: 'checkbox',
    replacements: ['likert', 'checkbox', 'radio'],
  },
  {title: 'Text input', type: 'text', replacements: []},
  {
    title: 'Likert Scale',
    type: 'likert',
    replacements: ['likert', 'checkbox', 'radio'],
  },
  {title: 'Date', type: 'date', replacements: ['time']},
  {title: 'Time', type: 'time', replacements: ['date']},
]

const ControlToQuesitonType = {
  radio: {
    type: 'choiceQuestion',
    singleChoice: true,
    uiHint: 'radio',
    inputItem: undefined,
  },
  checkbox: {
    type: 'choiceQuestion',
    singleChoice: false,
    uiHint: 'checkmark',
    inputItem: undefined,
  },
  text: {
    type: 'simpleQuestion',
    inputItem: {type: 'string', placeholder: 'Enter text'},
  },
  likert: {
    type: 'choiceQuestion',
    singleChoice: true,
    uiHint: 'likert',
    inputItem: undefined,
  },

  time: {
    type: 'simpleQuestion',
    inputItem: {type: 'time', placeholder: 'Enter time'},
  },

  date: {
    type: 'simpleQuestion',
    inputItem: {type: 'year', placeholder: 'Enter year'},
  },
}

type ControlSelectorProps = ControlSelectorOwnProps

const ControlSelector: FunctionComponent<ControlSelectorProps> = ({
  step,
  onChange,
}) => {
  const classes = useStyles()
  //const [selectedControl, setSelectedControl] = React.useState<
  //   Control | undefined
  // >(controls.find(c => c.type === step?.controlType))

  const clickControl = (control: Control) => {
    /* selectedControl?.type === control.type
      ? setSelectedControl(undefined)
      : setSelectedControl(control)*/

    if (control.type === step.controlType) {
      onChange({...step, controlType: undefined})
    } else {
      const props = ControlToQuesitonType[control.type]
      if (!props) {
        throw 'ERROR'
      }
      const updatedStep = {
        ...step,
        ...props,
        controlType: control.type,
      } as Question

      onChange(updatedStep)
    }
  }
  const getSelectedControl = () =>
    controls.find(c => c.type === step?.controlType)

  const isControlDisabled = (type: ControlType) => {
    const selectedControl = getSelectedControl()
    if (!selectedControl) {
      return false
    }
    return (
      !selectedControl.replacements.includes(type) &&
      selectedControl.type !== type
    )
  }

  return (
    <Box className={classes.root} px={5}>
      {controls.map(control => (
        <Button
          key={control.type}
          className={clsx(
            classes.control,
            control.type === getSelectedControl()?.type && 'selected'
          )}
          onClick={() => clickControl(control)}
          disabled={isControlDisabled(control.type)}>
          <Box
            width={23}
            height={23}
            margin="auto"
            mb={1}
            borderColor="#fff"
            border={'1px solid white'}></Box>
          {control.title}
        </Button>
      ))}
    </Box>
  )
}
export default ControlSelector
