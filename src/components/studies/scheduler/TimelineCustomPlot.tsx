import { makeStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import { StudySession } from '../../../types/scheduling'
import SessionIcon from '../../widgets/SessionIcon'

const leftPad = 54
const containerTopPad = 35

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'scroll',
    width: '100%',
    position: 'relative',
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
  plotContainer: {
    backgroundColor: '#ECECEC',
    padding: `${containerTopPad}px 0 20px ${leftPad}px`,
  },
  whiteBg: {
    height: `${containerTopPad}px`,
    //position: 'relative',
    marginTop: `-${containerTopPad}px`,
    marginLeft: `-${leftPad}px`,
    backgroundColor: '#FFF',
  },
  gridUnit: {
    position: 'absolute',
    top: '-24px',
    left: `-${leftPad}px`,
    zIndex: 1000,
  },
  gridLine: {
    position: 'absolute',
    top: '0px',
    borderLeft: '1px solid #D6D6D6',
  },
  tickNumberDisplay: {
    marginTop: '-20px',
    fontSize: '10px',
    textAlign: 'center',
    position: 'absolute',
  },
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
    //backgroundColor: '#000',
  },
  dailyIntervalInner: {
    backgroundColor: '#000',
    height: '1px',
    textAlign: 'center'
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
/*interface CatInfo {
  numb: number;

}*/

export type TimelineZoomLevel = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'

const graphSessionHeight = 50

const unitPixelWidth: Record<TimelineZoomLevel, number> = {
  Daily: 1020,
  Monthly: 35,
  Weekly: 162,
  Quarterly: 11,
}

export interface TimelineCustomPlotProps {
  schedulingItems: TimelineScheduleItem[]
  scheduleLength: number
  sortedSessions: StudySession[]
  zoomLevel: TimelineZoomLevel
}

export interface GridPlotProps {
  numberSessions: number
  zoomLevel: TimelineZoomLevel
  index: number
}

export interface SingleSessionPlotProps {
  sessionIndex: number
  zoomLevel: TimelineZoomLevel
  sessionGuid: string
  schedulingItems: TimelineScheduleItem[]
}

export interface SingleSessionLinePlotProps {
  sessionIndex: number
  zoomLevel: TimelineZoomLevel
  nonDailyData: any
  dailyData: any
}

function getTimesForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
): number[] {
  return schedulingItems
    .filter(i => i.refGuid === sessionGuid)
    .map(i => i.startDay)
}

function getSingleSessionX(
  studySessionGuid: string,

  schedulingItems: TimelineScheduleItem[],
): number[] {
  let result: number[] = []

  const grouppedStartDays = _.groupBy(
    getTimesForSession(studySessionGuid, schedulingItems),
    Math.floor,
  )
  Object.values(grouppedStartDays).forEach(groupArray => {
    const fraction = 1 / groupArray.length
    groupArray.forEach((item, index) => {
      result.push(item + fraction * index)
    })
  })

  return result
}

function getSingleSessionDayX(
  studySessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
): { day: number; startTime: number; expire: number }[] {
  let result: number[] = []

  const times = schedulingItems
    .filter(i => i.refGuid === studySessionGuid)
    .map(i => {
      const startTimeAsTime = moment(i.startTime, ['h:m a', 'H:m'])
      var stHrAsMin = startTimeAsTime.get('hours') * 60
      var stMin = startTimeAsTime.get('minutes')
      var fractionOfDay = (stHrAsMin + stMin) / (24 * 60)

      const period = i.expiration[i.expiration.length - 1] as
        | 'D'
        | 'M'
        | 'H'
        | 'W'
      const exp = ['M', 'H'].includes(period)
        ? i.expiration.substr(2)
        : i.expiration.substr(1)
      const num = exp.substring(0, exp.length - 1)
      const lookup = {
        M: 1440,
        H: 24,
        D: 1,
        W: 1 / 7,
      }

      const expire = (parseInt(num) * 1) / lookup[period]

      return { day: i.startDay, startTime: fractionOfDay, expire: expire }
    })

  return times
}

