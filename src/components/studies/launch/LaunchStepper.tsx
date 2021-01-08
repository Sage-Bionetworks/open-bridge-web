import React from 'react'
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles'
import clsx from 'clsx'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import Check from '@material-ui/icons/Check'
import SettingsIcon from '@material-ui/icons/Settings'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import VideoLabelIcon from '@material-ui/icons/VideoLabel'
import StepConnector from '@material-ui/core/StepConnector'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { StepIconProps } from '@material-ui/core/StepIcon'
import { StepButton } from '@material-ui/core'

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
    backgroundColor: '#eaeaf0',
    borderRadius: 1,
  },
})(StepConnector)

const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundColor: '#FFE500',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',

    /*backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',*/
  },
  completed: {
    /*
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  */
    backgroundColor: '#FFE500',
  },
})

function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStyles()
  const { active, completed } = props
  console.log(props)

  const icons: { [index: string]: React.ReactElement } = {
    1: <SettingsIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  }

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
      })}
    >
      {icons[String(props.icon)]}
    </div>
  )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
  }),
)

type LaunchStepperProps = {
  activeStep: number
  setActiveStepFn: Function
  steps: { label: string; isComplete?: boolean }[]
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
        connector={<ColorlibConnector />}
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton
              onClick={() => setActiveStepFn(index)}
              completed={step.isComplete}
              disabled={!step.isComplete}
            >
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
