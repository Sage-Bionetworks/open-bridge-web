import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {makeStyles, Tooltip} from '@material-ui/core'
import AdherenceService from '@services/adherence.service'
import EventService from '@services/event.service'
import {
  AdherenceByDayEntries,
  AdherenceEventStream,
  EventStreamAdherenceReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import DayDisplayForSession from '../DayDisplayForSession'
import {useCommonStyles} from '../styles'
import AdherenceSessionIcon, {SHAPE_CLASSES} from './AdherenceSessionIcon'

const useStyles = makeStyles(theme => ({
  /* adherenceGrid: {
    padding: theme.spacing(2, 0),
  },
  adherenceLabel: {
    position: 'absolute',

    top: '-16px',
    fontSize: '12px',
    fontWeight: 'bold',
    textAlign: 'left',
  },*/
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
  adherenceDisplay: {
    fontSize: '14px',
  },
}))

type AdherenceParticipantGridProps = {
  adherenceReport: EventStreamAdherenceReport
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

function getWeeksForStream(stream: AdherenceEventStream): number {
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

function getAdherenceForWeek(
  wkIndex: number,
  entries: AdherenceByDayEntries
): number | undefined {
  const relevantWeek = _.flatten(Object.values(entries)).filter(
    eventStreamDay => eventStreamDay.week === wkIndex
  )
  const allTimewindows = _.flatten(relevantWeek.map(r => r.timeWindows))
  const complianceStates = allTimewindows.map(
    w => SHAPE_CLASSES[w.state].complianceState
  )

  const compliantSessions = complianceStates.filter(
    state => state === 'COMPLIANT'
  ).length
  const noncompliantSessions = complianceStates.filter(
    state => state === 'NONCOMPLIANT'
  ).length
  const unkSessions = complianceStates.filter(
    state => state === 'UNKNOWN'
  ).length

  const totalSessions = compliantSessions + noncompliantSessions + unkSessions

  if (totalSessions === unkSessions) {
    return undefined
  }

  let percentage = 1
  if (totalSessions > 0) {
    percentage = compliantSessions / totalSessions
  }
  return Math.round(percentage * 100)
}

function getSequentialDayNumber(wkIndex: number, dayIndex: number): number {
  return wkIndex * 7 + dayIndex
}

//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/AdherenceUtils.java
//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/SessionCompletionState.java

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  ({adherenceReport}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 200)
    const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)
    const [adherenceByWeekLookup, setAdherenceByWeekLookup] =
      React.useState<Map<string, Map<number, number | undefined>>>()
    const classes = {...useCommonStyles(), ...useStyles()}

    React.useEffect(() => {
      if (adherenceReport) {
        let weeklyAdherence: Map<
          string,
          Map<number, number | undefined>
        > = new Map()

        for (var stream of adherenceReport.streams) {
          const weeksNumber = getWeeksForStream(stream)
          const streamAdherenceMap: Map<number, number | undefined> = new Map()
          for (var i = 0; i < weeksNumber; i++) {
            streamAdherenceMap.set(
              i,
              getAdherenceForWeek(i, stream.byDayEntries)
            )
          }

          weeklyAdherence.set(stream.startEventId, streamAdherenceMap)
        }
        setAdherenceByWeekLookup(weeklyAdherence)
        setMaxNumberOfTimeWinsows(
          AdherenceUtility.getMaxNumberOfTimeWindows(adherenceReport.streams)
        )
      }
    }, [adherenceReport])

    const getAdherenceForWeekForDisplay = (
      stream: AdherenceEventStream,
      wkIndex: number
    ): {value: number | undefined; isCompliant: boolean} => {
      const lookupValue = adherenceByWeekLookup
        ?.get(stream.startEventId)
        ?.get(wkIndex)

      return lookupValue === undefined
        ? {
            value: undefined,
            isCompliant: true,
          }
        : {
            value: lookupValue,
            isCompliant: lookupValue > AdherenceService.COMPLIANCE_THRESHOLD,
          }
    }

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
          <div
            className={classes.eventRow}
            key={'event' + stream.startEventId + streamIndex}>
            {[...new Array(getWeeksForStream(stream))].map((_i2, wkIndex) => (
              <div
                className={classes.eventRowForWeek}
                key={`${stream.startEventId}_${wkIndex}`}>
                <div className={classes.startEventId}>
                  {wkIndex === 0 && (
                    <Tooltip
                      placement="right-start"
                      title={AdherenceUtility.getDateForDisplay(
                        stream.eventTimestamp
                      )}>
                      <strong>
                        {EventService.formatEventIdForDisplay(
                          stream?.startEventId
                        )}
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
                          <AdherenceSessionIcon
                            sessionSymbol={
                              getSessionInfoFromStreamGuid(
                                stream.byDayEntries,
                                guid
                              )?.sessionSymbol || undefined
                            }
                            windowState="completed">
                            &nbsp;
                          </AdherenceSessionIcon>
                        </div>
                        <div
                          id={'wk' + wkIndex + 'events'}
                          className={classes.sessionWindows}>
                          {[...new Array(7)].map((i, dayIndex) => (
                            <div
                              className={classes.dayCell}
                              style={{width: `${dayWidthInPx}px`}}>
                              <DayDisplayForSession
                                isCompliant={
                                  getAdherenceForWeekForDisplay(stream, wkIndex)
                                    .isCompliant
                                }
                                maxNumberOfTimeWindows={maxNumbrOfTimeWindows}
                                sequentialDayNumber={getSequentialDayNumber(
                                  wkIndex,
                                  dayIndex
                                )}
                                propertyValue={guid}
                                propertyName="sessionGuid"
                                byDayEntries={stream.byDayEntries}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={clsx(
                      classes.adherenceDisplay,
                      !getAdherenceForWeekForDisplay(stream, wkIndex)
                        .isCompliant && classes.red
                    )}>
                    {getAdherenceForWeekForDisplay(stream, wkIndex).value !==
                    undefined
                      ? `${
                          getAdherenceForWeekForDisplay(stream, wkIndex).value
                        }%`
                      : '-'}
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
