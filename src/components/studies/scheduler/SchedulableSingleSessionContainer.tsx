import {Box, makeStyles, Switch} from '@material-ui/core'
import _ from 'lodash'
import moment from 'moment'
import React, {FunctionComponent} from 'react'
import Alert_Icon from '../../../assets/alert_icon.svg'
import {DEFAULT_NOTIFICATION} from '../../../services/schedule.service'
import {latoFont, ThemeType} from '../../../style/theme'
import {
  AssessmentWindow as AssessmentWindowType,
  ScheduleNotification,
  SessionSchedule,
  StudySession,
} from '../../../types/scheduling'
import {AlertWithText, BlueButton} from '../../widgets/StyledComponents'
import AssessmentWindow from './AssessmentWindow'
import EndDate from './EndDate'
import NotificationTime from './NotificationTime'
import NotificationWindow from './NotificationWindow'
import RepeatFrequency from './RepeatFrequency'
import SchedulingFormSection from './SchedulingFormSection'
import StartDate from './StartDate'

export const useStyles = makeStyles((theme: ThemeType) => ({
  formSection: {
    padding: theme.spacing(2, 4, 0),
    textAlign: 'left',
  },
  firstAlertStyling: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
  },
  errorText: {
    color: theme.palette.error.main,
    backgroundColor: 'transparent',
    fontSize: '15px',
  },
  notifySwitch: {
    fontFamily: latoFont,
    fontSize: '15px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontWeight: 'normal',
  },
}))

export const defaultSchedule: SessionSchedule = {
  performanceOrder: 'participant_choice',
  timeWindows: [],
}

type SchedulableSingleSessionContainerProps = {
  studySession: StudySession
  onUpdateSessionSchedule: Function
  sessionErrorState:
    | {
        generalErrorMessage: string[]
        sessionWindowErrors: Map<number, string>
        notificationErrors: Map<number, string>
      }
    | undefined
}

type windowErrorArrayType = {
  windowName: string
  windowError: string
}

type notificationErrorArrayType = {
  notficationError: string
  notificationName: string
}

