import {Box, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {useState} from 'react'
import {ReactComponent as ArrowIcon} from '../../../assets/arrow_long.svg'
import {ThemeType} from '../../../style/theme'
import {Schedule} from '../../../types/scheduling'
import {Study, StudyBuilderComponentProps} from '../../../types/types'
import {NextButton, PrevButton} from '../../widgets/StyledComponents'
import {SchedulerErrorType} from '../StudyBuilder'
import ConfigureBurstTab from './ConfigureBurstTab'
import ScheduleCreatorTab from './ScheduleCreatorTab'
import SchedulerStepper from './SchedulerStepper'
import SessionStartTab from './SessionStartTab'

const useStyles = makeStyles((theme: ThemeType) => ({
  root: {
    padding: theme.spacing(0, 0, 2, 0),

    backgroundColor: 'transparent',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    // backgroundColor: theme.palette.common.white,
  },
}))

type SchedulerProps = {
  id: string
  schedule: Schedule
  version?: number
  token: string
  onSave: Function
  schedulerErrors: SchedulerErrorType[]
}

function getSteps() {
  return [
    {label: 'Define Session Start'},
    {label: 'Create Schedule'},
    {label: 'Configure Optional EMA/Bursts'},
  ]
}

type StepContentProps = {
  step: number
  schedule: Schedule
  isFinished: boolean
  onChange: Function
  onEnableNext: Function
}

const StepContent: React.FunctionComponent<
  StepContentProps & SchedulerProps & StudyBuilderComponentProps
> = props => {
  switch (props.step) {
    case 0:
      return (
        <SessionStartTab
          schedule={props.schedule!}
          onUpdate={props.onChange}
          onSave={props.onChange}
        />
      )
    case 1:
      return <ScheduleCreatorTab {...props}></ScheduleCreatorTab>

    case 2:
      return <ConfigureBurstTab {...props}></ConfigureBurstTab>

    default:
      return <>'Unknown step'</>
  }
}

const Scheduler: React.FunctionComponent<
  SchedulerProps & StudyBuilderComponentProps
> = (props: SchedulerProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [steps, setSteps] = useState(getSteps())
  const [activeStep, setActiveStep] = React.useState(2)
  const [isFinished, setIsFinished] = React.useState(false)
  const [isNextEnabled, setIsNextEnabled] = React.useState(true)

  if (!props.children) {
    return <>error. Please provide nav buttons</>
  }
  const firstPrevButton = (props.children as any)[0]
  const lastNextButton = (props.children as any)[1]
  const handleNext = () => {
    const newSteps = steps.map((s, i) =>
      i === activeStep ? {...s, isComplete: true} : s
    )
    setSteps(newSteps)
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    props.onSave()
  }

  const handleStepClick = (index: number) => {
    setActiveStep(index)
    props.onSave()
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
    props.onSave()
  }

  const submitAndLock = () => {
    props.onSave()
    setIsFinished(true)
    setIsFinished(true)
  }

  const handleReset = () => {
    setActiveStep(0)
  }
  return (
    <Paper className={classes.root} elevation={2} id="container">
      <SchedulerStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStepFn={handleStepClick}></SchedulerStepper>

      <div className={classes.instructions}>
        <StepContent
          {...props}
          step={activeStep}
          isFinished={isFinished}
          onEnableNext={(isEnabled: boolean) => setIsNextEnabled(isEnabled)}
          onChange={(study: Study) => {
            console.log('onChange', study)
            props.onUpdate(study)
          }}
        />{' '}
        <Box py={2} px={2} textAlign="right" bgcolor="#fff">
          <>
            {activeStep === 0 ? (
              firstPrevButton
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

          {activeStep < 2 ? (
            <NextButton
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!isNextEnabled}>
              {steps[activeStep + 1].label} <ArrowIcon />
            </NextButton>
          ) : (
            lastNextButton
          )}
        </Box>
      </div>
    </Paper>
  )
}

export default Scheduler
