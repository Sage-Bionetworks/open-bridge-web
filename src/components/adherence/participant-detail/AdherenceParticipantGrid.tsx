import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {makeStyles, Tooltip} from '@material-ui/core'
import EventService from '@services/event.service'
import {
  AdherenceByDayEntries,
  AdherenceEventStream,
  AdherenceWindowState,
  EventStreamAdherenceReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import AdherenceSessionIcon, {SHAPE_CLASSES} from './AdherenceSessionIcon'

const useStyles = makeStyles(theme => ({
  adherenceGrid: {
    padding: theme.spacing(2, 0),
  },
  adherenceLabel: {
    position: 'absolute',

    top: '-16px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  daysList: {
    paddingLeft: '20px',
    marginBottom: theme.spacing(0.5),
  },
  startEventId: {
    width: '128px',
    fontSize: '12px',
    padding: theme.spacing(0, 2, 0, 1),
    '& strong': {
      display: 'block',
      cursor: 'pointer',
      width: 'fit-content',
    },
  },

  eventRow: {
    display: 'block',
    marginBottom: '8px',
    backgroundColor: '#fff',
    padding: '10px 0',
  },
  dayCell: {
    padding: '0 8px',
    borderRight: '1px solid black',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    '&:first-child': {
      borderLeft: '1px solid black',
    },
  },

  eventRowForWeek: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&:not(:last-child)': {
      marginBottom: '5px',
    },
  },
  sessionLegendIcon: {
    display: 'flex',
    position: 'relative',
    left: '-15px',
  },
  eventRowForWeekSessions: {
    // border: '1px solid blue',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  eventRowForWeekSingleSession: {
    display: 'flex',
    position: 'relative',
    left: '-15px',
  },

  sessionWindows: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    height: '20px',
  },
}))

function getMaxNumberOfTimeWindows(
  adherenceReport: EventStreamAdherenceReport
): number {
  const maxNumberOfWindowsInStreams = adherenceReport.streams.map(stream => {
    const dayEntires = _.flatten(Object.values(stream.byDayEntries))
    const maxWindowsInStream = Math.max(
      ...dayEntires.map(entry => entry.timeWindows.length)
    )
    return maxWindowsInStream
  })
  console.log('max', Math.max(...maxNumberOfWindowsInStreams))
  return Math.max(...maxNumberOfWindowsInStreams)
}

type AdherenceParticipantGridProps = {
  adherenceReport: EventStreamAdherenceReport
}

const DayDisplayForSessions: FunctionComponent<{
  dayWidthInPx: number

  sequentialDayNumber: number
  byDayEntries: AdherenceByDayEntries
  maxNumberOfTimeWindows: number
  sessionGuid: string
  isCompliant: boolean
}> = ({
  byDayEntries,
  sessionGuid,
  maxNumberOfTimeWindows,
  sequentialDayNumber,
  isCompliant,
}) => {
  //const dayNumber = wkIndex * 7 + dayIndex
  if (!byDayEntries[sequentialDayNumber]) {
    return <></>
  }

  return (
    <>
      {byDayEntries[sequentialDayNumber].map(
        entry =>
          entry.sessionGuid === sessionGuid && (
            <>
              {entry.timeWindows.map((tw, itw) => (
                <TimeWindowPlotElement
                  maxNumberOfWindows={maxNumberOfTimeWindows}
                  windowIndex={itw}
                  startDate={entry.startDate}
                  windowState={tw.state}
                  sessionSymbol={entry.sessionSymbol}
                  isCompliant={isCompliant}
                />
              ))}
            </>
          )
      )}
    </>
  )
}

function getSessionInfoFromStreamGuid(
  byDayEntries: AdherenceByDayEntries,
  guid: string
): SessionDisplayInfo | undefined {
  var eventStreamsArray = Object.values(byDayEntries)
  for (var eventSteamArray of eventStreamsArray) {
    var eventStream = eventSteamArray.find(es => es.sessionGuid === guid)
    if (eventStream) {
      return {
        sessionName: eventStream.sessionName,
        sessionGuid: eventStream.sessionGuid,
        sessionSymbol: eventStream.sessionSymbol,
      }
    }
  }
}

const SessionSymbolFromStream: FunctionComponent<{
  byDayEntries: AdherenceByDayEntries
  sessionGuid: string
}> = ({byDayEntries, sessionGuid}) => {
  const sessionInfo = getSessionInfoFromStreamGuid(byDayEntries, sessionGuid)
  return sessionInfo ? (
    <AdherenceSessionIcon
      sessionSymbol={sessionInfo.sessionSymbol}
      windowState="completed">
      &nbsp;
    </AdherenceSessionIcon>
  ) : (
    <></>
  )
}

const TimeWindowPlotElement: FunctionComponent<{
  windowIndex: number

  sessionSymbol: string
  windowState: AdherenceWindowState
  startDate: string
  maxNumberOfWindows: number
  isCompliant: boolean
}> = ({
  startDate,
  windowIndex,
  sessionSymbol,
  windowState,
  maxNumberOfWindows,
  isCompliant,
}) => {
  return (
    <Tooltip title={startDate}>
      <div
        id={'window_' + windowIndex}
        style={{
          width: `${Math.floor(100 / maxNumberOfWindows)}%`,
        }}>
        <AdherenceSessionIcon
          sessionSymbol={sessionSymbol}
          windowState={windowState}
          isRed={!isCompliant}
        />
      </div>
    </Tooltip>
  )
}

