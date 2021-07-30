import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {StudySession} from '../../../../types/scheduling'
import {SingleSessionGridPlot} from './GridPlot'
import {SessionPlot} from './SingleSessionPlot'
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
              height: `${/*graphSessionHeight*/ 25}px`,
              position: 'relative',
            }}>
            {[...Array(scheduleLength)].map((i, index) => (
              <SingleSessionGridPlot
                graphSessionHeight={graphSessionHeight}
                index={index}
                hideDays={false}
                zoomLevel={zoomLevel}
                numberSessions={1}
                key={`${i}_${index}`}
              />
            ))}
            <div style={{position: 'absolute', top: '0px'}}>
              {[sortedSessions[1]].map((session, sIndex) => (
                <div
                  key={sortedSessions.findIndex(s => s.guid === session.guid)}>
                  <SessionPlot
                    sessionIndex={sortedSessions.findIndex(
                      s => s.guid === session.guid
                    )}
                    hasSessionLines={false}
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

export default TimelineBurstPlot
