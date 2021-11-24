import {Box, makeStyles} from '@material-ui/core'
import EventService from '@services/event.service'
import clsx from 'clsx'
import _ from 'lodash'
import React, {ReactNode} from 'react'
import {poppinsFont} from '../../../../style/theme'
import {
  NotificationTimeAtEnum,
  Schedule,
  ScheduleNotification,
  StudySession,
} from '../../../../types/scheduling'
import AssessmentList from '../AssessmentList'
import ReadOnlyAssessmentWindow from '../read-only-pages/ReadOnlyAssessmentWindow'
import ReadOnlyNotificationWindow from '../read-only-pages/ReadOnlyNotificationWindow'
import {
  defaultSchedule,
  useStyles as SchedulableSessionStyles,
} from '../SchedulableSingleSessionContainer'
import {useStyles as sharedSchedulerStyles} from '../ScheduleCreatorTab'
import ScheduleTimelineDisplay from '../ScheduleTimelineDisplay'
import SchedulingFormSection from '../SchedulingFormSection'
import {getFormattedTimeDateFromPeriodString} from '../utility'

type ReadOnlySchedulerProps = {
  children: ReactNode
  schedule: Schedule
  studyId: string
}

const useStyles = makeStyles(theme => ({
  readOnlyText: {
    fontFamily: poppinsFont,
    fontSize: '18px',
    lineHeight: '27px',
    alignSelf: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  grayBottomBorder: {
    border: '1px solid #BBC3CD',
    padding: theme.spacing(3, 2),
  },
  readOnlyTextCentering: {
    marginTop: theme.spacing(1),
  },
  rowHeader: {
    fontWeight: 'normal',
  },
}))

const ReadOnlyScheduler: React.FunctionComponent<ReadOnlySchedulerProps> = ({
  schedule,
  children,
  studyId,
}) => {
  const schedulerClasses = sharedSchedulerStyles()
  const sessionContainerClasses = SchedulableSessionStyles()
  const classes = useStyles()

  function getSessionIntervalText(session: StudySession) {
    const {interval, occurrences} = session
    const label = occurrences
      ? ` for ${occurrences} times`
      : 'until the end of study'
    let intervalString = ''
    if (interval) {
      intervalString = getFormattedTimeDateFromPeriodString(interval) + ' '
    }
    return `${intervalString}${label}`
  }

  const getNotificationTimeText = (
    notification: ScheduleNotification,
    index: number
  ): string => {
    const offset = notification.offset
    const endingText =
      offset === undefined && index === 1
        ? 'at start of window'
        : NotificationTimeAtEnum[notification.notifyAt]
    let offsetText = ''
    if (offset) {
      offsetText = getFormattedTimeDateFromPeriodString(offset) + ' '
    }
    return `${offsetText}${endingText}`
  }

  return (
    <Box textAlign="left" key="content">
      <div className={schedulerClasses.scheduleHeader} key="intro">
        <Box className={clsx(classes.row)} ml={2} mb={-1} fontWeight="thin">
          <Box className={classes.readOnlyText} maxWidth="160px" mr={2}>
            Study duration:
          </Box>
          <strong className={classes.readOnlyText}>
            {schedule.duration
              ? getFormattedTimeDateFromPeriodString(schedule.duration)
              : 'No duration set'}
          </strong>
        </Box>
      </div>
      <Box bgcolor="#fff" p={2} mt={3} key="scheduler">
        <ScheduleTimelineDisplay
          studyId={studyId}
          onSelectSession={() => {}}
          schedule={schedule}></ScheduleTimelineDisplay>

        {schedule.sessions.map((session, index) => (
          <Box mb={2} display="flex" key={session.guid}>
            <Box
              className={clsx(schedulerClasses.assessments)}
              style={{backgroundColor: '#f8f8f8'}}>
              <AssessmentList
                isReadOnly={true}
                studySessionIndex={index}
                studySession={session}
                onChangePerformanceOrder={() => {}}
                performanceOrder={session.performanceOrder || 'sequential'}
              />
            </Box>
            <Box bgcolor="#F8F8F8" flexGrow="1" pb={2.5} pl={4}>
              <Box className={sessionContainerClasses.formSection}>
                <SchedulingFormSection
                  label={
                    <Box
                      className={
                        classes.rowHeader
                      }>{`${session.name} starts on:`}</Box>
                  }>
                  <strong
                    className={clsx(
                      classes.readOnlyText,
                      classes.readOnlyTextCentering
                    )}>
                    {EventService.formatEventIdForDisplay(
                      _.first(session.startEventIds) || 'Unknown'
                    )}
                  </strong>
                </SchedulingFormSection>
              </Box>
              <Box className={sessionContainerClasses.formSection}>
                <SchedulingFormSection
                  label={<Box className={classes.rowHeader}>End after:</Box>}>
                  <strong
                    className={clsx(
                      classes.readOnlyText,
                      classes.readOnlyTextCentering
                    )}>
                    {`${
                      session.occurrences
                        ? session.occurrences + ' times'
                        : ' End of study'
                    }`}
                  </strong>
                </SchedulingFormSection>
              </Box>
              <Box className={sessionContainerClasses.formSection}>
                <SchedulingFormSection
                  label={
                    <Box
                      style={{
                        fontWeight: 'normal',
                        maxWidth: '170px',
                      }}>
                      Run this session every:
                    </Box>
                  }>
                  <strong
                    className={clsx(
                      classes.readOnlyText,
                      classes.readOnlyTextCentering
                    )}>
                    {getSessionIntervalText(session)}
                  </strong>
                </SchedulingFormSection>
                <SchedulingFormSection
                  label={
                    <Box className={classes.rowHeader}>Session window:</Box>
                  }>
                  <Box flexGrow={1}>
                    {(session || defaultSchedule).timeWindows?.map(
                      (window, index) => {
                        return (
                          <ReadOnlyAssessmentWindow
                            key={'read-only-assessment-window-' + index}
                            startTime={window.startTime}
                            index={index + 1}
                            expireAfter={window.expiration || 'N/A'}
                          />
                        )
                      }
                    )}
                  </Box>
                </SchedulingFormSection>
                <SchedulingFormSection
                  label={
                    <Box className={classes.rowHeader}>
                      Session Notifications:
                    </Box>
                  }>
                  <Box flexGrow={1}>
                    {(session || defaultSchedule).notifications?.map(
                      (notification, index) => {
                        return (
                          <ReadOnlyNotificationWindow
                            key={'read-only-notification-window-' + index}
                            index={index + 1}
                            notificationHeader={
                              _.first(notification.messages)?.subject || ''
                            }
                            notificationMessage={
                              _.first(notification.messages)?.message || ''
                            }
                            notificationTimeText={getNotificationTimeText(
                              notification,
                              index + 1
                            )}
                          />
                        )
                      }
                    )}
                  </Box>
                  {(session || defaultSchedule).notifications?.length === 0 && (
                    <strong
                      className={classes.readOnlyText}
                      style={{
                        width: '100%',
                      }}>
                      Participants will not receive any notification for this
                      session.
                    </strong>
                  )}
                </SchedulingFormSection>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {children}
    </Box>
  )
}

export default ReadOnlyScheduler
