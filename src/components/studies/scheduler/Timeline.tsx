import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import { useErrorHandler } from 'react-error-boundary'
import Pluralize from 'react-pluralize'
import { ReactComponent as NotificationsIcon } from '../../../assets/scheduler/notifications_icon.svg'
import { ReactComponent as TimerIcon } from '../../../assets/scheduler/timer_icon.svg'
import { useAsync } from '../../../helpers/AsyncHook'
import StudyService from '../../../services/study.service'
import { latoFont } from '../../../style/theme'
import { Schedule } from '../../../types/scheduling'
import BlackBorderDropdown from '../../widgets/BlackBorderDropdown'
import SessionIcon from '../../widgets/SessionIcon'
import TimelineCustomPlot, { TimelineZoomLevel } from './TimelineCustomPlot'
import AssessmentImage from '../../assessments/AssessmentImage'
import Tooltip from '@material-ui/core/Tooltip'

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
    margin: theme.spacing(1, 0),
    display: 'flex',
    '& div': {
      marginRight: theme.spacing(2),
    },
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

type TimelineSession = {
  guid: string
  label: string
  minutesToComplete: number
}

type TimelineScheduleItem = {
  instanceGuid: 'JYvaSpcTPot8TwZnFFFcLQ'
  startDay: number
  endDay: number
  startTime: string
  delayTime: string
  expiration: string
  refGuid: string
  assessments?: any[]
}

export interface TimelineProps {
  token: string
  schedule: Schedule
  version: number
}

const Timeline: React.FunctionComponent<TimelineProps> = ({
  token,
  version,
  schedule: schedFromDisplay,
}: TimelineProps) => {
  const handleError = useErrorHandler()
  const [sessions, setSessions] = React.useState<TimelineSession[]>([])
  const [schedule, setSchedule] = React.useState<TimelineScheduleItem[]>()
  const [scheduleLength, setScheduleLength] = React.useState(0)
  const [dropdown, setDropdown] = React.useState(['Daily'])
  const [hoveredLegendSession, setHoveredLegendSession] = React.useState(-1)
  const [
    currentZoomLevel,
    setCurrentZoomLevel,
  ] = React.useState<TimelineZoomLevel>('Monthly')

  const classes = useStyles()
  const { data: timeline, status, error, run, setData } = useAsync<any>({
    status: 'PENDING',
    data: [],
  })
  console.log('rerender')

  React.useEffect(() => {
    console.log('%c ---timeline getting--' + version, 'color: blue')
    return run(
      StudyService.getStudyScheduleTimeline(schedFromDisplay.guid, token!),
    )
  }, [run, version, token])

  const setZoomLevel = (scheduleDuration: string) => {
    const periods: TimelineZoomLevel[] = [
      'Daily',
      'Weekly',
      'Monthly',
      'Quarterly',
    ]
    const duration = moment.duration(scheduleDuration)

    const lengthInDays = duration.asDays()
    setScheduleLength(lengthInDays)
    if (lengthInDays < 8) {
      periods.splice(1)
    } else if (lengthInDays < 31) {
      periods.splice(2)
    } else if (lengthInDays < 92) {
      periods.splice(3)
    }
    console.log(periods)
    setCurrentZoomLevel(periods[periods.length - 1])
    setDropdown(periods)
  }

  React.useEffect(() => {
    console.log('trying to update info')

    if (timeline?.sessions) {
      console.log('updating info')
      const { sessions, schedule } = timeline
      setSessions(sessions)
      setSchedule(schedule)
      setZoomLevel(timeline.duration as string)
    }
  }, [timeline, schedFromDisplay?.version])

  const getSession = (sessionGuid: string): TimelineSession => {
    return sessions.find(s => s.guid === sessionGuid)!
  }
  if (status === 'PENDING') {
    return <></>
  }
  if (status === 'REJECTED') {
    handleError(error!)
  }

  return (
    <Box padding="30px">
      {!timeline && (
        <>
          This timeline viewer will update to provide a visual summary of the
          schedules you’ve defined below for each session!.{status}
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
            <Tooltip
              title={
                <Box width="115px">
                  {s.assessments?.map((assessment, index) => {
                    return (
                      <Box className={classes.assessmentBox}>
                        <AssessmentImage
                          resources={assessment.resources}
                          variant="small"
                          name={assessment.title}
                          key={index}
                          smallVariantProperties={{
                            width: '100%',
                            backgroundColor: '#F6F6F6',
                          }}
                        ></AssessmentImage>
                      </Box>
                    )
                  })}
                </Box>
              }
              arrow
              classes={{
                tooltip: classes.toolTip,
                arrow: classes.arrow,
              }}
            >
              <Box style={{ cursor: 'pointer' }}>
                <SessionIcon index={index} key={s.guid}>
                  {getSession(s.guid!)?.label}
                </SessionIcon>
              </Box>
            </Tooltip>
          ))}
        </Box>
        <BlackBorderDropdown
          width="100px"
          value={currentZoomLevel}
          onChange={e => {
            setCurrentZoomLevel(e.target.value as TimelineZoomLevel)
          }}
          id="lead-investigator-drop-down"
          dropdown={dropdown.map(item => ({ value: item, label: item }))}
          emptyValueLabel="Select Zoom Level"
        ></BlackBorderDropdown>
      </Box>
      {schedule && (
        <TimelineCustomPlot
          schedulingItems={schedule}
          scheduleLength={scheduleLength}
          sortedSessions={schedFromDisplay.sessions}
          zoomLevel={currentZoomLevel}
        ></TimelineCustomPlot>
      )}
    </Box>
  )
}

export default Timeline
