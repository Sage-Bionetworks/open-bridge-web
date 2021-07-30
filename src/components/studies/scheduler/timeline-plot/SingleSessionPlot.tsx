import {makeStyles} from '@material-ui/core/styles'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import SessionIcon from '../../../widgets/SessionIcon'
import {TimelineScheduleItem, TimelineZoomLevel, unitPixelWidth} from './types'

const useStyles = makeStyles(theme => ({
  sessionLine: {
    backgroundColor: 'black',
    height: '1px',
    position: 'absolute',
    zIndex: 100,
  },

  dailyIntervalLine: {
    borderLeft: '1px solid black',
    borderRight: '1px solid black',

    padding: '3px 0',
    position: 'absolute',
    zIndex: 100,
  },
  dailyIntervalInner: {
    backgroundColor: '#000',
    height: '1px',
    textAlign: 'center',
  },
}))

export interface SingleSessionPlotProps {
  sessionIndex: number
  zoomLevel: TimelineZoomLevel
  sessionGuid: string
  schedulingItems: TimelineScheduleItem[]
  scheduleLength?: number
  graphSessionHeight?: number
}

export interface SingleSessionLinePlotProps {
  containerWidth: number
  sessionIndex: number
  scheduleLength: number
  zoomLevel: TimelineZoomLevel
  graphSessionHeight?: number
}

export function getTimesForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[]
): number[] {
  return schedulingItems
    .filter(i => i.refGuid === sessionGuid)
    .map(i => i.startDay)
}

export function getSingleSessionX(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[]
): number[] {
  let result: number[] = []

  const grouppedStartDays = _.groupBy(
    getTimesForSession(studySessionGuid, schedulingItems),
    Math.floor
  )
  Object.values(grouppedStartDays).forEach(groupArray => {
    const fraction = 1 / groupArray.length
    groupArray.forEach((item, index) => {
      result.push(item + fraction * index)
    })
  })

  return result
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

const NonDailySessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  schedulingItems,
  sessionGuid,
  zoomLevel,
  sessionIndex,
  graphSessionHeight = 50,
}) => {
  const sessionGraph = getSingleSessionX(sessionGuid, schedulingItems).map(
    i => (
      <SessionIcon
        key={`session${i}`}
        index={sessionIndex}
        style={{
          width: '20px',
          position: 'absolute',
          zIndex: 100,
          top: `${graphSessionHeight * sessionIndex - 5}px`,

          left: `${i * unitPixelWidth[zoomLevel] - 10}px`,
        }}></SessionIcon>
    )
  )
  return <>{sessionGraph}</>
}

export const SessionLine: React.FunctionComponent<SingleSessionLinePlotProps> =
  ({sessionIndex, zoomLevel, graphSessionHeight = 50, containerWidth}) => {
    const classes = useStyles()
    if (zoomLevel === 'Daily') {
      return <></>
    }

    const result = (
      <>
        <div
          key="slash"
          style={{
            position: 'absolute',
            top: `${graphSessionHeight * sessionIndex - 10}px`,

            left: '-33px',
          }}>
          /
        </div>
        <div
          className={classes.sessionLine}
          key="sessionLine"
          style={{
            top: `${graphSessionHeight * sessionIndex}px`,
            width: `${containerWidth + 30}px`,
            left: '-30px',
          }}></div>
      </>
    )
    return result
  }

export const DailySessionPlot: React.FunctionComponent<SingleSessionPlotProps> =
  ({
    schedulingItems,
    sessionGuid,
    zoomLevel,
    sessionIndex,
    scheduleLength,
    graphSessionHeight = 50,
  }) => {
    const classes = useStyles()
    const singleSessionDayX = getSingleSessionDayX(
      sessionGuid,
      schedulingItems,
      scheduleLength!
    )
    const sessionGraph = singleSessionDayX.map((i, index) => (
      <div
        className={classes.dailyIntervalLine}
        key={`interval${index}`}
        style={{
          width: `${i.expire * unitPixelWidth[zoomLevel]}px`,
          top: `${graphSessionHeight * sessionIndex}px`,
          left: `${(i.day + i.startTime) * unitPixelWidth[zoomLevel]}px`,
        }}>
        <div className={classes.dailyIntervalInner}>
          <SessionIcon
            index={sessionIndex}
            style={{
              width: '20px',
              display: 'block',
              margin: '-5px auto 0 auto',
              //marginTop: '-5px',
              //  position: 'absolute',
              // zIndex: 100,
              // top: `${graphSessionHeight * sessionIndex - 5}px`,

              //left: `${i * unitPixelWidth[zoomLevel] - 10}px`,
            }}></SessionIcon>
        </div>
      </div>
    ))

    return <>{sessionGraph}</>
    //return <>nothing</>
  }

export default NonDailySessionPlot
