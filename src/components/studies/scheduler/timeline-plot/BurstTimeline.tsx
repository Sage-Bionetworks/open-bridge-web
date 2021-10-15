import {useTimeline} from '@components/studies/scheduleHooks'
import {Box} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {latoFont} from '../../../../style/theme'
import {Schedule, StudySessionGeneral} from '../../../../types/scheduling'
import TimelineBurstPlot from './../timeline-plot/TimelineBurstPlot'
import {TimelineScheduleItem, TimelineZoomLevel} from './types'

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
  schedule: Schedule
  burstSessionGuids: string[]
  burstNumber: number
  burstFrequency: number
  studyId: string
}

const BurstTimeline: React.FunctionComponent<TimelineProps> = ({
  burstNumber,
  burstFrequency,
  burstSessionGuids,
  schedule: schedFromDisplay,
  studyId,
}: TimelineProps) => {
  const handleError = useErrorHandler()
  const [sessions, setSessions] = React.useState<StudySessionGeneral[]>([])
  const [schedule, setSchedule] = React.useState<TimelineScheduleItem[]>()
  const [scheduleLength, setScheduleLength] = React.useState(0)
  // const [dropdown, setDropdown] = React.useState(['Daily'])
  const [currentZoomLevel, setCurrentZoomLevel] =
    React.useState<TimelineZoomLevel>('Weekly')

  const classes = useStyles()

  const {data: timeline, error, isLoading} = useTimeline(studyId)

  /* const setZoomLevel = (scheduleDuration: string) => {
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
  }*/

  React.useEffect(() => {
    if (timeline?.sessions) {
      const {sessions, schedule} = timeline
      setSessions(sessions)
      setSchedule(schedule)
    }
  }, [timeline, schedFromDisplay?.version])

  const getSession = (sessionGuid: string): StudySessionGeneral => {
    return sessions.find(s => s.guid === sessionGuid)!
  }
  if (isLoading || !burstFrequency || !burstNumber) {
    return <></>
  }

  return (
    <Box py={3} px={0}>
      {!timeline && (
        <>
          This timeline viewer will update to provide a visual summary of the
          schedules you’ve defined below for each session!
        </>
      )}

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
