import {StepButton} from '@mui/material'
import Step from '@mui/material/Step'
import StepConnector from '@mui/material/StepConnector'
import {StepIconProps} from '@mui/material/StepIcon'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
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
      position: 'absolute',
      left: '-150px',
      width: 'calc(100% + 300px)',
    },
  })
)

type LaunchStepperProps = {
  activeStep: number
  setActiveStepFn: Function
  steps: {label: string; isComplete?: boolean}[]
}

const LaunchStepper: React.FunctionComponent<LaunchStepperProps> = ({
  activeStep,
  setActiveStepFn,
  steps,
}: LaunchStepperProps) => {
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

export default LaunchStepper
