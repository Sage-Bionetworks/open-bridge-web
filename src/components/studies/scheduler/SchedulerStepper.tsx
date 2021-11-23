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
import {ReactComponent as EmaIcon} from '../../../assets/scheduler/ema_icon.svg'
import {ReactComponent as ScheduleIcon} from '../../../assets/scheduler/schedule_icon.svg'

const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: '#BCD5E4',
    },
  },
  completed: {
    '& $line': {
      backgroundColor: '#BCD5E4',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#FFF',
    borderRadius: 1,
  },
})(StepConnector)
const useColorlibStepIconStyles = makeStyles({
  root: {
    backgroundColor: '#FFF',
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
    backgroundColor: '#BCD5E4',
  },
  completed: {
    backgroundColor: '#BCD5E4',
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
    1: {active: <ScheduleIcon />, inactive: <ScheduleIcon />},
    2: {active: <EmaIcon />, inactive: <EmaIcon />},
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
      margin: '0 auto',
      width: theme.spacing(98),
      padding: 0,
    },
    stepLabel: {
      maxWidth: theme.spacing(10),
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
        classes={{
          root: classes.stepperRoot,
        }}
        connector={<ColorlibConnector />}>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepButton
              onClick={() => setActiveStepFn(index)}
              completed={step.isComplete}
              disabled={!step.isComplete}>
              <StepLabel
                className={classes.stepLabel}
                StepIconComponent={ColorlibStepIcon}>
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
