import AlertIcon from '@assets/alert_icon.svg'
import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import {AlertWithText} from '@components/widgets/StyledComponents'
import InfoTwoToneIcon from '@mui/icons-material/InfoTwoTone'
import {Box, Button, Switch, Tooltip} from '@mui/material'
import {DEFAULT_NOTIFICATION} from '@services/schedule.service'
import {theme} from '@style/theme'
import {
  AssessmentWindow as AssessmentWindowType,
  ScheduleNotification,
  SchedulingEvent,
  SessionSchedule,
  StudySession,
} from '@typedefs/scheduling'
import _ from 'lodash'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import React, {FunctionComponent} from 'react'
import AssessmentWindow from './AssessmentWindow'
import EndDate from './EndDate'
import NotificationTime from './NotificationTime'
import NotificationWindow from './NotificationWindow'
import RepeatFrequency from './RepeatFrequency'
import SchedulingFormSection from './SchedulingFormSection'
import StartDate from './StartDate'
dayjs.extend(duration)

export const defaultSchedule: SessionSchedule = {
  performanceOrder: 'participant_choice',
  timeWindows: [],
}

type SchedulableSingleSessionContainerProps = {
  studySession: StudySession
  onUpdateSessionSchedule: Function
  customEvents?: SchedulingEvent[]
  onOpenEventsEditor: Function
  hasCriticalStartEvent?: boolean

  sessionErrorState:
    | {
        generalErrorMessage: string[]
        sessionWindowErrors: Map<number, string>
        notificationErrors: Map<number, string>
      }
    | undefined
  burstOriginEventId: string | undefined
}

type windowErrorArrayType = {
  windowName: string
  windowError: string
}

type notificationErrorArrayType = {
  notficationError: string
  notificationName: string
}

