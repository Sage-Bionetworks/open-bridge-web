import { Box } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import { useAsync } from '../../../helpers/AsyncHook'
import StudyService from '../../../services/study.service'
import { Schedule } from '../../../types/scheduling'
import BlackBorderDropdown from '../../widgets/BlackBorderDropdown'
import SessionIcon from '../../widgets/SessionIcon'
import TimelineCustomPlot, { TimelineZoomLevel } from './TimelineCustomPlot'

const useStyles = makeStyles(theme => ({
  legend: {
    margin: theme.spacing(1, 0),
    display: 'flex',
    '& div': {
      marginLeft: theme.spacing(1),
    },
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
  const [sessions, setSessions] = React.useState<TimelineSession[]>([])
  const [schedule, setSchedule] = React.useState<TimelineScheduleItem[]>()
  const [scheduleLength, setScheduleLength] = React.useState(0)
  const [dropdown, setDropdown] = React.useState(['Daily'])
  const [currentZoomLevel, setCurrentZoomLevel] =
    React.useState<TimelineZoomLevel>('Monthly')

  const classes = useStyles()
  const {
    data: timeline,
    status,
    error,
    run,
    setData,
  } = useAsync<any>({
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

  return (
    <Box padding="30px">
      This timeline viewer will update to provide a visual summary of the
      schedules you’ve defined below for each session.{timeline?.duration}{' '}
      {schedFromDisplay?.duration}
      <Box display="flex" justifyContent="space-between">
        <Box className={classes.legend}>
          {schedFromDisplay?.sessions?.map((s, index) => (
            <div key={s.guid}>
              <SessionIcon index={index}>
                {getSession(s.guid!)?.label}
              </SessionIcon>
            </div>
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
