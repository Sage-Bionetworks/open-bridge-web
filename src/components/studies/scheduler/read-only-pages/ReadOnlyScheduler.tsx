import React, {ReactNode} from 'react'
import {Box, FormControlLabel} from '@material-ui/core'
import {getStartEventIdFromSchedule} from '../Scheduler'
import SchedulerStyles from '../shared-styles/SchedulerStyles'
import _ from 'lodash'
import {Schedule, StartEventId} from '../../../../types/scheduling'
import Timeline from '../Timeline'
import StudyStartDate from '../StudyStartDate'
import AssessmentList from '../AssessmentList'
import SchedulableSingleSessionContainer from '../SchedulableSingleSessionContainer'
import clsx from 'clsx'
const useStyles = SchedulerStyles
import {useStyles as ScheduleDurationTextStyles} from '../StartDate'
import {getTimeUnitFormatted} from '../utility'

type ReadOnlySchedulerProps = {
  children: ReactNode
  token: string
  version?: number
  schedule: Schedule
}

const ReadOnlyScheduler: React.FunctionComponent<ReadOnlySchedulerProps> = ({
  schedule,
  children,
  token,
  version,
}) => {
  const classes = useStyles()
  return (
    <Box textAlign="left" key="content">
      <div className={classes.scheduleHeader} key="intro">
        <FormControlLabel
          classes={{label: classes.labelDuration}}
          label="Study duration:"
          style={{fontSize: '14px'}}
          labelPlacement="start"
          control={
            <Box className={ScheduleDurationTextStyles().timeFrameText}>
              {schedule.duration
                ? getTimeUnitFormatted(schedule.duration)
                : 'No duration set'}
            </Box>
          }
        />
      </div>
      <Box bgcolor="#fff" p={2} mt={3} key="scheduler">
        <Timeline
          token={token}
          version={version!}
          schedule={schedule}></Timeline>
        <div className={classes.studyStartDateContainer}>
          <StudyStartDate
            isReadOnly
            style={{
              marginTop: '16px',
            }}
            startEventId={getStartEventIdFromSchedule(schedule) as StartEventId}
            onChange={() => {}}
          />
        </div>
        {schedule.sessions.map((session, index) => (
          <Box mb={2} display="flex" key={session.guid}>
            <Box
              className={clsx(
                classes.assessments,
                classes.readOnlyAssessmentContainer
              )}>
              <AssessmentList
                isReadOnly={true}
                studySessionIndex={index}
                studySession={session}
                onChangePerformanceOrder={() => {}}
                performanceOrder={session.performanceOrder || 'sequential'}
              />
            </Box>
            <SchedulableSingleSessionContainer
              sessionErrorState={undefined}
              isReadOnly={true}
              key={session.guid}
              studySession={session}
              onUpdateSessionSchedule={() => {}}></SchedulableSingleSessionContainer>
          </Box>
        ))}
      </Box>
      {children}
    </Box>
  )
}

export default ReadOnlyScheduler
