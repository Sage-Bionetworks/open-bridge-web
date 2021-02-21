import { StepButton } from '@material-ui/core'
import Step from '@material-ui/core/Step'
import StepConnector from '@material-ui/core/StepConnector'
import { StepIconProps } from '@material-ui/core/StepIcon'
import StepLabel from '@material-ui/core/StepLabel'
import Stepper from '@material-ui/core/Stepper'
import {
  createStyles, makeStyles,
  Theme,

  withStyles
} from '@material-ui/core/styles'
import GroupAddIcon from '@material-ui/icons/GroupAdd'
import SettingsIcon from '@material-ui/icons/Settings'
import VideoLabelIcon from '@material-ui/icons/VideoLabel'
import clsx from 'clsx'
import React from 'react'

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
