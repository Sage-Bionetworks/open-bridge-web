import AssessmentImage from '@components/assessments/AssessmentImage'
import SessionIcon from '@components/widgets/SessionIcon'
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone'
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone'
import {Box, Button, styled} from '@mui/material'
import Tooltip, {tooltipClasses, TooltipProps} from '@mui/material/Tooltip'
import {Schedule, ScheduleTimeline, StudySession, StudySessionTimeline} from '@typedefs/scheduling'
import * as dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'
import React from 'react'
import TimelineBurstPlot from './timeline-plot/TimelineBurstPlot'
dayjs.extend(duration)
dayjs.extend(relativeTime)

const StyledSessionButton = styled(Button, {label: 'StyledSessionButton'})(({theme}) => ({
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(0.25),
  padding: theme.spacing(0, 2),

  borderRadius: '21px',
  height: theme.spacing(4.5),
  fontSize: '16px',
  '& svg': {
    '& path, circle, triangle, rect': {
      fill: 'white',
    },
    fill: 'white',
  },
}))

const StyledLegend = styled(Box, {label: 'StyledLegend'})(({theme}) => ({
  marginRight: theme.spacing(2),
  marginBottom: theme.spacing(0.25),
  margin: theme.spacing(1, 0, 2, 0),
  display: 'flex',

  maxWidth: '90%',
  flexWrap: 'wrap',
}))

const StyledTooltip = styled(({className, ...props}: TooltipProps) => (
  <Tooltip {...props} arrow classes={{popper: className}} />
))(({theme}) => ({
  [`& .${tooltipClasses.arrow}`]: {
    backgroundColor: 'transparent',
    color: '#F1F3F5',
    fontSize: '20px',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#F1F3F5',
    padding: theme.spacing(1, 1, 0.1, 1),
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.2)',
  },
}))

export interface TimelineProps {
  schedule: Schedule
  timeline: ScheduleTimeline
  studyId: string
  isDefault?: boolean
  onSelectSession: (session: StudySession) => void
}

export const TooltipHoverDisplay: React.FunctionComponent<{
  session: StudySession
  tooltipProps?: Partial<TooltipProps>
  children: React.ReactNode
}> = ({session, tooltipProps, children}) => {
  return (
    <StyledTooltip
      key={`session_${session.guid}`}
      {...tooltipProps}
      title={
        <Box width="115px">
          {session.assessments?.map((assessment, index) => {
            return (
              <Box
                sx={{width: '100%', height: '100px', marginBottom: '8px'}}
                key={`assmnt_${assessment.guid}_${index}`}>
                <AssessmentImage
                  resources={assessment.resources}
                  variant="small"
                  name={assessment.title}
                  key={index}
                  smallVariantProperties={{
                    width: '100%',
                    backgroundColor: '#F6F6F6',
                  }}></AssessmentImage>
              </Box>
            )
          })}
        </Box>
      }
      arrow>
      <Box style={{cursor: 'pointer'}}>{children}</Box>
    </StyledTooltip>
  )
}

const ScheduleTimelineDisplay: React.FunctionComponent<TimelineProps> = ({
  studyId,
  schedule: schedFromDisplay,
  timeline,
  isDefault,
  onSelectSession,
}: TimelineProps) => {
  const tooltipProps: Partial<TooltipProps> = {
    placement: 'top',
  }

  const getSession = (sessionGuid: string): StudySessionTimeline => {
    return timeline?.sessions.find(s => s.guid === sessionGuid)!
  }

  return (
    <Box pt={0} pb={3} px={0}>
      <Box id="topArea" px={2}>
        {!timeline && (
          <>
            This timeline viewer will update to provide a visual summary of the schedules you’ve defined below for each
            session!.
          </>
        )}
        {timeline && (
          <Box
            sx={{
              fontWeight: 'bold',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
            }}>
            <NotificationsTwoToneIcon /> {timeline.totalNotifications}{' '}
            {timeline.totalNotifications > 1 ? 'notifications' : 'notification'}
            &nbsp; &nbsp;
            <AccessTimeTwoToneIcon /> &nbsp;
            {dayjs
              .duration(timeline.totalMinutes, 'minutes')
              .format(
                `H [Hour${timeline.totalMinutes > 120 || timeline.totalMinutes < 60 ? 's' : ''}] m [Minute${
                  timeline.totalMinutes % 60 === 1 ? '' : 's'
                }]`
              )}
          </Box>
        )}
        <Box display="flex" justifyContent="space-between">
          <StyledLegend>
            {schedFromDisplay?.sessions?.map((s, index) => (
              <TooltipHoverDisplay key={s.guid} session={s} tooltipProps={tooltipProps}>
                <StyledSessionButton
                  variant="contained"
                  onClick={() => {
                    onSelectSession(s)
                  }}>
                  <SessionIcon index={index} key={s.guid} symbolKey={s.symbol}>
                    {getSession(s.guid!)?.label}
                  </SessionIcon>
                </StyledSessionButton>
              </TooltipHoverDisplay>
            ))}
          </StyledLegend>
        </Box>
      </Box>
      {timeline?.schedule && (
        <TimelineBurstPlot studyId={studyId} timeline={timeline}>
          {isDefault && (
            <div>
              Design the study's schedule/protocol by selecting each session above.&nbsp;&nbsp;A summary of the
              schedule/protocol will be visualized here.
            </div>
          )}
        </TimelineBurstPlot>
      )}
    </Box>
  )
}

export default ScheduleTimelineDisplay
