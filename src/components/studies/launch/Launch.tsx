import { Button, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { useStudy } from '../../../helpers/hooks'
import { navigateAndSave } from '../../../helpers/utility'
import { ThemeType } from '../../../style/theme'
import { StudySection } from '../sections'
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
  id: string
  section: StudySection
  nextSection?: StudySection
}

function getSteps() {
  return [
    { label: 'Study payment' },
    { label: 'Review Alerts' },
    { label: 'IRB Details' },
    { label: 'Study is live' },
  ]
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'Study payment...'
    case 1:
      return 'Review Alerts...'
    case 2:
      return 'IRB Details...'
    case 3:
      return 'Study is live...'

    default:
      return 'Unknown step'
  }
}

const Launch: React.FunctionComponent<LaunchProps> = ({ id, section, nextSection }: LaunchProps) => {
  const handleError = useErrorHandler()
  const classes = useStyles()


  const { data, status, error } = useStudy(id)
  const [isLoading, setIsLoading] = useState(false)
  const [steps, setSteps] = useState(getSteps())
  const [activeStep, setActiveStep] = React.useState(0)
  
  const [hasObjectChanged, setHasObjectChanged] = useState(false)
  const [saveLoader, setSaveLoader] = useState(false)
  const save = async (url?: string) => {

    setSaveLoader(true)
    setHasObjectChanged(false)
    setSaveLoader(false)
    if (url) {
      window.location.replace(url)
    }
  }

  React.useEffect(() => {
    navigateAndSave(id, nextSection, section, hasObjectChanged, save)
  }, [nextSection, section])

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
              {getStepContent(activeStep)}
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
