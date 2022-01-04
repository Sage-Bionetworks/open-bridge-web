import {ReactComponent as NotificationsIcon} from '@assets/scheduler/notifications_icon.svg'
import {ReactComponent as TimerIcon} from '@assets/scheduler/timer_icon.svg'
import AssessmentImage from '@components/assessments/AssessmentImage'
import SessionIcon from '@components/widgets/SessionIcon'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import Tooltip, {TooltipProps} from '@material-ui/core/Tooltip'
import {latoFont, poppinsFont} from '@style/theme'
import {
  Schedule,
  ScheduleTimeline,
  StudySession,
  StudySessionTimeline,
} from '@typedefs/scheduling'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import Pluralize from 'react-pluralize'
import TimelineBurstPlot from './timeline-plot/TimelineBurstPlot'

const useStyles = makeStyles(theme => ({
  stats: {
    fontFamily: latoFont,
    fontWeight: 'bold',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',

    '& span': {
      padding: theme.spacing(2, 3, 2, 1),
    },
  },
  legend: {
    margin: theme.spacing(1, 0, 2, 0),
    display: 'flex',
    '&>div': {
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(0.25),
      padding: theme.spacing(1, 2),
      border: '1px solid black',
      borderRadius: '22px',
      fontFamily: poppinsFont,
      fontSize: '14px',
      '&:hover': {
        backgroundColor: '#BCD5E4',
      },
    },
    maxWidth: '90%',
    flexWrap: 'wrap',
  },
  toolTip: {
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(1, 1, 0.1, 1),
    boxShadow: '0px 0px 3px 1px rgba(0, 0, 0, 0.2)',
  },
  arrow: {
    backgroundColor: 'transparent',
    color: theme.palette.primary.dark,
    fontSize: '20px',
  },
  assessmentBox: {
    width: '100%',
    height: '100px',
    marginBottom: '8px',
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
  const classes = useStyles()
  return (
    <Tooltip
      key={`session_${session.guid}`}
      {...tooltipProps}
      title={
        <Box width="115px">
          {session.assessments?.map((assessment, index) => {
            return (
              <Box
                className={classes.assessmentBox}
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
      arrow
      classes={{
        tooltip: classes.toolTip,
        arrow: classes.arrow,
      }}>
      <Box style={{cursor: 'pointer'}}>{children}</Box>
    </Tooltip>
  )
}

const ScheduleTimelineDisplay: React.FunctionComponent<TimelineProps> = ({
  studyId,
  schedule: schedFromDisplay,
  timeline,
  isDefault,
  onSelectSession,
}: TimelineProps) => {
  const handleError = useErrorHandler()

  const classes = useStyles()
  const tooltipProps: Partial<TooltipProps> = {
    placement: 'top',
  }

  const getSession = (sessionGuid: string): StudySessionTimeline => {
    return timeline?.sessions.find(s => s.guid === sessionGuid)!
  }

  return (
    <Box pt={0} pb={3} px={0}>
      {!timeline && (
        <>
          This timeline viewer will update to provide a visual summary of the
          schedules you’ve defined below for each session!.
        </>
      )}
      {timeline && (
        <div className={classes.stats}>
          <NotificationsIcon />{' '}
          <Pluralize
            singular={'notification'}
            count={timeline.totalNotifications}
          />
          <TimerIcon />{' '}
          <Pluralize singular={'total minute'} count={timeline.totalMinutes} />
        </div>
      )}
      <Box display="flex" justifyContent="space-between">
        <Box className={classes.legend}>
          {schedFromDisplay?.sessions?.map((s, index) => (
            <TooltipHoverDisplay
              key={s.guid}
              session={s}
              tooltipProps={tooltipProps}>
              <div
                onClick={() => {
                  onSelectSession(s)
                }}>
                <SessionIcon index={index} key={s.guid} symbolKey={s.symbol}>
                  {getSession(s.guid!)?.label}
                </SessionIcon>
              </div>
            </TooltipHoverDisplay>
          ))}
        </Box>
      </Box>
      {timeline?.schedule && (
        <TimelineBurstPlot studyId={studyId} timeline={timeline}>
          {isDefault && (
            <div>
              Design the study's schedule/protocol by selecting each session
              above.&nbsp;&nbsp;A summary of the schedule/protocol will be
              visualized here.
            </div>
          )}
        </TimelineBurstPlot>
      )}
    </Box>
  )
}

export default ScheduleTimelineDisplay