const SchedulableSingleSessionContainer: FunctionComponent<SchedulableSingleSessionContainerProps> =
  ({studySession, onUpdateSessionSchedule, sessionErrorState}) => {
    const classes = useStyles()

    const [schedulableSession, setSchedulableSession] =
      React.useState<SessionSchedule>(studySession || defaultSchedule)

    const [windowErrors, setWindowErrors] = React.useState<
      windowErrorArrayType[]
    >([])

    const [notificationErrors, setNotificationErrors] = React.useState<
      notificationErrorArrayType[]
    >([])

    React.useEffect(() => {
      setSchedulableSession(studySession || defaultSchedule)
    }, [studySession])

    React.useEffect(() => {
      if (
        !sessionErrorState ||
        sessionErrorState.sessionWindowErrors.size == 0
      ) {
        setWindowErrors([])
        return
      }
      const windowErrorsArray: windowErrorArrayType[] = []
      sessionErrorState.sessionWindowErrors.forEach((el, key) => {
        windowErrorsArray.push({
          windowName: 'window ' + key,
          windowError: el,
        })
      })
      setWindowErrors(windowErrorsArray)
    }, [sessionErrorState?.sessionWindowErrors])

    React.useEffect(() => {
      if (
        !sessionErrorState ||
        sessionErrorState.notificationErrors.size == 0
      ) {
        setNotificationErrors([])
        return
      }
      const notificationErrorsArray: notificationErrorArrayType[] = []
      sessionErrorState.notificationErrors.forEach((el, key) => {
        notificationErrorsArray.push({
          notificationName: 'notification ' + key,
          notficationError: el,
        })
      })
      setNotificationErrors(notificationErrorsArray)
    }, [sessionErrorState?.notificationErrors])

    function hasWindowLongerThan24h(session?: StudySession) {
      const windows = session ? session.timeWindows : studySession.timeWindows
      if (!windows || windows.length == 0) {
        return false
      }
      const over24 = windows.find(window => {
        if (!window.expiration) {
          return true
        } else {
          const expirationHours = moment.duration(window.expiration).asHours()
          return expirationHours > 24
        }
      })
      return over24 !== undefined
    }

    const updateSessionSchedule = (newSession: SessionSchedule) => {
      onUpdateSessionSchedule(newSession)
    }

    const addNewWindow = () => {
      const newState = {...schedulableSession}
      let aWindow = {
        startTime: '08:00',
      }
      newState.timeWindows
        ? newState.timeWindows.push(aWindow)
        : (newState.timeWindows = [aWindow])

      updateSessionSchedule(newState)
    }

    const addNewNotification = () => {
      const newState = {...schedulableSession}

      newState.notifications
        ? newState.notifications.push(DEFAULT_NOTIFICATION)
        : (newState.notifications = [DEFAULT_NOTIFICATION])

      updateSessionSchedule(newState)
    }

    const deleteWindow = (index: number) => {
      const timeWindows = [...(schedulableSession.timeWindows || [])]
      timeWindows.splice(index, 1)
      const newState = {
        ...schedulableSession,
        timeWindows: [...timeWindows],
      }
      updateSessionSchedule(newState)
    }

    const updateWindow = (window: AssessmentWindowType, index: number) => {
      if (!schedulableSession.timeWindows) {
        return
      }
      const newState = {
        ...schedulableSession,
        timeWindows: schedulableSession.timeWindows.map((item, i) =>
          i === index ? window : item
        ),
      }
      updateSessionSchedule(newState)
    }

    const deleteNotification = (index: number) => {
      const notificatons = [...(schedulableSession.notifications || [])]
      notificatons.splice(index, 1)
      const newState = {
        ...schedulableSession,
        notifications: [...notificatons],
      }
      updateSessionSchedule(newState)
    }

    const deleteAllNotifications = () => {
      const newState = {
        ...schedulableSession,
        notifications: [],
      }
      updateSessionSchedule(newState)
    }

    const updateNotification = (
      notification: ScheduleNotification,
      index: number
    ) => {
      let existingNotifications = schedulableSession.notifications || []
      const newState = {
        ...schedulableSession,
        notifications: existingNotifications.map((item, i) =>
          i === index ? notification : item
        ),
      }
      updateSessionSchedule(newState)
    }

    return (
      <Box bgcolor="#F8F8F8" flexGrow="1" pb={0} pl={4}>
        {sessionErrorState && sessionErrorState.generalErrorMessage.length > 0 && (
          <Box className={classes.firstAlertStyling}>
            {sessionErrorState.generalErrorMessage.map((el, index) => {
              return (
                <AlertWithText
                  key={index}
                  icon={
                    <img
                      src={Alert_Icon}
                      style={{height: '20px'}}
                      alt={'error-message-' + index}></img>
                  }
                  severity="error">
                  {`${studySession.name} ${el}`}
                </AlertWithText>
              )
            })}
          </Box>
        )}
        <form noValidate autoComplete="off">
          <Box className={classes.formSection}>
            <StartDate
              delay={schedulableSession.delay}
              sessionName={studySession.name}
              onChange={(delay: string | undefined) => {
                updateSessionSchedule({...schedulableSession, delay})
              }}></StartDate>
          </Box>
          <Box className={classes.formSection}>
            <EndDate
              occurrences={schedulableSession.occurrences}
              onChange={(occurrences: number | undefined) => {
                const newSessionSchedule = {
                  ...schedulableSession,
                  occurrences: occurrences,
                }
                if (occurrences == 1) {
                  newSessionSchedule.interval = undefined
                }
                updateSessionSchedule(newSessionSchedule)
              }}></EndDate>
          </Box>
          <Box className={classes.formSection}>
            <RepeatFrequency
              onChange={(interval: string | undefined) => {
                updateSessionSchedule({
                  ...schedulableSession,
                  interval,
                })
              }}
              interval={schedulableSession.interval}
              occurrences={schedulableSession.occurrences}></RepeatFrequency>
          </Box>

          <Box className={classes.formSection}>
            <Box ml={-2}>
              {windowErrors.map((el, index) => {
                return (
                  <AlertWithText
                    severity="error"
                    icon={
                      <img
                        src={Alert_Icon}
                        style={{height: '20px'}}
                        alt={'window-error-' + index}></img>
                    }
                    key={index}>
                    Session {studySession.name} in{' '}
                    {`${el.windowName}: ${el.windowError}`}
                  </AlertWithText>
                )
              })}
            </Box>

            <SchedulingFormSection label="Session Window:">
              <Box flexGrow={1}>
                {schedulableSession.timeWindows?.map((window, index) => (
                  <AssessmentWindow
                    index={index}
                    key={`${index}${window.startTime}${window.expiration}`}
                    onDelete={() => {
                      deleteWindow(index)
                    }}
                    onChange={(window: AssessmentWindowType) =>
                      updateWindow(window, index)
                    }
                    window={window}
                    errorText={
                      sessionErrorState?.sessionWindowErrors.get(index + 1) ||
                      ''
                    }></AssessmentWindow>
                ))}
                {!hasWindowLongerThan24h() && (
                  <BlueButton onClick={addNewWindow} variant="contained">
                    +Add new window
                  </BlueButton>
                )}
              </Box>
            </SchedulingFormSection>
            <Box ml={-2}>
              {!_.isEmpty(schedulableSession.notifications) &&
                notificationErrors.map((el, index) => {
                  return (
                    <AlertWithText
                      severity="error"
                      icon={
                        <img
                          src={Alert_Icon}
                          style={{height: '24px'}}
                          alt={'notification-error-' + index}></img>
                      }
                      key={index}
                      className={classes.errorText}>
                      Session {studySession.name} in{' '}
                      {`${el.notificationName}: ${el.notficationError}`}
                    </AlertWithText>
                  )
                })}
            </Box>
            <SchedulingFormSection
              border={false}
              label={
                <>
                  <label>Session Notifications:</label>{' '}
                  <Box className={classes.notifySwitch}>
                    <Switch
                      color="primary"
                      checked={!_.isEmpty(schedulableSession.notifications)}
                      onChange={e => {
                        if (e.target.checked) {
                          addNewNotification()
                        } else {
                          deleteAllNotifications()
                        }
                      }}
                      style={{marginLeft: 0, marginRight: '8px'}}></Switch>{' '}
                    {!_.isEmpty(schedulableSession.notifications)
                      ? 'On'
                      : 'Off'}
                  </Box>
                </>
              }>
              <Box flexGrow={1}>
                {schedulableSession.notifications?.map(
                  (notification, index) => (
                    <NotificationWindow
                      index={index}
                      notification={notification}
                      isMultiday={hasWindowLongerThan24h()}
                      key={index}
                      onDelete={() => {
                        deleteNotification(index)
                      }}
                      onChange={(notification: ScheduleNotification) => {
                        updateNotification(notification, index)
                      }}
                      isError={
                        sessionErrorState?.notificationErrors.has(index + 1) ||
                        false
                      }
                      //window={window}
                    >
                      <NotificationTime
                        notifyAt={notification.notifyAt}
                        offset={notification.offset}
                        isFollowUp={index > 0}
                        windowStartTime={
                          !_.isEmpty(schedulableSession.timeWindows)
                            ? schedulableSession.timeWindows[0].startTime
                            : undefined
                        }
                        isMultiday={hasWindowLongerThan24h()}
                        onChange={e =>
                          updateNotification(
                            {
                              ...notification,
                              notifyAt: e.notifyAt,
                              offset: e.offset,
                            },
                            index
                          )
                        }
                      />
                    </NotificationWindow>
                  )
                )}

                {!schedulableSession.notifications && (
                  <BlueButton onClick={addNewNotification} variant="contained">
                    +Add new notification
                  </BlueButton>
                )}

                {schedulableSession.notifications?.length === 1 && (
                  <BlueButton onClick={addNewNotification} variant="contained">
                    +Add a reminder notification
                  </BlueButton>
                )}
              </Box>
            </SchedulingFormSection>
          </Box>
        </form>
      </Box>
    )
  }
export default SchedulableSingleSessionContainer
