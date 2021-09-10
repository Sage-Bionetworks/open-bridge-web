import {
  Box,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import StudyService from '@services/study.service'
import _ from 'lodash'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import {latoFont, poppinsFont, theme} from '../../../style/theme'
import {
  DWsEnum,
  PerformanceOrder,
  Schedule,
  SessionSchedule,
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
import ScheduleTimelineDisplay from './ScheduleTimelineDisplay'

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

export type SchedulerErrorType = {
  errors: any
  entity: any
}
type ScheduleCreatorTabProps = {
  id: string
  onNavigate: Function
  children: React.ReactNode
  onShowFeedback: Function
}

type SaveHandle = {
  save: (a: number) => void
}

const ScheduleCreatorTab: React.ForwardRefRenderFunction<
  SaveHandle,
  ScheduleCreatorTabProps
> = (
  {id, onNavigate, children, onShowFeedback}: ScheduleCreatorTabProps,
  ref
) => {
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

  React.useImperativeHandle(ref, () => ({
    save(step: number) {
      onSave().then(x => onNavigate(step))
    },
  }))
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
    setScheduleErrors([])
    setSaveLoader(true)
    let error: Error | undefined = undefined
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
        error = e
      } else {
        const errorObject = {
          entity: entity,
          errors: errors,
        }
        error = new Error('!')
        setScheduleErrors(prev => [...prev, errorObject])
      }
    } finally {
      setSaveLoader(false)
      if (isButtonPressed) {
        onShowFeedback(error)
      }
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
          <Box>
            <FormControlLabel
              classes={{label: classes.labelDuration}}
              label="Study duration:"
              style={{fontSize: '14px'}}
              labelPlacement="start"
              control={
                <Duration
                  maxDurationDays={1825}
                  onChange={e =>
                    updateScheduleData({...schedule, duration: e.target.value})
                  }
                  durationString={schedule.duration || ''}
                  unitLabel="study duration unit"
                  numberLabel="study duration number"
                  unitData={DWsEnum}></Duration>
              }
            />
            <Box fontSize="12px" ml={2} fontFamily={latoFont} fontWeight="bold">
              The study duration must be shorter than 5 years.
            </Box>
          </Box>

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
          <ScheduleTimelineDisplay
            studyId={id}
            schedule={schedule}></ScheduleTimelineDisplay>

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
                customEvents={study?.customEvents}
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

export default React.forwardRef(ScheduleCreatorTab)
