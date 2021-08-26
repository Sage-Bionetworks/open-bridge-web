import {Box, Paper} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {ReactElement, useState} from 'react'
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
import StudyService from '@services/study.service'

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
  schedule: Schedule

  token: string
  onSave: Function
  schedulerErrors: SchedulerErrorType[]
  study: Study
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

const Scheduler: React.FunctionComponent<
  SchedulerProps & StudyBuilderComponentProps
> = (props: SchedulerProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [steps, setSteps] = useState(getSteps())
  const [activeStep, setActiveStep] = React.useState(0)
  // const [isFinished, setIsFinished] = React.useState(false)
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

  return (
    <Paper className={classes.root} elevation={2} id="container">
      <SchedulerStepper
        steps={steps}
        activeStep={activeStep}
        setActiveStepFn={handleStepClick}></SchedulerStepper>

      <div className={classes.instructions}>
        <StepContent step={activeStep}>
          <SessionStartTab {...props} />
          <ScheduleCreatorTab
            isReadOnly={!StudyService.isStudyInDesign(props.study)}
            {...props}></ScheduleCreatorTab>
          <ConfigureBurstTab {...props}></ConfigureBurstTab>
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
