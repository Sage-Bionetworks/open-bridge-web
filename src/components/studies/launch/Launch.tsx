import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import SaveButton from '@components/widgets/SaveButton'
import {Box, Button, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {Schedule} from '@typedefs/scheduling'
import React, {useState} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import {ReactComponent as ArrowIcon} from '../../../assets/arrow_long.svg'
import {ReactComponent as LockIcon} from '../../../assets/launch/lock_icon.svg'
import StudyService from '../../../services/study.service'
import {ThemeType} from '../../../style/theme'
import {Study} from '../../../types/types'
import {NextButton, PrevButton} from '../../widgets/StyledComponents'
import {useSchedule} from '../scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '../studyHooks'
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
  id: string
  children: React.ReactNode
  onShowFeedback: Function
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
  study: Study
  schedule: Schedule
  isFinished: boolean
  onChange: Function
  onEnableNext: Function
  onShowFeedback: Function
}

const StepContent: React.FunctionComponent<StepContentProps> = ({
  stepName,
  study,
  schedule,
  isFinished,
  onChange,
  onEnableNext,
  onShowFeedback,
}) => {
  switch (stepName) {
    case 'Review Alerts':
      return (
        <LaunchAlerts
          study={study}
          schedule={schedule}
          onEnableNext={onEnableNext}
        />
      )
    case 'About Study':
      return (
        <AboutStudy
          study={study}
          onChange={onChange}
          onEnableNext={onEnableNext}
        />
      )
    case 'IRB Details':
      return (
        <IrbDetails
          study={study}
          onShowFeedback={onShowFeedback}
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

const Launch: React.FunctionComponent<LaunchProps> = ({
  id,
  children,
  onShowFeedback,
}: LaunchProps) => {
  const classes = useStyles()
  const {data: sourceStudy, error, isLoading} = useStudy(id)
  const {
    data: schedule,
    error: scheduleError,
    isLoading: scheduleLoading,
  } = useSchedule(id, false)
  const [study, setStudy] = React.useState<Study>()

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateStudy,
    data,
  } = useUpdateStudyDetail()

  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)

  const handleError = useErrorHandler()
  //const [isStudyLive, setIsStudyLive] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)
  const [isStudyLive, setIsStudyLive] = React.useState(false)

  const [steps, setSteps] = useState<{label: string}[]>(getSteps(false))
  const [activeStep, setActiveStep] = React.useState(0)
  const [isFinished, setIsFinished] = React.useState(false)
  const [isNextEnabled, setIsNextEnabled] = React.useState(false)

  React.useEffect(() => {
    if (sourceStudy) {
      setStudy(sourceStudy)

      const isLive =
        StudyService.getDisplayStatusForStudyPhase(sourceStudy.phase) === 'LIVE'
      setIsStudyLive(isLive)
      const steps = getSteps(isLive)
      setSteps(steps)
    }
  }, [sourceStudy])

  if (!study || !schedule) {
    return <></>
  }

  const onSave = async () => {
    {
      if (!study) {
        return
      }
      const missingIrbInfo =
        !study.irbDecisionType || !study.irbDecisionOn || !study.irbExpiresOn
      if (missingIrbInfo) {
        delete study.irbDecisionOn
        delete study.irbExpiresOn
        delete study.irbDecisionType
      }

      try {
        const result = await mutateStudy({study: study})
        setHasObjectChanged(false)
      } catch (e) {
        alert(e)
      } finally {
        console.log('finishing update')
      }
    }
  }

  const onUpdate = (study: Study) => {
    setHasObjectChanged(true)
    setStudy(study)
  }

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
  }

  const isReadOnly = StudyService.isStudyClosedToEdits(study)
  if (isReadOnly) {
    return <ReadOnlyIrbDetails study={study} />
  }
  const showNextButton =
    !isReadOnly &&
    ((!isStudyLive && activeStep < 2) || (isStudyLive && activeStep === 0))

  return (
    <Paper className={classes.root} elevation={2} id="container">
      <NavigationPrompt when={hasObjectChanged} key="nav_prompt">
        {({onConfirm, onCancel}) => (
          <ConfirmationDialog
            isOpen={hasObjectChanged}
            type={'NAVIGATE'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </NavigationPrompt>
      {!isReadOnly && (
        <LaunchStepper
          steps={steps}
          activeStep={activeStep}
          setActiveStepFn={handleStepClick}></LaunchStepper>
      )}

      <div className={classes.instructions}>
        <StepContent
          study={study}
          schedule={schedule}
          stepName={steps[activeStep]?.label}
          onShowFeedback={onShowFeedback}
          isFinished={isFinished}
          onEnableNext={(isEnabled: boolean) => setIsNextEnabled(isEnabled)}
          onChange={(study: Study) => {
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
                      <ArrowIcon /> {steps[activeStep - 1]?.label}
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
                  {steps[activeStep + 1]?.label}
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

              {activeStep == 1 && isStudyLive && (
                <SaveButton
                  variant="contained"
                  color="primary"
                  disabled={!isNextEnabled}
                  onClick={() => onSave()}>
                  Save to App
                </SaveButton>
              )}
            </Box>
          )}
        </div>
      </div>
    </Paper>
  )
}

export default Launch
