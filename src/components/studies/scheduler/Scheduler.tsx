import LoadingComponent from '@components/widgets/Loader'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {ReactElement, useState} from 'react'
import {ReactComponent as ArrowIcon} from '../../../assets/arrow_long.svg'
import {ThemeType} from '../../../style/theme'
import {NextButton, PrevButton} from '../../widgets/StyledComponents'
import ConfigureBurstTab from './ConfigureBurstTab'
import ScheduleCreatorTab from './ScheduleCreatorTab'
import SchedulerStepper from './SchedulerStepper'

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
  },
}))

export type SchedulerProps = {
  id: string
  children: React.ReactNode
  onShowFeedback: Function
}

function getSteps() {
  return [{label: 'Create Schedule'}, {label: 'Configure Optional EMA/Bursts'}]
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
  const [saveLoader, setSaveLoader] = React.useState(false)
  const [isNextEnabled, setIsNextEnabled] = React.useState(true)

  type CountdownHandle2 = React.ElementRef<typeof ScheduleCreatorTab>
  const ref2 = React.useRef<CountdownHandle2>(null) // assign null makes it compatible with elements.
  type CountdownHandle3 = React.ElementRef<typeof ConfigureBurstTab>
  const ref3 = React.useRef<CountdownHandle3>(null) // assign null makes it compatible with elements.

  if (!children) {
    return <>error. Please provide nav buttons</>
  }
  const firstPrevButton = (children as any)[0]
  const lastNextButton = (children as any)[2]

  const doStep = (increment: number) => {
    setSaveLoader(true)
    const nextStep = activeStep + increment
    switch (activeStep) {
      case 0:
        ref2.current?.save(nextStep)
        return
      case 1:
        ref3.current?.save(nextStep)
        return
      default:
        ref3.current?.save(nextStep)
    }

    const newSteps = steps.map((s, i) =>
      i === activeStep ? {...s, isComplete: true} : s
    )
    setSteps(newSteps)
  }

  const handleStepClick = (index: number) => {
    setSaveLoader(true)

    ref2.current?.save(index)
    ref3.current?.save(index)
  }

  const handleNavigate = (step: number) => {
    setActiveStep(step)
    setSaveLoader(false)
  }

  return (
    <Box className={classes.root} id="container">
      <SchedulerStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStepFn={handleStepClick}></SchedulerStepper>

      <div className={classes.instructions}>
        <LoadingComponent
          reqStatusLoading={saveLoader}
          loaderSize="2rem"
          variant={'small'}
        />
        <StepContent step={activeStep}>
          <ScheduleCreatorTab
            id={id}
            ref={ref2}
            onNavigate={handleNavigate}
            onShowFeedback={onShowFeedback}
            children={children}></ScheduleCreatorTab>
          <ConfigureBurstTab
            id={id}
            ref={ref3}
            onNavigate={handleNavigate}
            //  onShowFeedback={onShowFeedback}
            children={children}></ConfigureBurstTab>
        </StepContent>
        <Box py={2} px={2} textAlign="right" bgcolor="inherit">
          <>
            {activeStep === 0 ? (
              firstPrevButton
            ) : (
              <PrevButton
                variant="outlined"
                color="primary"
                onClick={() => {
                  doStep(-1)
                }}>
                <ArrowIcon />
                {steps[activeStep - 1].label}
              </PrevButton>
            )}
            &nbsp;&nbsp;
          </>

          {activeStep < 1 ? (
            <NextButton
              variant="contained"
              color="primary"
              onClick={() => doStep(+1)}
              disabled={!isNextEnabled}>
              {steps[activeStep + 1].label}
              <ArrowIcon />
            </NextButton>
          ) : (
            lastNextButton
          )}
        </Box>
      </div>
    </Box>
  )
}

export default Scheduler
