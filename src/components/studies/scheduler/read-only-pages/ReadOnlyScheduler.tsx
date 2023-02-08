import {Box, Typography} from '@mui/material'
import EventService from '@services/event.service'
import {NotificationTimeAtEnum, ScheduleNotification, StudySession} from '@typedefs/scheduling'
import _ from 'lodash'
import {defaultSchedule} from '../SchedulableSingleSessionContainer'
import SchedulingFormSection from '../SchedulingFormSection'
import {getFormattedTimeDateFromPeriodString} from '../utility'
import ReadOnlyAssessmentWindow from './ReadOnlyAssessmentWindow'
import ReadOnlyNotificationWindow from './ReadOnlyNotificationWindow'

type ReadOnlySchedulerProps = {
  session: StudySession

  studySessionIndex: number
  originEventId?: string
}

const ReadOnlyScheduler: React.FunctionComponent<ReadOnlySchedulerProps> = ({
  session,

  originEventId,
}) => {
  function getSessionIntervalText(session: StudySession) {
    const {interval, occurrences} = session
    const label = occurrences ? ` for ${occurrences} times` : 'until the end of study'
    let intervalString = ''
    if (interval) {
      intervalString = getFormattedTimeDateFromPeriodString(interval) + ' '
    }
    return `${intervalString}${label}`
  }

  const getNotificationTimeText = (notification: ScheduleNotification, index: number): string => {
    const offset = notification.offset
    const endingText =
      offset === undefined && index === 1 ? 'at start of window' : NotificationTimeAtEnum[notification.notifyAt]
    let offsetText = ''
    if (offset) {
      offsetText = getFormattedTimeDateFromPeriodString(offset) + ' '
    }
    return `${offsetText}${endingText}`
  }

  return (
    <Box mb={2} display="flex" key={session.guid}>
      <Box flexGrow="1" pb={2.5} pl={4}>
        <Box>
          <SchedulingFormSection label={''}>
            <Typography variant="h4">
              Session &nbsp;
              {session.delay ? (
                <span>
                  Starts
                  <br />
                  <strong>{getFormattedTimeDateFromPeriodString(session.delay)}</strong> from:{' '}
                </span>
              ) : (
                'Starts On:'
              )}
            </Typography>
            <Typography>
              {EventService.formatEventIdForDisplay(_.first(session.startEventIds) || originEventId || 'Unknown')}
            </Typography>
          </SchedulingFormSection>
        </Box>

        <SchedulingFormSection label={<Typography variant="h4">End After</Typography>}>
          <Typography>{`${session.occurrences ? session.occurrences + ' times' : ' End of study'}`}</Typography>
        </SchedulingFormSection>

        <SchedulingFormSection label={<Typography variant="h4">Run This Session Every</Typography>}>
          <Typography>{getSessionIntervalText(session)}</Typography>
        </SchedulingFormSection>
        <SchedulingFormSection label={<Typography variant="h4">Session Window</Typography>}>
          <Box flexGrow={1}>
            {(session || defaultSchedule).timeWindows?.map((window, index) => {
              return (
                <ReadOnlyAssessmentWindow
                  key={'read-only-assessment-window-' + index}
                  startTime={window.startTime}
                  index={index + 1}
                  expireAfter={window.expiration}
                />
              )
            })}
          </Box>
        </SchedulingFormSection>
        <SchedulingFormSection label={<Typography variant="h4">Session Notifications</Typography>}>
          <Box flexGrow={1}>
            {(session || defaultSchedule).notifications?.map((notification, index) => {
              return (
                <ReadOnlyNotificationWindow
                  key={'read-only-notification-window-' + index}
                  index={index + 1}
                  notificationHeader={_.first(notification.messages)?.subject || ''}
                  notificationMessage={_.first(notification.messages)?.message || ''}
                  notificationTimeText={getNotificationTimeText(notification, index + 1)}
                />
              )
            })}
          </Box>
          {(session || defaultSchedule).notifications?.length === 0 && (
            <Typography>Participants will not receive any notification for this session.</Typography>
          )}
        </SchedulingFormSection>
      </Box>
    </Box>
  )
}

export default ReadOnlyScheduler
