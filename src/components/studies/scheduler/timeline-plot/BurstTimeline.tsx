import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {useAsync} from '../../../../helpers/AsyncHook'
import ScheduleService from '../../../../services/schedule.service'
import {latoFont} from '../../../../style/theme'
import {Schedule} from '../../../../types/scheduling'
import BlackBorderDropdown from '../../../widgets/BlackBorderDropdown'
import TimelineBurstPlot from './../timeline-plot/TimelineBurstPlot'
import {TimelineScheduleItem, TimelineSession, TimelineZoomLevel} from './types'

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
      marginBottom: theme.spacing(0.25),
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
  token: string
  schedule: Schedule
  burstSessionGuids: string[]
  burstNumber: number
  burstFrequency: number
  studyId: string
}

const BurstTimeline: React.FunctionComponent<TimelineProps> = ({
  token,
  burstNumber,
  burstFrequency,
  burstSessionGuids,
  schedule: schedFromDisplay,
  studyId,
}: TimelineProps) => {
  const handleError = useErrorHandler()
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

  React.useEffect(() => {
    return run(ScheduleService.getScheduleTimeline(studyId, token!))
  }, [run, schedFromDisplay.version, token])

  const setZoomLevel = (scheduleDuration: string) => {
    const periods: TimelineZoomLevel[] = [
      //'Daily',

      'Weekly',
      'Bi-Weekly',
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
    setCurrentZoomLevel(periods[0])
    setDropdown(periods)
  }

  React.useEffect(() => {
    if (timeline?.sessions) {
      const {sessions, schedule} = timeline
      setSessions(sessions)
      setSchedule(schedule)
      setZoomLevel(timeline.duration as string)
    }
  }, [timeline, schedFromDisplay?.version])

  const getSession = (sessionGuid: string): TimelineSession => {
    return sessions.find(s => s.guid === sessionGuid)!
  }
  if (status === 'PENDING' || !burstFrequency || !burstNumber) {
    return <></>
  }
  if (status === 'REJECTED') {
    handleError(error!)
  }

  return (
    <Box py={3} px={0}>
      {!timeline && (
        <>
          This timeline viewer will update to provide a visual summary of the
          schedules you’ve defined below for each session!.{status}
        </>
      )}

      <Box mb={4} pr={4} textAlign="right">
        <BlackBorderDropdown
          width="100px"
          value={currentZoomLevel}
          onChange={e => {
            setCurrentZoomLevel(e.target.value as TimelineZoomLevel)
          }}
          id="lead-investigator-drop-down"
          dropdown={dropdown.map(item => ({value: item, label: item}))}
          emptyValueLabel="Select Zoom Level"></BlackBorderDropdown>
      </Box>
      {schedule && (
        <TimelineBurstPlot
          schedulingItems={schedule}
          burstSessionGuids={burstSessionGuids}
          burstNumber={burstNumber || 0}
          burstFrequency={burstFrequency || 0}
          scheduleLength={scheduleLength}
          sortedSessions={schedFromDisplay.sessions}
          zoomLevel={currentZoomLevel}></TimelineBurstPlot>
      )}
    </Box>
  )
}

export default BurstTimeline
