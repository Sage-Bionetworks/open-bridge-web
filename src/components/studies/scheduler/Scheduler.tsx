import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import _ from 'lodash'
import React, { FunctionComponent } from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import { poppinsFont, theme } from '../../../style/theme'
import {
  DWsEnum,
  PerformanceOrder,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudySession,
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
  SessionScheduleAction,
} from './scheduleActions'
import StudyStartDate from './StudyStartDate'
import Timeline from './Timeline'

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
    studyStartDateContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
)

type SchedulerProps = {
  id: string
  schedule: Schedule
  version?: number
  token: string
  onSave: Function
  errors: string[]
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
  token,
  version,
  errors,
}: SchedulerProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [schedule, setSchedule] = React.useState({ ..._schedule })
  console.log('%c ---scheduler update--' + version, 'color: red')

  const [schedulerErrorState, setSchedulerErrorState] = React.useState(
    new Map<
      string,
      {
        generalErrorMessage: string
        sessionWindowErrors: Map<number, string>
      }
    >(),
  )

  React.useEffect(() => {
    const newErrorState = new Map()
    for (const error of errors) {
      const errorInfo = error.split(' ')
      if (errorInfo.length < 2) continue
      const sessionKey = errorInfo[0]
      const windowNumber = errorInfo[1].startsWith('Window')
        ? parseInt(errorInfo[1].substring(errorInfo[1].length - 1))
        : -1
      const errorMessage = errorInfo[errorInfo.length - 1]
      if (newErrorState.has(sessionKey)) {
        const currentErrorState = newErrorState.get(sessionKey)
        if (windowNumber === -1) {
          currentErrorState!.generalErrorMessage = errorMessage
        } else {
          currentErrorState?.sessionWindowErrors.set(windowNumber, errorMessage)
        }
      } else {
        const errorInfoToAdd = {
          generalErrorMessage: '',
          sessionWindowErrors: new Map<number, string>(),
        }
        if (windowNumber === -1) {
          errorInfoToAdd!.generalErrorMessage = errorMessage
        } else {
          errorInfoToAdd?.sessionWindowErrors.set(windowNumber, errorMessage)
        }
        newErrorState.set(sessionKey, errorInfoToAdd)
      }
    }
    setSchedulerErrorState(newErrorState)
  }, [errors])

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
    return (
      <Box textAlign="center" mx="auto">
        <ErrorDisplay>
          You need to create sessions before creating the schedule
        </ErrorDisplay>
      </Box>
    )
  }

  return (
    <Box>
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
        {/* <ObjectDebug data={timeline} label=""></ObjectDebug> */}
        <div className={classes.scheduleHeader} key="intro">
          <FormControlLabel
            classes={{ label: classes.labelDuration }}
            label="Study duration:"
            style={{ fontSize: '14px' }}
            labelPlacement="start"
            control={
              <Duration
                onChange={e =>
                  updateData({ ...schedule, duration: e.target.value })
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
          <Timeline
            token={token}
            version={version!}
            schedule={schedule}
          ></Timeline>
          <div className={classes.studyStartDateContainer}>
            <StudyStartDate
              style={{
                marginTop: '16px',
              }}
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
          </div>
          {schedule.sessions.map((session, index) => (
            <Box
              mb={2}
              display="flex"
              key={session.guid}
              border={
                schedulerErrorState.get(`${session.name}-${index + 1}`)
                  ? `1px solid ${theme.palette.error.main}`
                  : ''
              }
            >
              <Box className={classes.assessments}>
                <AssessmentList
                  studySessionIndex={index}
                  studySession={session}
                  onChangePerformanceOrder={(
                    performanceOrder: PerformanceOrder,
                  ) => {
                    const schedule = { ...session, performanceOrder }

                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: { sessionId: session.guid!, schedule },
                    })
                  }}
                  performanceOrder={session.performanceOrder || 'sequential'}
                />
              </Box>
              {/* This is what is being displayed as the card */}
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
                sessionErrorState={schedulerErrorState.get(
                  `${session.name}-${index + 1}`,
                )}
              ></SchedulableSingleSessionContainer>
            </Box>
          ))}
        </Box>

        {children}
      </Box>
    </Box>
  )
}

export default Scheduler