function getWidth(lengthInDays: number, zoomLevel: TimelineZoomLevel) {
  return unitPixelWidth[zoomLevel] * lengthInDays
}

const DailyGridPlot: React.FunctionComponent<GridPlotProps> = ({
  numberSessions,
  zoomLevel,
  index,
}) => {
  const classes = useStyles()
  const getHour = (hour: number): string => {
    if (hour === 0) {
      return '12am'
    }
    if (hour === 12) {
      return '12pm'
    }
    if (hour > 12) {
      return (hour % 12) + 'pm'
    }
    return hour + ''
  }

  const hours = [...Array(24)].map((i, index2) => (
    <>
      {index2 === 0 && (
        <div
          style={{
            position: 'absolute',
            top: `${-containerTopPad}px`,
            left: `${
              index * unitPixelWidth[zoomLevel] +
              (unitPixelWidth[zoomLevel] / 24) * index2
            }px`,
          }}
        >
          {index + 1}
        </div>
      )}
      <div
        className={classes.gridLine}
        style={{
          height: `${numberSessions * graphSessionHeight}px`,
          left: `${
            index * unitPixelWidth[zoomLevel] +
            (unitPixelWidth[zoomLevel] / 24) * index2
          }px`,

          width: `${unitPixelWidth[zoomLevel] / 24}px`,
        }}
      >
        <div
          className={classes.tickNumberDisplay}
          style={{
            left: `${unitPixelWidth[zoomLevel] / -48}px`,
            width: `${unitPixelWidth[zoomLevel] / 24}px`,
          }}
        >
          {getHour(index2)}
        </div>
      </div>
    </>
  ))
  return <div>{hours}</div>
}

const NonDailySessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  schedulingItems,
  sessionGuid,
  zoomLevel,
  sessionIndex,
}) => {
  const sessionGraph = getSingleSessionX(sessionGuid, schedulingItems).map(
    i => (
      <SessionIcon
        index={sessionIndex}
        style={{
          width: '20px',
          position: 'absolute',
          zIndex: 100,
          top: `${graphSessionHeight * sessionIndex - 5}px`,

          left: `${i * unitPixelWidth[zoomLevel] - 10}px`,
        }}
      ></SessionIcon>
    ),
  )
  return <>{sessionGraph}</>
}

const SessionLine: React.FunctionComponent<SingleSessionLinePlotProps> = ({
  sessionIndex,
  zoomLevel,
  nonDailyData,
  dailyData,
}) => {
  const classes = useStyles()
if (zoomLevel === 'Daily' ) {
  return <></>
}
//@ts-ignore
  const data = zoomLevel === 'Daily' ? dailyData : nonDailyData
  const width =
    data[sessionIndex][data[sessionIndex].length - 1] *
      unitPixelWidth[zoomLevel] -
    data[sessionIndex][0] * unitPixelWidth[zoomLevel]

  const result = (
    <div
      className={classes.sessionLine}
      style={{
        top: `${graphSessionHeight * sessionIndex}px`,
        width: `${width}px`,
        left: `${data[sessionIndex][0] * unitPixelWidth[zoomLevel]}px`,
      }}
    ></div>
  )
  return result
}

const DailySessionPlot: React.FunctionComponent<SingleSessionPlotProps> = ({
  schedulingItems,
  sessionGuid,
  zoomLevel,
  sessionIndex,
}) => {
  const classes = useStyles()
  const sessionGraph = getSingleSessionDayX(sessionGuid, schedulingItems).map(
    i => (
      <div
        className={classes.dailyIntervalLine}
        style={{
          width: `${i.expire * unitPixelWidth[zoomLevel]}px`,
          top: `${graphSessionHeight * sessionIndex }px`,
          left: `${(i.day + i.startTime) * unitPixelWidth[zoomLevel]}px`,
        }}
      >
        <div className={classes.dailyIntervalInner}>

        <SessionIcon
        index={sessionIndex}
        style={{
          width: '20px',
          display: 'block',
          margin: '-5px auto 0 auto'
          //marginTop: '-5px',
        //  position: 'absolute',
         // zIndex: 100,
         // top: `${graphSessionHeight * sessionIndex - 5}px`,

          //left: `${i * unitPixelWidth[zoomLevel] - 10}px`,
        }}
      ></SessionIcon>
        </div>
      </div>
    ),
  )

  return <>{sessionGraph}</>
}

