import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {StudySession} from '../../../../types/scheduling'
import {SingleSessionGridPlot} from './GridPlot'
import {SessionPlot} from './SingleSessionPlot'
import {TimelineScheduleItem, TimelineZoomLevel} from './types'
import Utility from './utility'

const leftPad = 124
const containerTopPad = 35
const graphSessionHeight = 30

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'scroll',
    width: '100%',

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
    // backgroundColor: '#ECECEC',
    padding: `${containerTopPad}px 0 20px ${leftPad}px`,
    // position: 'relative',
  },
  sessionName: {
    // backgroundColor: 'blue',
    position: 'relative',
    top: '-12px',
    fontSize: '12px',
    backgroundColor: '#FFF509',
    padding: '5px',
    width: `${leftPad}px`,
    display: 'block',
    lineHeight: `${graphSessionHeight}px`,
    height: `${graphSessionHeight}px`,
    marginLeft: `${-leftPad}px`,
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
  const [burstSessions, setBurstSessions] = React.useState<StudySession[]>([])
  const [nonBurstSessions, setNonBurstSessions] = React.useState<
    StudySession[]
  >([])
  React.useEffect(() => {
    setNonBurstSessions(
      sortedSessions.filter(s => !burstSessionGuids.includes(s.guid!))
    )
    setBurstSessions(
      sortedSessions.filter(s => burstSessionGuids.includes(s.guid!))
    )
  }, [burstSessionGuids])

  return (
    <>
      <div
        className={classes.root}
        style={{
          height: `${burstSessions.length * graphSessionHeight + 100}px`,
        }}>
        <div
          className={classes.plotContainer}
          style={{
            width: `${
              Utility.getContainerWidth(scheduleLength, zoomLevel) + leftPad
            }px`,
          }}>
          <div
            style={{
              height: `${
                (burstSessions.length + nonBurstSessions.length) *
                  graphSessionHeight +
                20
              }px`,
              position: 'relative',

              width: '100%',
            }}>
            {/*[...Array(scheduleLength)].map((i, index) => (
              <SingleSessionGridPlot
                graphSessionHeight={burstSessions.length * graphSessionHeight}
                index={index}
                hideDays={false}
                zoomLevel={zoomLevel}
                numberSessions={1}
                key={`${i}_${index}`}
              />
            ))*/}
            <div
              style={{
                position: 'relative',
                top: '13px',

                width: '100%',
                height: `${burstSessions.length * graphSessionHeight}px`,
              }}>
              {burstSessions.map((session, sIndex) => (
                <div
                  key={sortedSessions.findIndex(s => s.guid === session.guid)}>
                  <div
                    style={{
                      position: 'absolute',
                      top: `${sIndex == 0 ? -10 : sIndex * 30}px`,
                      backgroundColor: '#FFF509',
                      width: '100%',
                      height: `${graphSessionHeight}px`,
                    }}>
                    {[...Array(scheduleLength)].map((i, index) => (
                      <SingleSessionGridPlot
                        graphSessionHeight={graphSessionHeight - 15}
                        index={index}
                        hideDays={sIndex > 0}
                        zoomLevel={zoomLevel}
                        numberSessions={1}
                        key={`${i}_${index}`}
                      />
                    ))}
                  </div>
                  <span className={classes.sessionName}>{session.name}</span>
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
                    graphSessionHeight={graphSessionHeight}
                    containerWidth={Utility.getContainerWidth(
                      scheduleLength,
                      zoomLevel
                    )}
                  />
                </div>
              ))}
            </div>

            <div
              style={{
                position: 'relative',
                top: '13px',
                backgroundColor: 'red',
                width: '100%',
                height: `${nonBurstSessions.length * graphSessionHeight}px`,
              }}>
              {nonBurstSessions.map((session, sIndex) => (
                <div
                  key={sortedSessions.findIndex(s => s.guid === session.guid)}>
                  {[...Array(scheduleLength)].map((i, index) => (
                    <SingleSessionGridPlot
                      graphSessionHeight={graphSessionHeight - 15}
                      index={index}
                      hideDays={true}
                      zoomLevel={zoomLevel}
                      numberSessions={1}
                      key={`${i}_${index}`}
                      top={sIndex == 0 ? -10 : sIndex * 30}
                    />
                  ))}
                  <span className={classes.sessionName}>{session.name}</span>
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
                    graphSessionHeight={graphSessionHeight}
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
