import {makeStyles} from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import SessionIcon from '../../../widgets/SessionIcon'
import {TimelineScheduleItem, TimelineZoomLevel} from './types'

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

/*export function getSingleSessionX(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
  interval?: {start: number; end: number}
): number[] {
  let result: number[] = []

  const grouppedStartDays = _.groupBy(
    getTimesForSession(studySessionGuid, schedulingItems),
    Math.floor
  )
  const startDays = interval
    ? _.pickBy(grouppedStartDays, function (value, key) {
        return Number(key) >= interval.start && Number(key) < interval.end
      })
    : grouppedStartDays

  Object.values(startDays).forEach(groupArray => {
    const fraction = 1 / groupArray.length
    groupArray.forEach((item, index) => {
      result.push(item + fraction * index)
    })
  })

  return result
}*/

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
  // schedulingItems,
  // sessionGuid,
  sessionIndex,
  displayIndex,
  graphSessionHeight,
  unitPixelWidth,
  xCoords,
}) => {
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
  return <>{sessionGraph}</>
}

export const SessionLine: React.FunctionComponent<SingleSessionLinePlotProps> =
  ({
    sessionIndex,
    zoomLevel,
    graphSessionHeight,
    containerWidth,
    hasSessionLines = true,
  }) => {
    const classes = useStyles()
    if (zoomLevel === 'Daily' || !hasSessionLines) {
      return <></>
    }

    const result = (
      <>
        <div
          key="slash"
          style={{
            position: 'absolute',
            top: `${graphSessionHeight * sessionIndex - 5}px`,

            left: '-33px',
          }}>
          /
        </div>
        <div
          className={classes.sessionLine}
          key="sessionLine"
          style={{
            top: `${graphSessionHeight * sessionIndex + 5}px`,
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
    displayIndex,
    unitPixelWidth,
    graphSessionHeight,
    xCoords,
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
          width: `${i.expire * unitPixelWidth}px`,
          top: `${graphSessionHeight * displayIndex}px`,
          left: `${(i.day + i.startTime) * unitPixelWidth}px`,
        }}>
        <div className={classes.dailyIntervalInner}>
          <SessionIcon
            index={sessionIndex}
            style={{
              // width: '20px',
              display: 'block',
              margin: '-5px auto 0 auto',
            }}></SessionIcon>
        </div>
      </div>
    ))

    return <>{sessionGraph}</>
    //return <>nothing</>
  }

export const SessionPlot: React.FunctionComponent<
  SingleSessionPlotProps & SingleSessionLinePlotProps
> = ({
  schedulingItems,
  sessionGuid,
  zoomLevel,
  sessionIndex,
  displayIndex,
  containerWidth,
  scheduleLength,
  graphSessionHeight,
  unitPixelWidth,
  hasSessionLines = true,
  xCoords,
}) => {
  const sPlot =
    zoomLevel === 'Daily' ? (
      <DailySessionPlot
        sessionIndex={sessionIndex}
        displayIndex={displayIndex}
        xCoords={xCoords}
        zoomLevel={zoomLevel}
        schedulingItems={schedulingItems}
        sessionGuid={sessionGuid}
        graphSessionHeight={graphSessionHeight}
        unitPixelWidth={unitPixelWidth}
        scheduleLength={scheduleLength}
      />
    ) : (
      <NonDailySessionPlot
        sessionIndex={sessionIndex}
        displayIndex={displayIndex}
        zoomLevel={zoomLevel}
        xCoords={xCoords}
        schedulingItems={schedulingItems}
        graphSessionHeight={graphSessionHeight}
        sessionGuid={sessionGuid}
        unitPixelWidth={unitPixelWidth}
      />
    )

  return (
    <div>
      {hasSessionLines && (
        <SessionLine
          sessionIndex={displayIndex}
          scheduleLength={scheduleLength}
          graphSessionHeight={graphSessionHeight}
          zoomLevel={zoomLevel}
          containerWidth={containerWidth}
          unitPixelWidth={unitPixelWidth}
        />
      )}
      {sPlot}
    </div>
  )
}

export default SessionPlot