//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/AdherenceUtils.java
//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/SessionCompletionState.java

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  ({adherenceReport}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 200)

    const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)
    // const [adherenceByWeek, setAdherenceByWeek]= React.useState<{weeks: number, adherence: number}>([])
    const classes = useStyles()

    // const weeks = Math.ceil(adherenceReport.dayRangeOfAllStreams.max / 7)

    const getWeeksForStream = (stream: AdherenceEventStream): number => {
      /* this is another way to implement this. Not sure which one is better 
     const maxDay = Math.max(
        ...Object.keys(stream.byDayEntries).map(key => parseInt(key) + 1)
        const result = Math.ceil(maxDay / 7)
      )*/
      const weeks = _.flatten(Object.values(stream.byDayEntries)).map(
        eventStreamDay => eventStreamDay.week
      )
      return Math.max(...weeks) + 1
    }
    React.useEffect(() => {
      if (adherenceReport) {
        console.log('ar')
        setMaxNumberOfTimeWinsows(getMaxNumberOfTimeWindows(adherenceReport))
        const weeksArray = adherenceReport.streams.map(s =>
          getWeeksForStream(s)
        )
      }
    }, [adherenceReport])

    function getAdherenceForWeek(
      wkIndex: number,
      entries: AdherenceByDayEntries
    ) {
      const relevantWeek = _.flatten(Object.values(entries)).filter(
        eventStreamDay => eventStreamDay.week === wkIndex
      )
      const allTimewindows = _.flatten(relevantWeek.map(r => r.timeWindows))
      const complianceStates = allTimewindows.map(
        w => SHAPE_CLASSES[w.state].complianceState
      )
      //const countInCompliance = complianceStates.filter(state => state !== undefined)

      const compliantSessions = complianceStates.filter(
        state => state === 'COMPLIANT'
      ).length
      const noncompliantSessions = complianceStates.filter(
        state => state === 'NONCOMPLIANT'
      ).length
      const unkSessions = complianceStates.filter(
        state => state === 'UNKNOWN'
      ).length

      const totalSessions =
        compliantSessions + noncompliantSessions + unkSessions

      let percentage = 1
      if (totalSessions > 0) {
        percentage = compliantSessions / totalSessions
      }
      return Math.round(percentage * 100)
    }

    const getSequentialDayNumber = (wkIndex: number, dayIndex: number) =>
      wkIndex * 7 + dayIndex

    return (
      <div ref={ref} className={classes.adherenceGrid}>
        <div className={classes.daysList}>
          <PlotDaysDisplay
            title="Schedule by week day"
            unitWidth={dayWidthInPx}
            endLabel={
              <div
                className={classes.adherenceLabel}
                style={{
                  width: `${dayWidthInPx}px`,
                  left: `${dayWidthInPx * 7 - 10}px`,
                }}>
                Adherence
                <br />%
              </div>
            }
          />
        </div>
        {adherenceReport.streams.map((stream, streamIndex) => (
          <div className={classes.eventRow} id={'event' + stream.startEventId}>
            {[...new Array(getWeeksForStream(stream))].map((_i2, wkIndex) => (
              <div className={classes.eventRowForWeek}>
                <div className={classes.startEventId}>
                  {wkIndex === 0 && (
                    <Tooltip
                      placement="right-start"
                      title={new Date(
                        stream.eventTimestamp
                      ).toLocaleDateString()}>
                      <strong>
                        {EventService.formatEventIdForDisplay(
                          stream.startEventId
                        )}{' '}
                      </strong>
                    </Tooltip>
                  )}
                  Week {wkIndex + 1}
                </div>
                <div
                  id={'eventRowForWeek' + wkIndex}
                  className={classes.eventRowForWeekSessions}>
                  <div id="guids">
                    {stream.sessionGuids.map(guid => (
                      <div
                        className={classes.eventRowForWeekSingleSession}
                        id={'session' + guid}>
                        <div className={classes.sessionLegendIcon}>
                          <SessionSymbolFromStream
                            sessionGuid={guid}
                            byDayEntries={stream.byDayEntries}
                          />
                        </div>
                        <div
                          id={'wk' + wkIndex + 'events'}
                          className={classes.sessionWindows}>
                          {[...new Array(7)].map((i, dayIndex) => (
                            <div
                              className={classes.dayCell}
                              style={{width: `${dayWidthInPx}px`}}>
                              <DayDisplayForSessions
                                isCompliant={
                                  getAdherenceForWeek(
                                    wkIndex,
                                    stream.byDayEntries
                                  ) > 50
                                }
                                dayWidthInPx={dayWidthInPx}
                                maxNumberOfTimeWindows={maxNumbrOfTimeWindows}
                                sequentialDayNumber={getSequentialDayNumber(
                                  wkIndex,
                                  dayIndex
                                )}
                                sessionGuid={guid}
                                byDayEntries={stream.byDayEntries}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    {getAdherenceForWeek(wkIndex, stream.byDayEntries)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

export default AdherenceParticipantGrid
