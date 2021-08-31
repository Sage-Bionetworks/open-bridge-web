import {
  Box,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import StudyService from '@services/study.service'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import {poppinsFont, theme} from '../../../style/theme'
import {
  DWsEnum,
  PerformanceOrder,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudySession,
} from '../../../types/scheduling'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import ErrorDisplay from '../../widgets/ErrorDisplay'
import SaveButton from '../../widgets/SaveButton'
import {useSchedule, useUpdateSchedule} from '../scheduleHooks'
import {useStudy} from '../studyHooks'
import AssessmentList from './AssessmentList'
import Duration from './Duration'
import ReadOnlyScheduler from './read-only-pages/ReadOnlyScheduler'
import SchedulableSingleSessionContainer from './SchedulableSingleSessionContainer'
import actionsReducer, {
  ActionTypes,
  SessionScheduleAction,
} from './scheduleActions'
import Timeline from './ScheduleTimeline'
import StudyStartDate from './StudyStartDate'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sessionContainer: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      '&:last-child': {
        marginBottom: 0,
      },
    },
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
    studyStartDateContainer: {
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    assessments: {
      width: '286px',
      flexGrow: 0,
      flexShrink: 0,
      padding: theme.spacing(1),
      backgroundColor: '#BCD5E4',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
)

export const getStartEventIdFromSchedule = (
  schedule: Schedule
): StartEventId | null => {
  if (_.isEmpty(schedule.sessions)) {
    return null
  }
  const eventIdArray = schedule.sessions.reduce(
    (acc, curr) => (curr.startEventId ? [...acc, curr.startEventId] : acc),
    [] as StartEventId[]
  )

  if (_.uniq(eventIdArray).length > 1) {
    throw Error('startEventIds should be the same for all sessions')
  } else {
    return eventIdArray[0]
  }
}

export type SchedulerErrorType = {
  errors: any
  entity: any
}
type ScheduleCreatorTabProps = {
  id: string
  children: React.ReactNode
  //schedule: Schedule
  //  version?: number
  // token: string
  //onSave: Function
  // schedulerErrors: SchedulerErrorType[]
  // study: Study
  //isReadOnly?: boolean
}

const ScheduleCreatorTab: FunctionComponent<ScheduleCreatorTabProps> = ({
  id,
  //hasObjectChanged,
  //saveLoader,
  // onUpdate,
  // schedule: _schedule,
  // onSave,
  children,
}: //token,
//version,
//study,
//schedulerErrors,
// isReadOnly,
ScheduleCreatorTabProps) => {
  const classes = useStyles()
  const [isErrorAlert, setIsErrorAlert] = React.useState(true)
  const {data: study, error, isLoading} = useStudy(id)
  const {data: _schedule} = useSchedule(id)

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateSchedule,
    data,
  } = useUpdateSchedule()

  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [schedulerErrors, setScheduleErrors] = React.useState<
    SchedulerErrorType[]
  >([]) //ALINA TODO
  const [isReadOnly, setIsReadOnly] = React.useState(true)
  const handleError = useErrorHandler()
  const [saveLoader, setSaveLoader] = React.useState(false)

  const [schedule, setSchedule] = React.useState<Schedule | undefined>()
  console.log('%c ---scheduler update--' + study?.version, 'color: red')

  const [schedulerErrorState, setSchedulerErrorState] = React.useState(
    new Map<
      string,
      {
        generalErrorMessage: string[]
        sessionWindowErrors: Map<number, string>
        notificationErrors: Map<number, string>
      }
    >()
  )

  React.useEffect(() => {
    const newErrorState = parseErrors(schedulerErrors)
    setSchedulerErrorState(newErrorState)
  }, [schedulerErrors])

  React.useEffect(() => {
    if (study) {
      setIsReadOnly(!StudyService.isStudyInDesign(study))
    }
  }, [study])

  React.useEffect(() => {
    if (_schedule) {
      console.log('----setting schedule----')

      setSchedule(_schedule)
    }
  }, [_schedule])

  if (!schedule?.sessions) {
    return <>...loading</>
  }

  const onSave = async (isButtonPressed?: boolean) => {
    console.log('starting save')
    setSaveLoader(true)
    try {
      const result = await mutateSchedule({
        studyId: id,
        schedule,
        action: 'UPDATE',
      })
      setHasObjectChanged(false)
    } catch (e) {
      console.log('ERROR IN SCHEDULER', e)

      if (e.statusCode === 401) {
        handleError(e)
      }
      console.log(e, 'error')
      const entity = e.entity
      const errors = e.errors
      // This can occur when a request fails due to reasons besides bad user input.
      if (!errors || !entity) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        // alina todo
        console.log('todo')
        // setError(prev => [...prev, e.message])
        return undefined
      }
      const errorObject = {
        entity: entity,
        errors: errors,
      }
      setScheduleErrors(prev => [...prev, errorObject])
    } finally {
      setSaveLoader(false)
      console.log('ending save')
    }
  }

  function parseErrors(_schedulerErrors: SchedulerErrorType[]) {
    const newErrorState = new Map()
    for (const error of _schedulerErrors) {
      const {entity, errors} = error
      const ks = Object.keys(errors)
      ks.forEach((key, index) => {
        const keyArr = key.split('.')
        //first session, timewindow, message
        var numberPattern = /\d+/g
        let windowIndex
        let notificationIndex
        const sessionIndex = _.first(keyArr[0]?.match(numberPattern))
        // This should not happen
        if (!sessionIndex) return
        // if 3 levels - assume window
        if (keyArr.length > 2) {
          if (keyArr[1].startsWith('notifications')) {
            // notfication error
            notificationIndex = _.first(keyArr[1]?.match(numberPattern))
          } else {
            // assume window error
            windowIndex = _.first(keyArr[1]?.match(numberPattern))
          }
        }
        const errorType = keyArr[keyArr.length - 1]
        const currentError = errors[key]
        const errorMessage = currentError
          .map((error: string) => error.replace(key, ''))
          .join(',')

        const sessionName = entity.sessions[sessionIndex[0]].name
        const wholeErrorMessage = errorType + errorMessage

        const windowNumber = windowIndex ? parseInt(windowIndex) + 1 : undefined
        const notificationNumber = notificationIndex
          ? parseInt(notificationIndex) + 1
          : undefined
        const sessionKey = `${sessionName}-${parseInt(sessionIndex) + 1}`

        let currentErrorState: any
        if (newErrorState.has(sessionKey)) {
          currentErrorState = newErrorState.get(sessionKey)
        } else {
          currentErrorState = {
            generalErrorMessage: [],
            sessionWindowErrors: new Map<number, string>(),
            notificationErrors: new Map<number, string>(),
          }
        }

        if (windowNumber) {
          currentErrorState?.sessionWindowErrors.set(
            windowNumber,
            wholeErrorMessage
          )
        } else if (notificationNumber) {
          currentErrorState?.notificationErrors.set(
            notificationNumber,
            wholeErrorMessage
          )
        } else {
          currentErrorState!.generalErrorMessage.push(wholeErrorMessage)
        }
        newErrorState.set(sessionKey, currentErrorState)
      })
    }
    return newErrorState
  }

  //setting new state
  const updateScheduleData = (schedule: Schedule) => {
    setSchedule(schedule)
    console.log('updated')
    setHasObjectChanged(true)
    //ALINA TODO onUpdate(schedule)
  }

  //updating the schedule part
  const updateSessionsWithStartEventId = (
    sessions: StudySession[],
    startEventId: StartEventId
  ) => {
    return sessions.map(s => ({...s, startEventId}))
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions!, action)
    const newSchedule = {...schedule, sessions}
    updateScheduleData(newSchedule)
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

  if (isReadOnly) {
    return (
      <ReadOnlyScheduler
        children={children}
        schedule={schedule}
        version={study?.version}
        studyId={id}
      />
    )
  }

  return (
    <Box>
      <NavigationPrompt when={hasObjectChanged} key="prompt">
        {({onConfirm, onCancel}) => (
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
            classes={{label: classes.labelDuration}}
            label="Study duration:"
            style={{fontSize: '14px'}}
            labelPlacement="start"
            control={
              <Duration
                onChange={e =>
                  updateScheduleData({...schedule, duration: e.target.value})
                }
                durationString={schedule.duration || ''}
                unitLabel="study duration unit"
                numberLabel="study duration number"
                unitData={DWsEnum}></Duration>
            }
          />
          {hasObjectChanged && (
            <SaveButton
              isFloatingSave={true}
              onClick={() => onSave(true)}
              isSaving={saveLoader}>
              Save changes
            </SaveButton>
          )}
        </div>
        <Box bgcolor="#fff" p={2} pb={0} mt={3} key="scheduler">
          <Timeline
            version={study?.version || 0}
            studyId={id}
            schedule={schedule}></Timeline>
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
                  startEventId
                )
                updateScheduleData({...schedule, sessions})
              }}
            />
          </div>
          {schedule.sessions.map((session, index) => (
            <Box
              className={classes.sessionContainer}
              key={session.guid}
              border={
                schedulerErrorState.get(`${session.name}-${index + 1}`)
                  ? `1px solid ${theme.palette.error.main}`
                  : ''
              }>
              <Box className={classes.assessments}>
                <AssessmentList
                  studySessionIndex={index}
                  studySession={session}
                  onChangePerformanceOrder={(
                    performanceOrder: PerformanceOrder
                  ) => {
                    const schedule = {...session, performanceOrder}

                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: {sessionId: session.guid!, schedule},
                    })
                  }}
                  performanceOrder={session.performanceOrder || 'sequential'}
                />
              </Box>
              {/* This is what is being displayed as the card */}
              <SchedulableSingleSessionContainer
                key={session.guid}
                studySession={session}
                onUpdateSessionSchedule={(schedule: SessionSchedule) => {
                  scheduleUpdateFn({
                    type: ActionTypes.UpdateSessionSchedule,
                    payload: {sessionId: session.guid!, schedule},
                  })
                }}
                sessionErrorState={schedulerErrorState.get(
                  `${session.name}-${index + 1}`
                )}></SchedulableSingleSessionContainer>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default ScheduleCreatorTab
