import {Box, styled, Typography} from '@mui/material'
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

const StyledText = styled(Typography, {label: 'StyledText'})(({theme}) => ({
  fontSize: '16px',
  fontWeight: 700,
}))

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
          <SchedulingFormSection
            label={
              <StyledText>
                {session.name}&nbsp;
                {session.delay ? (
                  <span>
                    starts
                    <br />
                    <strong>{getFormattedTimeDateFromPeriodString(session.delay)}</strong> from:{' '}
                  </span>
                ) : (
                  'starts on:'
                )}
              </StyledText>
            }>
            <StyledText>
              {EventService.formatEventIdForDisplay(_.first(session.startEventIds) || originEventId || 'Unknown')}
            </StyledText>
          </SchedulingFormSection>
        </Box>

        <SchedulingFormSection label={<Box>End after:</Box>}>
          <StyledText>{`${session.occurrences ? session.occurrences + ' times' : ' End of study'}`}</StyledText>
        </SchedulingFormSection>

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
          <StyledText>{getSessionIntervalText(session)}</StyledText>
        </SchedulingFormSection>
        <SchedulingFormSection label={<Box>Session window:</Box>}>
          <Box flexGrow={1}>
            {(session || defaultSchedule).timeWindows?.map((window, index) => {
              return (
                <ReadOnlyAssessmentWindow
                  key={'read-only-assessment-window-' + index}
                  startTime={window.startTime}
                  index={index + 1}
                  expireAfter={window.expiration || 'N/A'}
                />
              )
            })}
          </Box>
        </SchedulingFormSection>
        <SchedulingFormSection label={<Box>Session Notifications:</Box>}>
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
            <StyledText>Participants will not receive any notification for this session.</StyledText>
          )}
        </SchedulingFormSection>
      </Box>
    </Box>
  )
}

export default ReadOnlyScheduler
