import { Box, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import _ from 'lodash'
import { Layout } from 'plotly.js'
import React from 'react'
import { useAsync } from '../../../helpers/AsyncHook'
import StudyService from '../../../services/study.service'
import { Schedule } from '../../../types/scheduling'
import TimelinePlot from './TimelinePlot'

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
  scroll: {
    '&::-webkit-scrollbar': {
      '-webkit-appearance': 'none',
      width: '4px',
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '2px',
      backgroundColor: 'rgba(0, 0, 0, .5)',
      boxShadow: '0 0 1px rgba(255, 255, 255, .5)',
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
  const [currentZoomLevel, setCurrentZoomLevel] = React.useState<string>('')

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
    const periods = ['Daily', 'Weekly', 'Monthly', 'Quarterly']

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

  const getTimesForSession = (sessionGuid: string): TimelineScheduleItem[] => {
    return (
      schedule
        ?.filter(i => i.refGuid === sessionGuid)
        ?.map(i => {
          delete i.assessments
          return i
        }) || []
    )
  }

  function getXY(studySessionGuid: string, sessionIndex: number) {
    const times = getTimesForSession(studySessionGuid)

    let result: number[] = []
    /* time dependent
    const x = times.map(i => {
      const startTimeAsTime = moment(i.startTime, ['h:m a', 'H:m'])
      var stHrAsMin = startTimeAsTime.get('hours') * 60
      var stMin = startTimeAsTime.get('minutes')
      var fractionOfDay = (stHrAsMin + stMin) / (24 * 60)
      //round to 2 decs
      fractionOfDay = Math.round(fractionOfDay * 100) / 100
      return i.startDay + 1+ fractionOfDay //add 1 since it's zeo based
    })

    result = x*/
    const grouppedStartDays = _.groupBy(
      times.map(i => i.startDay + 1),
      Math.floor,
    )
    Object.values(grouppedStartDays).forEach(groupArray => {
      const fraction = 1 / groupArray.length
      groupArray.forEach((item, index) => {
        result.push(item + fraction * index)
      })
    })

    const y = new Array(result.length).fill(sessionIndex)

    return { x: result, y: y }
  }

  const data = schedFromDisplay.sessions.map((session, index) => {
    const { x, y } = getXY(session.guid!, index + 1)

    const m = {
      hoverinfo: 'skip',
      name: session.name,
      marker: {
        color: 'rgb(16, 32, 77)',
        symbol: index,
        size: 10,
        line: {
          //color: 'white',
          width: 2,
        },
      },
      type: 'scatter',
      mode: 'markers',
      x: x,
      y: y,
    }
    return m
  })

  const arr = []
  for (var i = 0; i < 48; i++) {
    arr.push(i)
   arr.push(i)
    arr.push(i)
 //   arr.push(i+100)
//arr.push(i+200)
    //arr.push(i+300)
  }

  const data2 = arr.map((i, index) => {
    const mod = index % 3
    let clr = '#000'
    switch (mod) {
      case 0: 
        clr = '#000'
        break;
      

      case 1: 
        clr = '#ddd'
       break
      

      case 2: 
        clr = '#fff'
        break
      
    }

    const m = {
      hoverinfo: 'skip',

      marker: {
        color: clr,
        // opacity:
        symbol: i,
        size: 15,
        line: {
          color:'Black',
          width: 1,
        },
      },
      type: 'scatter',
      mode: 'markers', //'lines+markers',
      x: [1, 2, 3, 4, 5, 6, 7],
      y: [
        -index * 2,
        -index * 2,
        -index * 2,
        -index * 2,
        -index * 2,
        -index * 2,
        -index * 2,
      ],
    }
    return m
  })

  const layout: Partial<Layout> = {
    /* annotations: [
        {
            text: 'simple annotation',
            x: 0,
            xref: 'paper',
            y: 0,
            yref: 'paper'
        }
    ],*/
    paper_bgcolor: '#ECECEC',
    plot_bgcolor: '#ECECEC',
    hovermode: false, // no hover
    title: '', // no title
    autosize: false,
    //32px each tick
    width: scheduleLength * 32,
    height: sessions.length * 48,

    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 40,
      pad: 10,
    },
    xaxis: {
      zeroline: false,

      side: 'top',
      title: 'time',
      rangemode: 'tozero',
      range: [0.1, scheduleLength + 1], //add 1 because it's 0-based originally
      constrain: 'range',
      fixedrange: true,

      ticklen: 0, //vertical height
      dtick: 1, //how many is the tick
    },
    yaxis: {
      zeroline: false,
      visible: true,
      rangemode: 'tozero',
      title: '',
      fixedrange: true,
      range: [0, sessions.length + 1],
      dtick: 1,

      gridwidth: 1, 
      gridcolor: 'Black',
 

      //   dtick = 0.75
      /*     tickmode = 'array',
        tickvals = [1, 3, 5, 7, 9, 11],
        ticktext = ['One', 'Three', 'Five', 'Seven', 'Nine', 'Eleven']*/
    },
    legend: {
      orientation: 'h',
      yanchor: 'bottom',
      y: 1.2,
      xanchor: 'left',
      x: 0,
    },
  }

  const layout2: Partial<Layout> = {
    // autosize: true,
    height: 4000,

    margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0,
      pad: 10,
    },

    yaxis: {
    
      visible: true,
      dtick: 2,
      zeroline: false,
   
     // rangemode: 'tozero',
      title: '',
     //fixedrange: true,
     // range: [0, sessions.length + 1],
   

      gridwidth: 1, 
      gridcolor: 'Black',
    }
    /*xaxis: {
      zeroline: false,

      side: 'top',
      title: 'time',
      rangemode: 'tozero',
      range: [.1, scheduleLength + 1], //add 1 because it's 0-based originally
      constrain: 'range',
      fixedrange: true,
 
      ticklen: 0, //vertical height
      dtick: 1, //how many is the tick
    },
    yaxis: {
      zeroline: false,
      visible: false,
      rangemode: 'tozero',
      title: 'sessions',
      fixedrange: true,
      range: [0, sessions.length + 1],
      //   dtick = 0.75
      /*     tickmode = 'array',
        tickvals = [1, 3, 5, 7, 9, 11],
        ticktext = ['One', 'Three', 'Five', 'Seven', 'Nine', 'Eleven']*/
    // },
  }

  const config = { scrollZoom: false }

  return (
    <Box padding="30px" bgcolor="#ECECEC">
      This timeline viewer will update to provide a visual summary of the
      schedules you’ve defined below for each session.{timeline?.duration}{' '}
      {schedFromDisplay?.duration}
     { /*<div style={{ width: '100%' }}>
        <PlotlyChart data={data2} layout={layout2} config={config} />
  </div>*/}
      ===========
{schedule && <TimelinePlot schedulingItems={schedule} scheduleLength={scheduleLength} sortedSessions={schedFromDisplay.sessions}></TimelinePlot>}
      {/*<div
        style={{ overflow: 'scroll', width: '100%' }}
        className={classes.scroll}
      >
        <div style={{ width: '3000px' }}>
          <PlotlyChart data={data} layout={layout} config={config} />
        </div>
      </div>*/}
      <Select
        labelId="lead-investigator-drop-down"
        id="lead-investigator-drop-down"
        value={currentZoomLevel}
        onChange={e => {
          setCurrentZoomLevel(e.target.value as string)
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
      {/*schedFromDisplay?.sessions?.map((s, index) => (
        <>
          <SessionIcon index={index}>
            {getSession(s.guid!)?.label + '---' + s.guid}
          </SessionIcon>
          <ObjectDebug
            data={getTimesForSession(s.guid!)}
            label=""
          ></ObjectDebug>
        </>
      ))*/}
    </Box>
  )
}

export default Timeline
