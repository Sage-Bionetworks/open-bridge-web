import {Box, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {ReactElement, useState} from 'react'
import {ReactComponent as ArrowIcon} from '../../../assets/arrow_long.svg'
import {ThemeType} from '../../../style/theme'
import {NextButton, PrevButton} from '../../widgets/StyledComponents'
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

export type SchedulerProps = {
  id: string
  children: React.ReactNode
  onShowFeedback: Function
}

function getSteps() {
  return [
    {label: 'Define Session Start'},
    {label: 'Create Schedule'},
    // {label: 'Configure Optional EMA/Bursts'},
  ]
}

const StepContent: React.FunctionComponent<{
  step: number
  children: React.ReactFragment[]
}> = ({step, children}) => {
  const cntrl = children[step]
  if (!cntrl) {
    return <></>
  }
  return cntrl as ReactElement
}

const Scheduler: React.FunctionComponent<SchedulerProps> = ({
  id,
  onShowFeedback,
  children,
}: SchedulerProps) => {
  const classes = useStyles()

  const [steps, setSteps] = useState(getSteps())
  const [activeStep, setActiveStep] = React.useState(0)
  // const [isFinished, setIsFinished] = React.useState(false)
  const [isNextEnabled, setIsNextEnabled] = React.useState(true)
  type CountdownHandle = React.ElementRef<typeof SessionStartTab>
  const ref1 = React.useRef<CountdownHandle>(null) // assign null makes it compatible with elements.
  type CountdownHandle2 = React.ElementRef<typeof ScheduleCreatorTab>
  const ref2 = React.useRef<CountdownHandle2>(null) // assign null makes it compatible with elements.

  if (!children) {
    return <>error. Please provide nav buttons</>
  }
  const firstPrevButton = (children as any)[0]
  const lastNextButton = (children as any)[1]
  const handleNext = () => {
    const nextStep = activeStep + 1
    ref1.current?.save(nextStep)
    const newSteps = steps.map((s, i) =>
      i === activeStep ? {...s, isComplete: true} : s
    )
    setSteps(newSteps)
  }

  const handleStepClick = (index: number) => {
    ref1.current?.save(index)
    ref2.current?.save(index)
  }

  const handleBack = () => {
    const nextStep = activeStep - 1
    ref2.current?.save(nextStep)
  }

  const handleNavigate = (step: number) => {
    setActiveStep(step)
  }

  return (
    <Paper className={classes.root} elevation={2} id="container">
      <SchedulerStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStepFn={handleStepClick}></SchedulerStepper>

      <div className={classes.instructions}>
        <StepContent step={activeStep}>
          <SessionStartTab id={id} ref={ref1} onNavigate={handleNavigate} />
          <ScheduleCreatorTab
            id={id}
            ref={ref2}
            onNavigate={handleNavigate}
            onShowFeedback={onShowFeedback}
            children={children}></ScheduleCreatorTab>
        </StepContent>
        <Box py={2} px={2} textAlign="right" bgcolor="inherit">
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

          {activeStep < 1 ? (
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