const SchedulableSingleSessionContainer: FunctionComponent<SchedulableSingleSessionContainerProps> = ({
  studySession,
  onUpdateSessionSchedule,
  sessionErrorState,
  customEvents,
  burstOriginEventId,
  onOpenEventsEditor,
  hasCriticalStartEvent,
}) => {
  const [schedulableSession, setSchedulableSession] = React.useState<StudySession>(studySession || defaultSchedule)

  const [windowErrors, setWindowErrors] = React.useState<windowErrorArrayType[]>([])

  const [notificationErrors, setNotificationErrors] = React.useState<notificationErrorArrayType[]>([])

  React.useEffect(() => {
    setSchedulableSession(studySession || defaultSchedule)
  }, [studySession])

  React.useEffect(() => {
    if (!sessionErrorState || sessionErrorState.sessionWindowErrors.size === 0) {
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
    if (!sessionErrorState || sessionErrorState.notificationErrors.size === 0) {
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
    if (!windows || windows.length === 0) {
      return false
    }
    if (windows.length === 1 && !windows[0].expiration) {
      return false
    }
    const over24 = windows.find(window => {
      if (!window.expiration) {
        return true
      } else {
        const expirationHours = dayjs.duration(window.expiration).asHours()
        return expirationHours > 24
      }
    })
    return over24 !== undefined
  }

  const updateSessionSchedule = (newSession: StudySession, shouldInvalidateBurst?: boolean) => {
    onUpdateSessionSchedule(newSession, shouldInvalidateBurst, shouldInvalidateBurst && hasCriticalStartEvent)
  }

  const addNewWindow = () => {
    const newState = {...schedulableSession}
    let aWindow = {
      startTime: '08:00',
    }
    newState.timeWindows ? newState.timeWindows.push(aWindow) : (newState.timeWindows = [aWindow])

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
      timeWindows: schedulableSession.timeWindows.map((item, i) => (i === index ? window : item)),
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

  const updateNotification = (notification: ScheduleNotification, index: number) => {
    let existingNotifications = schedulableSession.notifications || []
    const newState = {
      ...schedulableSession,
      notifications: existingNotifications.map((item, i) => (i === index ? notification : item)),
    }
    updateSessionSchedule(newState)
  }

  const handleEndDateChange = (occurrences: number | undefined) => {
    const newSessionSchedule = {
      ...schedulableSession,
      occurrences: occurrences,
    }
    if (occurrences === 1) {
      newSessionSchedule.interval = undefined
    }
    updateSessionSchedule(newSessionSchedule)
  }

  const createNotificationKey = (notification: ScheduleNotification, index: number) => {
    let result = notification.notifyAt + notification.offset
    let message = notification.messages && notification.messages.length ? notification.messages[0] : undefined
    let messageKey = message ? message.lang + message.subject + message.message : 'sometitlesomebody'
    return index + result + messageKey
  }

  return (
    <Box sx={{backgroundColor: '#fff', flexGrow: '1', paddingBottom: 0, paddingLeft: theme.spacing(4)}} id="SSC">
      {sessionErrorState && sessionErrorState.generalErrorMessage.length > 0 && (
        <Box sx={{marginTop: theme.spacing(4), marginLeft: theme.spacing(2)}}>
          {sessionErrorState.generalErrorMessage.map((el, index) => {
            return (
              <AlertWithText
                key={index}
                icon={<img src={AlertIcon} style={{height: '20px'}} alt={'error-message-' + index}></img>}
                severity="error">
                {`${studySession.name} ${el}`}
              </AlertWithText>
            )
          })}
        </Box>
      )}
      <form noValidate autoComplete="off">
        <Box>
          <StartDate
            onOpenEventsEditor={onOpenEventsEditor}
            startEventId={
              _.isEmpty(studySession.studyBurstIds)
                ? _.first(schedulableSession.startEventIds)!
                : burstOriginEventId || ''
            }
            isBurst={!_.isEmpty(studySession.studyBurstIds)}
            delay={schedulableSession.delay}
            customEvents={customEvents}
            sessionName={studySession.name}
            onChangeStartEventId={(startEventId: string) => {
              updateSessionSchedule(
                {
                  ...schedulableSession,
                  startEventIds: [startEventId],
                },
                true
              )
            }}
            onChangeDelay={(delay: string | undefined) => {
              updateSessionSchedule({...schedulableSession, delay})
            }}>
            <InfoCircleWithToolTip
              tooltipDescription={
                <span>
                  This session is now part of a <strong>Burst</strong>. To edit this Start Session event, the session
                  must be removed from the Burst first.
                </span>
              }
              variant="info"
            />
          </StartDate>
        </Box>
        <Box>
          <EndDate occurrences={schedulableSession.occurrences} onChange={handleEndDateChange}></EndDate>
        </Box>
        <Box>
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

        <Box>
          <Box ml={-2}>
            {windowErrors.map((el, index) => {
              return (
                <AlertWithText
                  severity="error"
                  icon={<img src={AlertIcon} style={{height: '20px'}} alt={'window-error-' + index}></img>}
                  key={index}>
                  Session {studySession.name} in {`${el.windowName}: ${el.windowError}`}
                </AlertWithText>
              )
            })}
          </Box>

          <SchedulingFormSection
            label="Session Window"
            isRequired={true}
            postLabel={
              <Tooltip title="Add assessment window">
                <InfoTwoToneIcon sx={{fontSize: '15px'}} />
              </Tooltip>
            }
            rightElement={
              <Button onClick={addNewWindow} size="small" variant="outlined" disabled={hasWindowLongerThan24h()}>
                Add Window
              </Button>
            }>
            <Box flexGrow={1}>
              {schedulableSession.timeWindows?.map((window, index) => (
                <AssessmentWindow
                  index={index}
                  key={`${index}${window.startTime}${window.expiration}`}
                  onDelete={() => {
                    deleteWindow(index)
                  }}
                  onChange={(window: AssessmentWindowType) => updateWindow(window, index)}
                  window={window}
                  errorText={sessionErrorState?.sessionWindowErrors.get(index + 1) || ''}></AssessmentWindow>
              ))}
            </Box>
          </SchedulingFormSection>
          <Box ml={-2}>
            {!_.isEmpty(schedulableSession.notifications) &&
              notificationErrors.map((el, index) => {
                return (
                  <AlertWithText
                    severity="error"
                    icon={<img src={AlertIcon} style={{height: '24px'}} alt={'notification-error-' + index}></img>}
                    key={index}
                    sx={{color: theme.palette.error.main, backgroundColor: 'transparent', fontSize: '15px'}}>
                    Session {studySession.name} in {`${el.notificationName}: ${el.notficationError}`}
                  </AlertWithText>
                )
              })}
          </Box>
          <SchedulingFormSection
            border={false}
            postLabel={
              <Box sx={{display: 'flex', alignItems: 'center'}}>
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
                  style={{marginLeft: 0, marginRight: '4px'}}></Switch>{' '}
                {!_.isEmpty(schedulableSession.notifications) ? 'On' : 'Off'}
              </Box>
            }
            rightElement={
              !schedulableSession.notifications ? (
                <Button size="small" variant="outlined" onClick={addNewNotification}>
                  +Add new notification
                </Button>
              ) : schedulableSession.notifications?.length === 1 ? (
                <Button size="small" variant="outlined" onClick={addNewNotification}>
                  +Add a reminder notification
                </Button>
              ) : undefined
            }
            label={'Session Notifications'}>
            <Box flexGrow={1}>
              {schedulableSession.notifications?.map((notification, index) => (
                <NotificationWindow
                  index={index}
                  notification={notification}
                  isMultiday={hasWindowLongerThan24h()}
                  key={createNotificationKey(notification, index)}
                  onDelete={() => {
                    deleteNotification(index)
                  }}
                  onChange={(notification: ScheduleNotification) => {
                    updateNotification(notification, index)
                  }}
                  isError={sessionErrorState?.notificationErrors.has(index + 1) || false}>
                  <NotificationTime
                    notifyAt={notification.notifyAt}
                    offset={notification.offset}
                    isFollowUp={index > 0}
                    windowStartTime={
                      !_.isEmpty(schedulableSession.timeWindows)
                        ? schedulableSession.timeWindows[0].startTime
                        : undefined
                    }
                    isMultiday={hasWindowLongerThan24h() || !_.first(schedulableSession.timeWindows)?.expiration}
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
              ))}
            </Box>
          </SchedulingFormSection>
        </Box>
      </form>
    </Box>
  )
}
export default SchedulableSingleSessionContainer
