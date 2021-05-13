import { makeStyles } from '@material-ui/core/styles'
import _ from 'lodash'
import React from 'react'
import { StudySession } from '../../../types/scheduling'
import SessionIcon from '../../widgets/SessionIcon'

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
/*interface CatInfo {
  numb: number;

}*/

export type TimelineZoomLevel = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly'

const graphSessionHeight = 50

const unitPixelWidth: Record<TimelineZoomLevel, number> = {
  Daily: 1000,
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

function getTimesForSession(
  sessionGuid: string,
  schedulingItems: TimelineScheduleItem[],
): number[] {
  return schedulingItems
    .filter(i => i.refGuid === sessionGuid)
    .map(i => i.startDay /* + 1*/)
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

function getWidth(lengthInDays: number, zoomLevel: TimelineZoomLevel) {
  return unitPixelWidth[zoomLevel] * lengthInDays
}

const GridPlot: React.FunctionComponent<GridPlotProps> = ({
  numberSessions,
  zoomLevel,
  index,
}) => {
  if (zoomLevel === 'Quarterly' && index % 30 > 0) {
    return <></>
  }
  const result = (
    <>
      <div
        style={{
          position: 'absolute',
          top: '0px',
          height: `${numberSessions * graphSessionHeight}px`,
          borderLeft: '1px solid #D6D6D6',
          left: `${index * unitPixelWidth[zoomLevel]}px`,
          width: `${unitPixelWidth[zoomLevel]}px`,
          boxSizing: 'content-box',
        }}
      >
        <div
          style={{
            left: `${unitPixelWidth[zoomLevel] / -2}px`,
            width: `${unitPixelWidth[zoomLevel]}px`,
            marginTop: '-20px',
            fontSize: '10px',
            textAlign: 'center',
            position: 'absolute',
 
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

  const data = sortedSessions.map((session, index) => {
    const x = getSingleSessionX(session.guid!, schedulingItems)

    return x
  })

  return (
    <>
      <div
        style={{ overflowX: 'scroll', width: '100%', position: 'relative' }}
        className={classes.scroll}
      >
        <div
          style={{
            backgroundColor: '#ECECEC',
            padding: '20px 0 20px 40px',
            width: `${getWidth(scheduleLength, zoomLevel) + 20}px`,
          }}
        >
          <div
            style={{
              height: `${sortedSessions.length * graphSessionHeight}px`,
              position: 'relative',
            }}
          >
            <div
              style={{
                height: `20px`,
                position: 'relative',
                top: '-20px',
                left: '-40px',
                backgroundColor: '#FFF',
                width: `${getWidth(scheduleLength, zoomLevel) + 20}px`,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-4px',
                  left: '3px',
                  zIndex: 1000,
                }}
              >
                Day
              </div>
            </div>
            {[...Array(scheduleLength)].map((i, index) => (
              <GridPlot
                index={index}
                zoomLevel={zoomLevel}
                numberSessions={sortedSessions.length}
                key={i}
              />
            ))}
            <div style={{ position: 'absolute', top: '30px' }}>
              {sortedSessions.map((session, sIndex) => (
                <>
                  <div
                    style={{
                      backgroundColor: 'black',
                      height: '1px',
                      position: 'absolute',

                      top: `${graphSessionHeight * sIndex}px`,
                      width: `${
                        data[sIndex][data[sIndex].length - 1] *
                          unitPixelWidth[zoomLevel] -
                        data[sIndex][0] * unitPixelWidth[zoomLevel]
                      }px`,
                      zIndex: 100,
                      left: `${data[sIndex][0] * unitPixelWidth[zoomLevel]}px`,
                    }}
                  ></div>

                  {getSingleSessionX(session.guid!, schedulingItems).map(
                    (i, index) => (
                      <>
                        <SessionIcon
                          index={sIndex}
                          style={{
                            width: '20px',
                            position: 'absolute',
                            top: `${graphSessionHeight * sIndex - 5}px`,

                            zIndex: 100,
                            left: `${i * unitPixelWidth[zoomLevel] - 10}px`,
                          }}
                        ></SessionIcon>
                      </>
                    ),
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
