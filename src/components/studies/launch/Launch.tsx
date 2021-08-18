import {Box, Button, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {useState} from 'react'
import {ReactComponent as ArrowIcon} from '../../../assets/arrow_long.svg'
import {ReactComponent as LockIcon} from '../../../assets/launch/lock_icon.svg'
import {StudyInfoData} from '../../../helpers/StudyInfoContext'
import {ThemeType} from '../../../style/theme'
import {Study, StudyBuilderComponentProps} from '../../../types/types'
import {NextButton, PrevButton} from '../../widgets/StyledComponents'
import AboutStudy from './AboutStudy'
import IrbDetails from './IrbDetails'
import LaunchAlerts from './LaunchAlerts'
import LaunchStepper from './LaunchStepper'
import ReadOnlyIrbDetails from './read-only-components/ReadOnlyIrbDetails'

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
  studyInfo: StudyInfoData
  onSave: Function
}

function getSteps(isLive: boolean) {
  if (isLive) {
    return [{label: 'About Study'}, {label: 'IRB Details'}]
  }
  return [
    {label: 'Review Alerts'},
    {label: 'About Study'},
    {label: 'IRB Details'},
    {label: 'Study is live'},
  ]
}

type StepContentProps = {
  stepName: string
  studyInfo: StudyInfoData
  isFinished: boolean
  onChange: Function
  onEnableNext: Function
}

const StepContent: React.FunctionComponent<StepContentProps> = ({
  stepName,
  studyInfo,
  isFinished,
  onChange,
  onEnableNext,
}) => {
  switch (stepName) {
    case 'Review Alerts':
      return <LaunchAlerts studyInfo={studyInfo} onEnableNext={onEnableNext} />
    case 'About Study':
      return (
        <AboutStudy
          study={studyInfo.study}
          onChange={onChange}
          onEnableNext={onEnableNext}
        />
      )
    case 'IRB Details':
      return (
        <IrbDetails
          study={studyInfo.study}
          onChange={onChange}
          isFinished={isFinished}
          onEnableNext={onEnableNext}
        />
      )
    case 'Study is Live':
      return <>'Study is live...'</>

    default:
      return <>'Unknown step'</>
  }
}

const Launch: React.FunctionComponent<
  LaunchProps & StudyBuilderComponentProps
> = ({
  studyInfo,
  onUpdate,
  onSave,
  hasObjectChanged,
  saveLoader,
  children,
  isReadOnly,
}: LaunchProps & StudyBuilderComponentProps) => {
  const classes = useStyles()
  const isStudyLive = studyInfo.study.phase === 'in_flight'
  const [steps, setSteps] = useState(getSteps(isStudyLive))
  const [activeStep, setActiveStep] = React.useState(0)
  const [isFinished, setIsFinished] = React.useState(false)
  const [isNextEnabled, setIsNextEnabled] = React.useState(false)

  const handleNext = () => {
    const newSteps = steps.map((s, i) =>
      i === activeStep ? {...s, isComplete: true} : s
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

  const submitAndLock = () => {
    onSave()
    setIsFinished(true)
    setIsFinished(true)
  }

  const handleReset = () => {
    setActiveStep(0)
  }

  if (isReadOnly) {
    return <ReadOnlyIrbDetails study={studyInfo.study} />
  }
  const showNextButton =
    (!isReadOnly && activeStep < 2) || (isStudyLive && activeStep === 0)
  return (
    <Paper className={classes.root} elevation={2} id="container">
      {!isReadOnly && (
        <LaunchStepper
          steps={steps}
          activeStep={activeStep}
          setActiveStepFn={handleStepClick}></LaunchStepper>
      )}

      <div className={classes.instructions}>
        <StepContent
          studyInfo={studyInfo}
          stepName={steps[activeStep].label}
          isFinished={isFinished}
          onEnableNext={(isEnabled: boolean) => setIsNextEnabled(isEnabled)}
          onChange={(study: Study) => {
            console.log('onChange', study)
            onUpdate(study)
          }}
        />{' '}
        <div>
          {!isFinished && (
            <Box py={2} textAlign="right">
              {activeStep < 3 && (
                <>
                  {activeStep === 0 ? (
                    children
                  ) : (
                    <PrevButton
                      variant="outlined"
                      color="primary"
                      onClick={handleBack}>
                      <ArrowIcon /> {steps[activeStep - 1].label}
                    </PrevButton>
                  )}
                  &nbsp;&nbsp;
                </>
              )}

              {showNextButton && (
                <NextButton
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  disabled={!isNextEnabled}>
                  {steps[activeStep + 1].label}
                  <ArrowIcon />
                </NextButton>
              )}

              {activeStep == 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => submitAndLock()}
                  disabled={!isNextEnabled}>
                  <LockIcon style={{marginRight: '4px'}} />
                  Submit and lock the study
                </Button>
              )}
            </Box>
          )}
        </div>
      </div>
    </Paper>
  )
}

export default Launch
