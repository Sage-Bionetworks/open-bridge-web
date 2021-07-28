import {StepButton} from '@material-ui/core'
import Step from '@material-ui/core/Step'
import StepConnector from '@material-ui/core/StepConnector'
import {StepIconProps} from '@material-ui/core/StepIcon'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import {
  createStyles,
  makeStyles,
  Theme,
  withStyles,
} from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import {ReactComponent as IrbIcon} from '../../../assets/launch/irb_icon.svg'
import {ReactComponent as ReviewIcon} from '../../../assets/launch/review_icon.svg'
import {ReactComponent as RocketIcon} from '../../../assets/launch/rocket_icon.svg'
import {ReactComponent as TagIcon} from '../../../assets/launch/tag_icon.svg'
import {ReactComponent as TagIconInactive} from '../../../assets/launch/tag_icon_inactive.svg'

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      /*backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',*/
      backgroundColor: '#FFE500',
    },
  },
  completed: {
    '& $line': {
      /*
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',*/
      backgroundColor: '#FFE500',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#E3E1D3',
    borderRadius: 1,
  },
})(StepConnector)
const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#E3E1D3',
    zIndex: 1,
    color: '#fff',
    width: 40,
    height: 40,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#FFE500',
  },
  completed: {
    backgroundColor: '#FFE500',
  },
})

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles()
  const {active, completed} = props

  const icons: {
    [index: string]: {
      active: React.ReactElement
      inactive: React.ReactElement
    }
  } = {
    1: {active: <ReviewIcon />, inactive: <ReviewIcon />},
    2: {active: <TagIcon />, inactive: <TagIconInactive />},
    3: {active: <IrbIcon />, inactive: <IrbIcon />},
    4: {active: <RocketIcon />, inactive: <RocketIcon />},
  }
  const iconNode = icons[String(props.icon)]

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}>
      {active || completed ? iconNode.active : iconNode.inactive}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '130px',
      position: 'relative',
    },
    stepperRoot: {
      backgroundColor: 'transparent',
      position: 'absolute',
      left: '-150px',
      width: 'calc(100% + 300px)',
    },
  })
)

type SchedulerStepperProps = {
  activeStep: number
  setActiveStepFn: Function
  steps: {label: string; isComplete?: boolean}[]
}

const SchedulerStepper: React.FunctionComponent<SchedulerStepperProps> = ({
  activeStep,
  setActiveStepFn,
  steps,
}: SchedulerStepperProps) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        classes={{root: classes.stepperRoot}}
        connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton
              onClick={() => setActiveStepFn(index)}
              completed={step.isComplete}
              disabled={!step.isComplete}>
              <StepLabel StepIconComponent={ColorlibStepIcon}>
                {step.label}
              </StepLabel>
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </div>
  )
}

export default SchedulerStepper
