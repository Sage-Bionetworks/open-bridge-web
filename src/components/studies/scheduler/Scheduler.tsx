import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import React, { FunctionComponent } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps } from 'react-router-dom'
import NavigationPrompt from 'react-router-navigation-prompt'
import { useAsync } from '../../../helpers/AsyncHook'
import { useSessionDataState } from '../../../helpers/AuthContext'
import { useNavigate } from '../../../helpers/hooks'
import StudyService from '../../../services/study.service'
import { poppinsFont } from '../../../style/theme'
import {
  HDWMEnum,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudyDuration
} from '../../../types/scheduling'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import LoadingComponent from '../../widgets/Loader'
import NavButtons from '../NavButtons'
import { StudySection } from '../sections'
import Duration from './Duration'
import IntroInfo from './IntroInfo'
import SchedulableSingleSessionContainer from './SchedulableSingleSessionContainer'
import actionsReducer, {
  ActionTypes,
  SessionScheduleAction
} from './scheduleActions'
import StudyStartDate from './StudyStartDate'
import TimelinePlot from './TimelinePlot'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
    },
    scheduleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: theme.spacing(2),
    },
  }),
)

type SchedulerOwnProps = {
  id: string
  section: StudySection
  nextSection?: StudySection
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = ({
  id,
  section,
  nextSection,
}: SchedulerOwnProps) => {
  const { token} = useSessionDataState()
  const handleError = useErrorHandler()
  const classes = useStyles()
  const { data, status, error, run, setData } = useAsync<{
    schedule?: Schedule
    studyDuration?: StudyDuration
  }>({
    status: id ? 'PENDING' : 'IDLE',
    data: {},
  })

  const [isInitialInfoSet, setIsInitialInfoSet] = React.useState(false)
  const {hasObjectChanged, setHasObjectChanged, saveLoader, setSaveLoader, save} = useNavigate(id, section, nextSection|| '', async()=>{
    await StudyService.saveStudySchedule(
      id,
      data!.schedule!,
      data!.studyDuration!,
      token!
    )
    return
  })

   React.useEffect(() => {
    if (!isInitialInfoSet) {
      return
    }
   save().then(() => {
     console.log('saved')
    })
  }, [isInitialInfoSet])


  const saveSession = async (sessionId: string) => {
    save()
  }


  const getData = async (id: string) => {
    const schedule = await StudyService.getStudySchedule(id, token!)
    const study = await StudyService.getStudy(id, token!)

    return { schedule, studyDuration: study?.studyDuration }
  }

  //get initial data
  React.useEffect(() => {
    if (!id || !token) {
      return
    }
    return run(getData(id))
  }, [id, run, token])

  if (status === 'REJECTED') {
    handleError(error!)
  }
  if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'PENDING') {
    return <>...loading</>
  }

 

  //setting new state
  const updateData = (schedule: Schedule | null, duration: string) => {
    setHasObjectChanged(true)

    console.log('setting data tp ' + { schedule, duration })
    setData({ schedule, studyDuration: duration })
  }

  //set duration part
  const setStudyDuration = (duration: string) => {
    updateData({ ...data!.schedule! }, duration)
  }

  //updating the schedule part
  const setSchedule = (schedule: Schedule) => {
    const duration = data!.studyDuration
    updateData(schedule, duration || '')
  }

  //updating on the intro screen
  const setInitialInfo = async (duration: string, start: StartEventId) => {
  
    if (!data?.schedule) {
      return
    }
    const schedule = { ...data.schedule, startEventId: start }

    updateData(schedule, duration)
     setIsInitialInfoSet(true)

  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    if (!data) {
      return
    }
    const sessions = actionsReducer(data.schedule!.sessions, action)
    const newSchedule = { ...data.schedule!, sessions }
    updateData(newSchedule, data.studyDuration || '')
  }

  if (!data?.schedule) {
    console.log(data, 'data')
    return <h1>Please add some sessions to this study </h1>
  }

  return (
    <>
      <LoadingComponent
        reqStatusLoading={saveLoader}
        loaderSize="2rem"
        variant="small"
        style={{
          display: hasObjectChanged ? 'block' : 'none',
          width: '30px',
          marginBottom: '16px',
          position: 'fixed',
          right: '30px',
          top: '50%',
          zIndex: 100,
        }}
      ></LoadingComponent>
      <NavigationPrompt when={hasObjectChanged}>
        {({ onConfirm, onCancel }) => (
          <ConfirmationDialog
            isOpen={hasObjectChanged}
            type={'NAVIGATE'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </NavigationPrompt>

      {!data.schedule.startEventId  && (
        <IntroInfo onContinue={setInitialInfo}></IntroInfo>
      )}

      {/**/}
      {data.schedule.startEventId && (
        <Box textAlign="left">
          <div className={classes.scheduleHeader}>
            <FormControlLabel
              classes={{ label: classes.labelDuration }}
              label="Study duration:"
              style={{ fontSize: '14px' }}
              labelPlacement="start"
              control={
                <Duration
                  onChange={e => setStudyDuration(e.toString())}
                  durationString={data.studyDuration || ''}
                  unitLabel="study duration unit"
                  numberLabel="study duration number"
                  unitData={HDWMEnum}
                ></Duration>
              }
            />
            {hasObjectChanged && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => save()}
                startIcon={<SaveIcon />}
              >
                Save changes
              </Button>
            )}
          </div>
          <Box bgcolor="#fff" padding="16px" marginTop="24px">
            <TimelinePlot></TimelinePlot>
            <StudyStartDate
              style={{ marginTop: '16px' }}
              startEventId={data.schedule.startEventId as StartEventId}
              onChange={(startEventId: StartEventId) =>
                setSchedule({ ...data.schedule!, startEventId })
              }
            />

            {data.schedule.sessions.map((session, index) => (
              <Box key={session.id}>
                <SchedulableSingleSessionContainer
                  key={session.id}
                  studySession={session}
                  onSaveSessionSchedule={() => saveSession(session.id)}
                  onUpdateSessionSchedule={(schedule: SessionSchedule) => {
                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: { sessionId: session.id, schedule },
                    })
                  }}
                ></SchedulableSingleSessionContainer>
              </Box>
            ))}
          </Box>

          <NavButtons
            id={id}
            currentSection={section}
            onNavigate={save}
          ></NavButtons>
        </Box>
      )}
    </>
  )
}

export default Scheduler