const GridPlot: React.FunctionComponent<GridPlotProps> = ({
  numberSessions,
  zoomLevel,
  index,
}) => {
  const classes = useStyles()
  const unit = zoomLevel === 'Quarterly' ? 'Month' : 'Day'
  if (zoomLevel === 'Quarterly' && index % 30 > 0) {
    return <></>
  }
  const result = (
    <>
      {index === 0 && <div className={classes.gridUnit}>{unit}</div>}
      <div
        className={classes.gridLine}
        style={{
          height: `${numberSessions * graphSessionHeight}px`,
          left: `${index * unitPixelWidth[zoomLevel]}px`,
          width: `${unitPixelWidth[zoomLevel]}px`,
          boxSizing: 'content-box',
        }}
      >
        <div
          className={classes.tickNumberDisplay}
          style={{
            left: `${unitPixelWidth[zoomLevel] / -2}px`,
            width: `${unitPixelWidth[zoomLevel]}px`,
          }}
        >
          {zoomLevel === 'Quarterly' ? Math.round(index / 30) + 1 : index + 1}
        </div>
      </div>
    </>
  )

  return result
}

const TimelineCustomPlot: React.FunctionComponent<TimelineCustomPlotProps> = ({
  schedulingItems,
  scheduleLength,
  sortedSessions,
  zoomLevel,
}: TimelineCustomPlotProps) => {
  const classes = useStyles()

  const nonDailyData = sortedSessions.map((session, index) => {
    const x = getSingleSessionX(session.guid!, schedulingItems)

    return x
  })

  const dataDaily = sortedSessions.map((session, index) => {
    const times = schedulingItems
      .filter(i => i.refGuid === session.guid!)
      .map(i => {
        const startTimeAsTime = moment(i.startTime, ['h:m a', 'H:m'])
        var stHrAsMin = startTimeAsTime.get('hours') * 60
        var stMin = startTimeAsTime.get('minutes')
        var fractionOfDay = (stHrAsMin + stMin) / (24 * 60)
        return i.startDay + fractionOfDay
      })

    return times
  })

  return (
    <>
      <div className={classes.root}>
        <div
          className={classes.plotContainer}
          style={{
            width: `${getWidth(scheduleLength, zoomLevel) + leftPad}px`,
          }}
        >
          <div
            className={classes.whiteBg}
            style={{
              width: `${getWidth(scheduleLength, zoomLevel) + leftPad}px`,
            }}
          ></div>
          <div
            style={{
              height: `${sortedSessions.length * graphSessionHeight}px`,
              position: 'relative',
            }}
          >
            {[...Array(scheduleLength)].map((i, index) =>
              zoomLevel === 'Daily' ? (
                <DailyGridPlot
                  index={index}
                  zoomLevel={zoomLevel}
                  numberSessions={sortedSessions.length}
                  key={i}
                />
              ) : (
                <GridPlot
                  index={index}
                  zoomLevel={zoomLevel}
                  numberSessions={sortedSessions.length}
                  key={i}
                />
              ),
            )}
            <div style={{ position: 'absolute', top: '30px' }}>
              {sortedSessions.map((session, sIndex) => (
                <>
                  <SessionLine
                    sessionIndex={sIndex}
                    nonDailyData={nonDailyData}
                    dailyData={dataDaily}
                    zoomLevel={zoomLevel}
                  />

                  {zoomLevel === 'Daily' ? (
                    <DailySessionPlot
                      sessionIndex={sIndex}
                      zoomLevel={zoomLevel}
                      schedulingItems={schedulingItems}
                      sessionGuid={session.guid!}
                    />
                  ) : (
                    <NonDailySessionPlot
                      sessionIndex={sIndex}
                      zoomLevel={zoomLevel}
                      schedulingItems={schedulingItems}
                      sessionGuid={session.guid!}
                    />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelineCustomPlot
