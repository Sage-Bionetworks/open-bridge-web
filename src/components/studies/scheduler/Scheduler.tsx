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
import NavigationPrompt from 'react-router-navigation-prompt'
import { poppinsFont } from '../../../style/theme'
import {
  HDWMEnum,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudyDuration
} from '../../../types/scheduling'
import { StudyBuilderComponentProps } from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
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

type SchedulerProps = {
  id: string
  schedule: Schedule
  studyDuration?: StudyDuration
  onSave: Function
}

const Scheduler: FunctionComponent<
  SchedulerProps & StudyBuilderComponentProps
> = ({
  hasObjectChanged: _changed,
  saveLoader,
  onUpdate,
  schedule: _schedule,
  onSave,
  studyDuration,
  children,
}: SchedulerProps & StudyBuilderComponentProps) => {
  const classes = useStyles()
 // const [isInitialInfoSet, setIsInitialInfoSet] = React.useState(studyDuration && _schedule.startEventId)
  const [schedule, setSchedule] = React.useState({ ..._schedule })
  const [duration, setDuration] = React.useState(studyDuration)
  const[hasObjectChanged, setHasObjectChanged] = React.useState(_changed)
  console.log('rerender', duration)
 /* React.useEffect(() => {
    const timer = setInterval(() => {
      const equal = _.isEqual(_schedule, schedule) && _.isEqual(studyDuration, duration)
      if (!equal) {
        console.log('duration', duration)
        onUpdate({ schedule, studyDuration: duration })
      }
    }, 5000)
    // Clear timeout if the component is unmounted
    return () => clearInterval(timer)
  })*/

 /* React.useEffect(() => {
    if (!isInitialInfoSet) {
      return
    }

    onSave()
  }, [isInitialInfoSet])*/

  const saveSession = async (sessionId: string) => {
    onSave()
  }

  //setting new state
  const updateData = (schedule: Schedule, duration: string) => {
    setSchedule(schedule)
    setDuration(duration)
    setHasObjectChanged(true)
    onUpdate({ schedule, studyDuration: duration })
  }

  //set duration part
  const setStudyDuration = (duration: string) => {
    updateData(schedule, duration)
  }

  //updating the schedule part
  const updateSchedule = (schedule: Schedule) => {
    updateData(schedule, duration || '')
  }

  //updating on the intro screen
  const setInitialInfo = async (duration: string, start: StartEventId) => {
    const _schedule = { ...schedule, startEventId: start }
    updateData(_schedule, duration)
   // setIsInitialInfoSet(true)
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions, action)
    const newSchedule = { ...schedule, sessions }
    updateData(newSchedule, studyDuration || '')
  }

  return (
    <>
     
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

      {!schedule.startEventId &&  (
        <IntroInfo onContinue={setInitialInfo}></IntroInfo>
      )}

      {/**/}
      {schedule.startEventId && (
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
                  durationString={studyDuration || ''}
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
                onClick={() => onSave()}
                startIcon={<SaveIcon />}
              >
                Save changes
              </Button>
            )}
          </div>
          <Box bgcolor="#fff" p={2} mt={3}>
            <TimelinePlot></TimelinePlot>
            <StudyStartDate
              style={{ marginTop: '16px' }}
              startEventId={schedule.startEventId as StartEventId}
              onChange={(startEventId: StartEventId) => {
                
                updateSchedule({ ...schedule, startEventId })
              }
              }
            />

            {schedule.sessions.map((session, index) => (
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

          {children}
        </Box>
      )}
    </>
  )
}

export default Scheduler
