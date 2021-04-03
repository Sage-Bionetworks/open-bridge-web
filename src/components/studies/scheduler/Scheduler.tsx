import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import _ from 'lodash'
import React, { FunctionComponent } from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import { poppinsFont } from '../../../style/theme'
import {
  DWsEnum,
  PerformanceOrder,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudySession
} from '../../../types/scheduling'
import { StudyBuilderComponentProps } from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import ErrorDisplay from '../../widgets/ErrorDisplay'
import Loader from '../../widgets/Loader'
import AssessmentList from './AssessmentList'
import Duration from './Duration'
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
    assessments: {
      width: '286px',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: '#BCD5E4',
      padding: theme.spacing(1),
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
  onSave: Function
}

const Scheduler: FunctionComponent<
  SchedulerProps & StudyBuilderComponentProps
> = ({
  hasObjectChanged,
  saveLoader,
  onUpdate,
  schedule: _schedule,
  onSave,
  children,
}: SchedulerProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [schedule, setSchedule] = React.useState({ ..._schedule })
  //console.log('scheduler:',_schedule)

  const getStartEventIdFromSchedule = (
    schedule: Schedule,
  ): StartEventId | null => {
    if (_.isEmpty(schedule.sessions)) {
      return null
    }
    const eventIdArray = schedule.sessions.reduce(
      (acc, curr) => (curr.startEventId ? [...acc, curr.startEventId] : acc),
      [] as StartEventId[],
    )

    if (_.uniq(eventIdArray).length > 1) {
      throw Error('startEventIds should be the same for all sessions')
    } else {
      return eventIdArray[0]
    }
  }

  const saveSession = async (sessionId: string) => {
    onSave()
  }

  //setting new state
  const updateData = (schedule: Schedule) => {
    setSchedule(schedule)
    onUpdate(schedule)
  }

  //updating the schedule part
  const updateSessionsWithStartEventId = (
    sessions: StudySession[],
    startEventId: StartEventId,
  ) => {
    return sessions.map(s => ({ ...s, startEventId }))
  }



  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions, action)
    const newSchedule = { ...schedule, sessions }
    updateData(newSchedule)
  }



  if (_.isEmpty(schedule.sessions)) {
    return <Box textAlign="center" mx="auto"><ErrorDisplay>You need to create sessions before creating the schedule</ErrorDisplay></Box>
  }

  return (
    <>
    <Loader reqStatusLoading={saveLoader} key="loader"></Loader>
      <NavigationPrompt when={hasObjectChanged} key="prompt">
        {({ onConfirm, onCancel }) => (
          <ConfirmationDialog
            isOpen={hasObjectChanged}
            type={'NAVIGATE'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </NavigationPrompt>

        <Box textAlign="left" key="content">
          <div className={classes.scheduleHeader} key="intro">
            <FormControlLabel
              classes={{ label: classes.labelDuration }}
              label="Study duration:"
              style={{ fontSize: '14px' }}
              labelPlacement="start"
              control={
                <Duration
                  onChange={e =>
                    updateData({ ...schedule, duration: e.target.value})
                  }
                  durationString={schedule.duration || ''}
                  unitLabel="study duration unit"
                  numberLabel="study duration number"
                  unitData={DWsEnum}
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
          <Box bgcolor="#fff" p={2} mt={3} key="scheduler">
            <TimelinePlot something=""></TimelinePlot>
            <StudyStartDate
              style={{ marginTop: '16px' }}
              startEventId={
                getStartEventIdFromSchedule(schedule) as StartEventId
              }
              onChange={(startEventId: StartEventId) => {
                const sessions = updateSessionsWithStartEventId(
                  schedule.sessions,
                  startEventId,
                )
                updateData({ ...schedule, sessions })
              }}
            />

            {schedule.sessions.map((session, index) => (
              <Box mb={2} display="flex" key={session.guid}>
                <Box className={classes.assessments}>
                  <AssessmentList
                    studySessionIndex={index}
                    studySession={session}
                    onChangePerformanceOrder={(performanceOrder: PerformanceOrder) => {
                      const schedule = {...session, performanceOrder}

                      scheduleUpdateFn({
                        type: ActionTypes.UpdateSessionSchedule,
                        payload: { sessionId: session.guid!, schedule },
                      })
                    }}


                  
                   
                    performanceOrder={session.performanceOrder || 'sequential'}
                  />
                </Box>

                <SchedulableSingleSessionContainer
                  key={session.guid}
                  studySession={session}
                  onSaveSessionSchedule={() => saveSession(session.guid!)}
                  onUpdateSessionSchedule={(schedule: SessionSchedule) => {
                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: { sessionId: session.guid!, schedule },
                    })
                  }}
                ></SchedulableSingleSessionContainer>
              </Box>
            ))}
          </Box>

          {children}
        </Box>
   
    </>
  )
}

export default Scheduler
