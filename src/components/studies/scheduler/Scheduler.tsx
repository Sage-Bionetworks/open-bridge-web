import LoadingComponent from '@components/widgets/Loader'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React, {ReactElement, useState} from 'react'
import {ThemeType} from '../../../style/theme'
import ConfigureBurstTab from './ConfigureBurstTab'
import ScheduleCreatorTab from './ScheduleCreatorTab'

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

  const handleNavigate = (step: number) => {
    setActiveStep(step)
    setSaveLoader(false)
  }

  return (
    <Box className={classes.root} id="container">
      <div className={classes.instructions}>
        <LoadingComponent
          reqStatusLoading={saveLoader}
          loaderSize="2rem"
          variant={'small'}
        />

        <ScheduleCreatorTab
          id={id}
          ref={ref2}
          onNavigate={handleNavigate}
          onShowFeedback={onShowFeedback}
          children={children}></ScheduleCreatorTab>
      </div>
    </Box>
  )
}

export default Scheduler
