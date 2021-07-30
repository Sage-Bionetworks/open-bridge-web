import {makeStyles} from '@material-ui/core/styles'
import moment from 'moment'
import React from 'react'
import {StudySession} from '../../../../types/scheduling'
import GridPlot, {DailyGridPlot} from './GridPlot'
import NonDailySessionPlot, {
  DailySessionPlot,
  SessionLine,
} from './SingleSessionPlot'
import {TimelineScheduleItem, TimelineZoomLevel, unitPixelWidth} from './types'

const leftPad = 54
const containerTopPad = 35
const graphSessionHeight = 50

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
    marginTop: `-${containerTopPad}px`,
    marginLeft: `-${leftPad}px`,
    backgroundColor: '#FFF',
  },
}))

export interface TimelineCustomPlotProps {
  schedulingItems: TimelineScheduleItem[]
  scheduleLength: number
  sortedSessions: StudySession[]
  zoomLevel: TimelineZoomLevel
}

export function getTimesForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[]
): number[] {
  return schedulingItems
    .filter(i => i.refGuid === sessionGuid)
    .map(i => i.startDay)
}

function getContainerWidth(lengthInDays: number, zoomLevel: TimelineZoomLevel) {
  return unitPixelWidth[zoomLevel] * lengthInDays
}

const TimelineCustomPlot: React.FunctionComponent<TimelineCustomPlotProps> = ({
  schedulingItems,
  scheduleLength,
  sortedSessions,
  zoomLevel,
}: TimelineCustomPlotProps) => {
  const classes = useStyles()

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
            width: `${
              getContainerWidth(scheduleLength, zoomLevel) + leftPad
            }px`,
          }}>
          <div
            className={classes.whiteBg}
            style={{
              width: `${
                getContainerWidth(scheduleLength, zoomLevel) + leftPad
              }px`,
            }}></div>
          <div
            style={{
              height: `${sortedSessions.length * graphSessionHeight}px`,
              position: 'relative',
            }}>
            {[...Array(scheduleLength)].map((i, index) =>
              zoomLevel === 'Daily' ? (
                <DailyGridPlot
                  graphSessionHeight={graphSessionHeight}
                  index={index}
                  zoomLevel={zoomLevel}
                  numberSessions={sortedSessions.length}
                  key={`${i}_${index}`}
                />
              ) : (
                <GridPlot
                  graphSessionHeight={graphSessionHeight}
                  index={index}
                  zoomLevel={zoomLevel}
                  numberSessions={sortedSessions.length}
                  key={`${i}_${index}`}
                />
              )
            )}
            <div style={{position: 'absolute', top: '30px'}}>
              {sortedSessions.map((session, sIndex) => (
                <div key={sIndex}>
                  <SessionLine
                    sessionIndex={sIndex}
                    scheduleLength={scheduleLength}
                    zoomLevel={zoomLevel}
                    containerWidth={getContainerWidth(
                      scheduleLength,
                      zoomLevel
                    )}
                  />

                  {zoomLevel === 'Daily' ? (
                    <DailySessionPlot
                      sessionIndex={sIndex}
                      zoomLevel={zoomLevel}
                      schedulingItems={schedulingItems}
                      sessionGuid={session.guid!}
                      scheduleLength={scheduleLength}
                    />
                  ) : (
                    <NonDailySessionPlot
                      sessionIndex={sIndex}
                      zoomLevel={zoomLevel}
                      schedulingItems={schedulingItems}
                      sessionGuid={session.guid!}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelineCustomPlot
