import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {StudySession} from '../../../../types/scheduling'
import GridPlot from './GridPlot'
import {SessionPlot} from './SingleSessionPlot'
import {TimelineScheduleItem, TimelineZoomLevel, unitPixelWidth} from './types'
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

export interface TimelineCustomPlotProps {
  schedulingItems: TimelineScheduleItem[]
  scheduleLength: number
  sortedSessions: StudySession[]
  zoomLevel: TimelineZoomLevel
}

const TimelineCustomPlot: React.FunctionComponent<TimelineCustomPlotProps> = ({
  schedulingItems,
  scheduleLength,
  sortedSessions,
  zoomLevel,
}: TimelineCustomPlotProps) => {
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
            className={classes.whiteBg}
            style={{
              width: `${
                Utility.getContainerWidth(scheduleLength, zoomLevel) + leftPad
              }px`,
            }}></div>
          <div
            style={{
              height: `${sortedSessions.length * graphSessionHeight}px`,
              position: 'relative',
            }}>
            <GridPlot
              graphSessionHeight={graphSessionHeight}
              zoomLevel={zoomLevel}
              unitPixelWidth={unitPixelWidth[zoomLevel]}
              numberSessions={sortedSessions.length}
              scheduleLength={scheduleLength}
            />

            <div style={{position: 'absolute', top: '30px'}}>
              {sortedSessions.map((session, sIndex) => (
                <div key={sIndex}>
                  <SessionPlot
                    sessionIndex={sIndex}
                    graphSessionHeight={graphSessionHeight}
                    unitPixelWidth={unitPixelWidth[zoomLevel]}
                    displayIndex={sIndex}
                    scheduleLength={scheduleLength}
                    zoomLevel={zoomLevel}
                    schedulingItems={schedulingItems}
                    sessionGuid={session.guid!}
                    containerWidth={Utility.getContainerWidth(
                      scheduleLength,
                      zoomLevel
                    )}
                  />
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
