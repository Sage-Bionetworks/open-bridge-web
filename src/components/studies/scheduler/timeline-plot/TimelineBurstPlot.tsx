import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {StudySession} from '../../../../types/scheduling'
import GridPlot, {DailyGridPlot} from './GridPlot'
import NonDailySessionPlot, {
  DailySessionPlot,
  SessionLine,
} from './SingleSessionPlot'
import {TimelineScheduleItem, TimelineZoomLevel} from './types'
import Utility from './utility'

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

export interface TimelineBurstPlotProps {
  schedulingItems: TimelineScheduleItem[]
  scheduleLength: number
  sortedSessions: StudySession[]
  zoomLevel: TimelineZoomLevel
  burstSessionGuids: string[]
  burstNumber: number
  burstFrequency: number
}

export function getTimesForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[]
): number[] {
  return schedulingItems
    .filter(i => i.refGuid === sessionGuid)
    .map(i => i.startDay)
}

const TimelineBurstPlot: React.FunctionComponent<TimelineBurstPlotProps> = ({
  schedulingItems,
  scheduleLength,
  sortedSessions,
  zoomLevel,
  burstNumber,
  burstFrequency,
  burstSessionGuids,
}: TimelineBurstPlotProps) => {
  const classes = useStyles()

  return (
    <>
      <div className={classes.root}>
        <div
          className={classes.plotContainer}
          style={{
            width: `${
              Utility.getContainerWidth(scheduleLength, zoomLevel) + leftPad
            }px`,
          }}>
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
                    containerWidth={Utility.getContainerWidth(
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

export default TimelineBurstPlot
