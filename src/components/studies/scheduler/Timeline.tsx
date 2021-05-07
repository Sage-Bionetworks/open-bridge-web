import { Box, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import React from 'react'
import { useAsync } from '../../../helpers/AsyncHook'
import StudyService from '../../../services/study.service'
import { Schedule } from '../../../types/scheduling'
import SessionIcon from '../../widgets/SessionIcon'
import TimelinePlot, { TimelineZoomLevel } from './TimelinePlot'

const useStyles = makeStyles(theme => ({
  selectPrincipleInvestigatorButton: {
    height: '30px',
    border: '1px solid black',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    outline: 'none',
    transition: '0.25s ease',
    fontSize: '14px',
    //width: '100%',
    boxSizing: 'border-box',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    paddingLeft: theme.spacing(2),
  },

  principleInvestigatorOption: {
    backgroundColor: 'white',
    height: '30px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottom: '1px solid black',
    borderLeft: '1px solid black',
    borderRight: '1px solid black',
    transition: '0.25s ease',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    cursor: 'pointer',
  },
  selectMenu: {
    backgroundColor: 'white',
    '&:focus': {
      backgroundColor: 'white',
    },
  },
  container: {
    // width: '100%',
    height: '30px',
  },
  listPadding: {
    padding: theme.spacing(0),
  },
  listBorder: {
    borderRadius: '0px',
  },
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
}

const Timeline: React.FunctionComponent<TimelineProps> = ({
  token,
  schedule: schedFromDisplay,
}: TimelineProps) => {
  const [sessions, setSessions] = React.useState<TimelineSession[]>([])
  const [schedule, setSchedule] = React.useState<TimelineScheduleItem[]>()
  const [scheduleLength, setScheduleLength] = React.useState(0)
  const [dropdown, setDropdown] = React.useState(['Daily'])
  const [currentZoomLevel, setCurrentZoomLevel] = React.useState<TimelineZoomLevel>('Monthly')

  const classes = useStyles()
  const { data: timeline, status, error, run, setData } = useAsync<any>({
    status: 'PENDING',
    data: [],
  })
  console.log('rerender')

  React.useEffect(() => {
    console.log('getting timeline ')
    return run(
      StudyService.getStudyScheduleTimeline(schedFromDisplay.guid, token!),
    )
  }, [run, schedFromDisplay?.version, token])

  const setZoomLevel = (scheduleDuration: string) => {
    const periods: TimelineZoomLevel[] = ['Daily', 'Weekly', 'Monthly', 'Quarterly']

    const duarationStringLength = scheduleDuration.length
    const unit = scheduleDuration[duarationStringLength - 1]
    console.log(unit, scheduleDuration)
    const n = parseInt(scheduleDuration.substr(1, duarationStringLength - 2))
    const lengthInDays = unit === 'W' ? n * 7 : n
    if (unit !== 'W' && unit !== 'D') {
      throw new Error('Expects W or D study period')
    }
    setScheduleLength(lengthInDays)
    if (lengthInDays < 8) {
      periods.splice(1)
    }
    if (lengthInDays < 31) {
      periods.splice(2)
    }
    if (lengthInDays < 92) {
      periods.splice(3)
    }
    console.log(periods)
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
    <Box padding="30px" bgcolor="#ECECEC">
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
              &nbsp;
              {/*<ObjectDebug
            data={getTimesForSession(s.guid!)}
            label=""
          ></ObjectDebug>*/}
            </div>
          ))}
        </Box>
        <Select
          labelId="lead-investigator-drop-down"
          id="lead-investigator-drop-down"
          value={currentZoomLevel}
          onChange={e => {
            setCurrentZoomLevel(e.target.value as TimelineZoomLevel)
          }}
          className={classes.container}
          disableUnderline
          classes={{
            selectMenu: classes.selectMenu,
            root: classes.selectPrincipleInvestigatorButton,
          }}
          MenuProps={{
            classes: { list: classes.listPadding, paper: classes.listBorder },
            getContentAnchorEl: null,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'center',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'center',
            },
          }}
          displayEmpty
        >
          <MenuItem value="" disabled style={{ display: 'none' }}>
            Select Zoom Level
          </MenuItem>
          {dropdown.map((el, index) => (
            <MenuItem
              className={clsx(classes.principleInvestigatorOption)}
              key={index}
              value={el}
              id={`investigator-${index}`}
            >
              {el}
            </MenuItem>
          ))}
        </Select>
      </Box>
      {schedule && (
        <TimelinePlot
          schedulingItems={schedule}
          scheduleLength={scheduleLength}
          sortedSessions={schedFromDisplay.sessions}
          zoomLevel={currentZoomLevel}
        ></TimelinePlot>
      )}
    </Box>
  )
}

export default Timeline
