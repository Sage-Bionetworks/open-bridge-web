import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { ThemeType } from '../../../style/theme'
import { Study, StudyBuilderComponentProps } from '../../../types/types'
import AboutStudy from './AboutStudy'
import IrbDetails from './IrbDetails'
import LaunchAlerts from './LaunchAlerts'
import LaunchStepper from './LaunchStepper'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3),
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}))

export interface LaunchProps {
  study: Study
}

function getSteps() {
  return [

    { label: 'Review Alerts' },
    { label: 'About Study' },
    { label: 'IRB Details' },
    { label: 'Study is live' },
  ]
}

const  StepContent: React.FunctionComponent<{step: number, study: Study}>=({step,study}: {step: number, study: Study}) => {
  switch (step) {
    case 0:
      return <LaunchAlerts study={study}/>
    case 1:
      return <AboutStudy study={study}/>
    case 2:
      return <IrbDetails study={study}/>
    case 3:
      return <>'Study is live...'</>

    default:
      return <>'Unknown step'</>
  }
}

const Launch: React.FunctionComponent<
  LaunchProps & StudyBuilderComponentProps
> = ({
  study,
  onUpdate,
  hasObjectChanged,
  saveLoader,
  children,
}: LaunchProps & StudyBuilderComponentProps) => {

  const classes = useStyles()

  const [steps, setSteps] = useState(getSteps())
  const [activeStep, setActiveStep] = React.useState(0)


  const handleNext = () => {
    const newSteps = steps.map((s, i) =>
      i === activeStep ? { ...s, isComplete: true } : s,
    )
    setSteps(newSteps)
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <>
      {' '}
      <h3>Launch Study Requirements</h3>
      <LaunchStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStepFn={handleStepClick}
      ></LaunchStepper>
      <div>
        {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset} className={classes.button}>
              Reset
            </Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
             <StepContent study={study} step={activeStep}/>
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.button}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Launch
