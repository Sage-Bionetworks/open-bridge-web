import {ReactComponent as LockIcon} from '@assets/launch/lock_icon.svg'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'

import {Box, Button, Container} from '@mui/material'

import {useSchedule} from '@services/scheduleHooks'
import StudyService from '@services/study.service'
import {useStudy, useUpdateStudyDetail} from '@services/studyHooks'
import {Schedule} from '@typedefs/scheduling'
import {Study} from '@typedefs/types'
import React, {useState} from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import {BuilderWrapper} from '../StudyBuilder'
import AboutStudy from './AboutStudy'
import IrbDetails from './IrbDetails'
import LaunchAlerts from './LaunchAlerts'
import LaunchStepper from './LaunchStepper'
import ReadOnlyIrbDetails from './read-only-components/ReadOnlyIrbDetails'

export interface LaunchProps {
  id: string
  children: React.ReactNode
  onShowFeedback: Function
}

function getSteps(isLive: boolean) {
  if (isLive) {
    return [{label: 'About Study'}, {label: 'IRB Details'}]
  }
  return [{label: 'Review Alerts'}, {label: 'About Study'}, {label: 'IRB Details'}, {label: 'Study is live'}]
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
      return <LaunchAlerts study={study} schedule={schedule} onEnableNext={onEnableNext} />
    case 'About Study':
      return <AboutStudy study={study} onChange={onChange} onEnableNext={onEnableNext} />
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

const Launch: React.FunctionComponent<LaunchProps> = ({id, children, onShowFeedback}: LaunchProps) => {
  const {data: sourceStudy} = useStudy(id)
  const {data: schedule} = useSchedule(id, false)
  const [study, setStudy] = React.useState<Study>()

  const {mutateAsync: mutateStudy} = useUpdateStudyDetail()

  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)

  const [isStudyLive, setIsStudyLive] = React.useState(false)

  const [steps, setSteps] = useState<{label: string}[]>(getSteps(false))
  const [activeStep, setActiveStep] = React.useState(0)
  const [isFinished, setIsFinished] = React.useState(false)
  const [isNextEnabled, setIsNextEnabled] = React.useState(false)

  React.useEffect(() => {
    if (sourceStudy) {
      setStudy(sourceStudy)

      const isLive = StudyService.getDisplayStatusForStudyPhase(sourceStudy.phase) === 'LIVE'
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
      const missingIrbInfo = !study.irbDecisionType || !study.irbDecisionOn || !study.irbExpiresOn
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
    const newSteps = steps.map((s, i) => (i === activeStep ? {...s, isComplete: true} : s))
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
  const showButton = !isReadOnly && ((!isStudyLive && activeStep < 2) || (isStudyLive && activeStep === 0))

  return (
    <>
      <NavigationPrompt when={hasObjectChanged} key="nav_prompt">
        {({onConfirm, onCancel}) => (
          <ConfirmationDialog isOpen={hasObjectChanged} type={'NAVIGATE'} onCancel={onCancel} onConfirm={onConfirm} />
        )}
      </NavigationPrompt>

      <div>
        <BuilderWrapper sectionName="Launch Study Requirements">
          {!isReadOnly && (
            <LaunchStepper steps={steps} activeStep={activeStep} setActiveStepFn={handleStepClick}></LaunchStepper>
          )}
          <Box sx={{maxWidth: 'md'}}>
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
            />
          </Box>
        </BuilderWrapper>
        <Container
          maxWidth="md"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {!isFinished && (
            <Box py={2} textAlign="right">
              {activeStep < 3 && (
                <>
                  {activeStep === 0 ? (
                    children
                  ) : (
                    <Button variant="outlined" color="primary" onClick={handleBack}>
                      {steps[activeStep - 1]?.label}
                    </Button>
                  )}
                  &nbsp;&nbsp;
                </>
              )}

              {showButton && (
                <Button
                  variant="contained"
                  sx={{width: '180px'}}
                  color="primary"
                  onClick={handleNext}
                  disabled={!isNextEnabled}>
                  Next
                </Button>
              )}

              {activeStep === 2 && (
                <Button variant="contained" color="primary" onClick={() => submitAndLock()} disabled={!isNextEnabled}>
                  <LockIcon style={{marginRight: '4px'}} />
                  Submit and lock the study
                </Button>
              )}

              {activeStep === 1 && isStudyLive && (
                <Button variant="contained" disabled={!isNextEnabled} onClick={() => onSave()}>
                  Save Changes to App
                </Button>
              )}
            </Box>
          )}
        </Container>
      </div>
    </>
  )
}

export default Launch
