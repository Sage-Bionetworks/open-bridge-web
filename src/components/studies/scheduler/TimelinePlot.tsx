import { makeStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import { Layout } from 'plotly.js'
import React from 'react'
import PlotlyChart from 'react-plotlyjs-ts'
import { StudySession } from '../../../types/scheduling'

const useStyles = makeStyles(theme => ({
  scroll: {
    '&::-webkit-scrollbar': {
      height: '8px',
      '-webkit-appearance': 'none',
    },

    /* Track */
    '&::-webkit-scrollbar-track': {
      //bgColor: '#000';
    },

    '&::-webkit-scrollbar-thumb': {
      borderRadius: '2px',
      //color: 'blue',
      background: '#C4C4C4',
      boxShadow: '0 0 1px rgba(255, 255, 255, .5)',
      '&:hover': {
        background: '#b4b4b4',
      },
    },
  },
}))

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

export type TimelineZoomLevel = 'Daily'| 'Weekly'| 'Monthly' |'Quarterly'

export interface TimelinePlotProps {
  schedulingItems: TimelineScheduleItem[]
  scheduleLength: number
  sortedSessions: StudySession[]
  zoomLevel: TimelineZoomLevel
}

const TimelinePlot: React.FunctionComponent<TimelinePlotProps> = ({
  schedulingItems,
  scheduleLength,
  sortedSessions,
  zoomLevel
}: TimelinePlotProps) => {
  const classes = useStyles()

  const getTimesForSession = (sessionGuid: string): number[] => {
    return schedulingItems
      .filter(i => i.refGuid === sessionGuid)
      .map(i => i.startDay + 1)
  }

  function getXY(
    studySessionGuid: string,
    sessionIndex: number,
    sessionsNumber: number,
  ) {
    const times = getTimesForSession(studySessionGuid)

    let result: number[] = []

    const grouppedStartDays = _.groupBy(
      getTimesForSession(studySessionGuid),
      Math.floor,
    )
    Object.values(grouppedStartDays).forEach(groupArray => {
      const fraction = 1 / groupArray.length
      groupArray.forEach((item, index) => {
        result.push(item + fraction * index)
      })
    })

    const y = new Array(result.length).fill(sessionsNumber - sessionIndex + 1)

    return { x: result, y: y }
  }
  const markers = [
    0,
    5,
    1,
    2,
    13,
    14,
    19,
    21,
    22,
    8,
    15,
    20,
    23,
    12,
    16,
    24,
    9,
    7,
    6,
    10,
  ]
  const data = sortedSessions.map((session, index) => {
    const { x, y } = getXY(session.guid!, index + 1, sortedSessions.length)

    const m = {
      hoverinfo: 'skip',
      name: session.name,
      marker: {
        color: 'rgb(16, 32, 77)',
        symbol: markers[index],
        size: 10,
        line: {
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

  const getWidth = (lengthInDays: number, zoomLevel: TimelineZoomLevel)=> {
    switch (zoomLevel) {
      case "Monthly": 
      return lengthInDays * 35
      break
      case "Weekly": 
      return  lengthInDays * 162
      break
      case "Quarterly": 
      return  lengthInDays * 11
      break

    }
  }

  const layout: Partial<Layout> = {
    showlegend: false,
    paper_bgcolor: '#ECECEC',
    plot_bgcolor: '#ECECEC',
    hovermode: false, // no hover
    title: '', // no title
    autosize: false,
    //32px each tick
    width: getWidth(scheduleLength, zoomLevel),
    height: sortedSessions.length * 48,

    margin: {
      l: 30,
      r: 0,
      b: 0,
      t: 20,
      pad: 5,
    },
    xaxis: {
      zeroline: false,

      side: 'top',
      
  
    
      rangemode: 'tozero',
      range: [0.9, scheduleLength + 1], //add 1 because it's 0-based originally
      constrain: 'range',
      fixedrange: true,

      ticklen: 0, //vertical height
      dtick: zoomLevel === 'Quarterly'? 10 : 1, //how many is the tick
    },
    yaxis: {
      zeroline: false,
      visible: true,
      rangemode: 'tozero',
      showticklabels: false,
      title: '',
      fixedrange: true,
      range: [0, sortedSessions.length + .5],
      dtick: 1,

      gridwidth: 1,
      gridcolor: 'Black',
    },
  
  }

  const config = { scrollZoom: false, displayModeBar: false }

  return (
    <>
      <div
        style={{ overflow: 'scroll', width: '100%', position: 'relative' }}
        className={classes.scroll}

      >
        <div style={{position: 'absolute',top: '-4px', left: '3px', zIndex: 1000 }}>Day</div>
        <div style={{ width: `${getWidth(scheduleLength, zoomLevel)}px` }}>
          <PlotlyChart data={data} layout={layout} config={config} />
        </div>
      </div>
    </>
  )
}

export default TimelinePlot
