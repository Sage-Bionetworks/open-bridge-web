import SessionIcon from '@components/widgets/SessionIcon'
import {makeStyles} from '@material-ui/core/styles'
import {TimelineScheduleItem} from '@typedefs/scheduling'
import moment from 'moment'
import React from 'react'
import {TimelineZoomLevel} from './types'

const useStyles = makeStyles(theme => ({}))

export interface SingleSessionPlotProps {
  sessionIndex: number
  zoomLevel: TimelineZoomLevel
  sessionGuid: string
  schedulingItems: TimelineScheduleItem[]
  scheduleLength?: number
  graphSessionHeight: number
  unitPixelWidth: number
  displayIndex: number
  xCoords: number[]
}

export interface SingleSessionLinePlotProps {
  containerWidth: number
  sessionIndex: number
  scheduleLength: number
  zoomLevel: TimelineZoomLevel
  graphSessionHeight: number
  unitPixelWidth: number
  hasSessionLines?: boolean
}

export function getSingleSessionDayX(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
  scheduleLength: number
): {day: number; startTime: number; expire: number}[] {
  let result: number[] = []

  const times = schedulingItems
    .filter(i => i.refGuid === studySessionGuid)
    .map(i => {
      const startTimeAsTime = moment(i.startTime, ['h:m a', 'H:m'])
      var stHrAsMin = startTimeAsTime.get('hours') * 60
      var stMin = startTimeAsTime.get('minutes')
      var fractionOfDay = (stHrAsMin + stMin) / (24 * 60)

      const expiration = i.expiration ? i.expiration : `P${scheduleLength}D`

      const duration = moment.duration(expiration).asMinutes()
      let expire = duration / 1440

      if (!i.expiration) {
        expire = expire - fractionOfDay
      }
      return {day: i.startDay, startTime: fractionOfDay, expire: expire}
    })

  return times
}

const SessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  sessionIndex,
  displayIndex,
  graphSessionHeight,
  unitPixelWidth,
  xCoords,
}) => {
  const days = [...new Array(8)].map((i, index) => (
    <div
      key={`day_${index}`}
      style={{
        width: '1px',
        height: '16px',
        backgroundColor: 'black',
        position: 'absolute',
        zIndex: 100,
        top: `0`,
        left: `${index * unitPixelWidth}px`,
      }}></div>
  ))
  const sessionGraph =
    /*getSingleSessionX(sessionGuid, schedulingItems)*/ xCoords.map(i => (
      <SessionIcon
        key={`session${i}`}
        index={sessionIndex}
        style={{
          // width: '20px',
          position: 'absolute',
          zIndex: 100,
          top: `${graphSessionHeight * displayIndex}px`,
          left: `${i * unitPixelWidth - 6}px`,
        }}></SessionIcon>
    ))
  return (
    <div style={{position: 'relative'}}>
      {days}
      {sessionGraph}
    </div>
  )
}

export default SessionPlot
