import { Box, Button, Paper, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { ReactComponent as ArrowIcon } from '../../../assets/arrow_long.svg'
import { ReactComponent as LockIcon } from '../../../assets/launch/lock_icon.svg'
import { ThemeType } from '../../../style/theme'
import { Study, StudyBuilderComponentProps } from '../../../types/types'
import { NextButton, PrevButton } from '../../widgets/StyledComponents'
import AboutStudy from './AboutStudy'
import IrbDetails from './IrbDetails'
import LaunchAlerts from './LaunchAlerts'
import LaunchStepper from './LaunchStepper'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(3, 8),
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
  onSave: Function

}

function getSteps() {
  return [
    { label: 'Review Alerts' },
    { label: 'About Study' },
    { label: 'IRB Details' },
    { label: 'Study is live' },
  ]
}

type StepContentProps = {
  step: number
  study: Study
  isFinished: boolean
  onChange: Function
}

const StepContent: React.FunctionComponent<StepContentProps> = ({
  step,
  study,
  isFinished,
  onChange,

}: StepContentProps) => {
  switch (step) {
    case 0:
      return <LaunchAlerts study={study} />
    case 1:
      return <AboutStudy study={study} onChange={onChange} />
    case 2:
      return <IrbDetails study={study} isFinished={isFinished} />
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
  onSave,
  hasObjectChanged,
  saveLoader,
  children,
}: LaunchProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [steps, setSteps] = useState(getSteps())
  const [activeStep, setActiveStep] = React.useState(0)
  const [isFinished, setIsFinished] = React.useState(false)

  const handleNext = () => {
    const newSteps = steps.map((s, i) =>
      i === activeStep ? { ...s, isComplete: true } : s,
    )
    setSteps(newSteps)
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    onSave()
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    onSave()
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
    onSave()
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  return (
    <Paper className={classes.root} elevation={2} id="container">
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
              <StepContent
                study={study}
                step={activeStep}
                isFinished={isFinished}
                onChange={(study: Study) => {
                  console.log('onChange', study)
                  onUpdate(study)
                }}
              />
            </Typography>
            <div>
              {!isFinished && (
                <Box py={2} textAlign="left">
                  {activeStep > 0 && activeStep < 3 && (
                    <>
                      <PrevButton
                        variant="outlined"
                        color="primary"
                        onClick={handleBack}
                      >
                        <ArrowIcon /> {steps[activeStep - 1].label}
                      </PrevButton>{' '}
                      &nbsp;&nbsp;
                    </>
                  )}

                  {activeStep < 2 && (
                    <NextButton
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                    >
                      {steps[activeStep + 1].label} <ArrowIcon />
                    </NextButton>
                  )}

                  {activeStep == 2 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setIsFinished(true)}
                    >
                      {' '}
                      <LockIcon style={{ marginRight: '4px' }} />
                      Submit and lock the study
                    </Button>
                  )}
                </Box>
              )}
            </div>
          </div>
        )}
      </div>
    </Paper>
  )
}

export default Launch
