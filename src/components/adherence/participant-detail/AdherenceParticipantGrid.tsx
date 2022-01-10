import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import SessionIcon, {SessionSymbols} from '@components/widgets/SessionIcon'
import {makeStyles} from '@material-ui/core'
import EventService from '@services/event.service'
import {
  AdherenceByDayEntries,
  AdherenceEventStream,
  AdherenceWindowState,
  EventStreamAdherenceReport,
  SessionDisplayInfo,
} from '@typedefs/types'
import clsx from 'clsx'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'

const useStyles = makeStyles(theme => ({
  adherenceGrid: {
    padding: theme.spacing(2, 0),
  },
  daysList: {
    paddingLeft: '20px',
    marginBottom: theme.spacing(0.5),
  },
  startEventId: {
    width: '128px',
    fontSize: '12px',
    padding: theme.spacing(0, 2, 0, 1),
  },

  eventRow: {
    display: 'block',
    marginBottom: '8px',
    backgroundColor: '#fff',
    padding: '10px 0',
  },
  dayCell: {
    // borderLeft: '1px solid red',
    padding: '0 8px',
    borderRight: '1px solid black',
    display: 'flex',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-start',
    // position: 'relative',
    '&:first-child': {
      borderLeft: '1px solid black',
    },
  },

  eventRowForWeek: {
    // position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '&:not(:last-child)': {
      marginBottom: '5px',
    },
    // margin: '1px 0',
    // border: '1px solid black',
    //  borderBottom: 'none',
    /*  '& > div:nth-child(1)': {
      width: '80px',
      overflowWrap: 'break-word',
    },

    '& > div:nth-child(2)': {
      display: 'flex',
      '& > div:nth-child(1)': {
        width: '30px',
        overflowWrap: 'break-word',
      },
      '& > div:nth-child(2)': {
        position: 'relative',
        backgroundColor: 'blue',
        height: '40px',
        width: '100%',
      },
    },*/
  },
  sessionLegendIcon: {
    display: 'flex',
    position: 'relative',
    left: '-15px',
  },
  eventRowForWeekSessions: {
    // border: '1px solid blue',
    width: '100%',
    '& >div': {
      width: '100%',
      position: 'relative',
      //  border: '1px solid green',
      display: 'flex',
      height: '20px',
    },
  },
  plotNotch: {
    width: '1px',
    height: '100%',
    backgroundColor: 'black',
    position: 'absolute',
    zIndex: 100,
    top: `0`,
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    border: '2px solid black',
  },
  plotElement: {
    width: '10px',
  },
  empty: {
    // backgroundColor: 'red',
    overflow: 'visible',

    '&> path, &> circle, &> rect': {
      stroke: 'red',
      overflow: 'visible',
      fill: 'transparent',
    },
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

const SHAPE_CLASSES: Record<AdherenceWindowState, number> = {
  not_applicable: -1,
  not_yet_available: -1,
  unstarted: -1,
  started: 1,
  completed: 0,
  abandoned: 1,
  expired: 2,

  declined: 2,
}

type AdherenceParticipantGridProps = {
  adherenceReport: EventStreamAdherenceReport
}

const DayDisplayForSessions: FunctionComponent<{
  dayWidthInPx: number
  wkIndex: number
  dayIndex: number
  byDayEntries: AdherenceByDayEntries
  maxNumberOfTimeWindows: number
  sessionGuid: string
}> = ({
  dayWidthInPx,
  wkIndex,
  dayIndex,
  byDayEntries,
  sessionGuid,
  maxNumberOfTimeWindows,
}) => {
  const classes = useStyles()
  const dayNumber = wkIndex * 7 + dayIndex
  if (!byDayEntries[dayNumber]) {
    return <></>
  }

  return (
    <>
      {byDayEntries[dayNumber].map(
        entry =>
          entry.sessionGuid === sessionGuid && (
            <>
              {entry.timeWindows.map((tw, itw) => (
                <TimeWindowPlotElement
                  maxNumberOfWindows={maxNumberOfTimeWindows}
                  windowIndex={itw}
                  dayWidthInPx={dayWidthInPx}
                  windowState={tw.state}
                  sessionSymbol={entry.sessionSymbol}
                  numberOfWindows={entry.timeWindows.length}
                />
              ))}
            </>
          )
      )}
    </>
  )
}
const DayNotchPlotElement: FunctionComponent<{
  dayWidthInPx: number
  index: number
}> = ({dayWidthInPx, index}) => {
  const classes = useStyles()
  return (
    <></>
    /*   <div
      key={`day_${index}_notch`}
      id={index + 'day_notch'}
      className={classes.plotNotch}
      style={{
        left: `${index * dayWidthInPx}px`,
      }}></div>*/
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
    <SessionIcon symbolKey={sessionInfo.sessionSymbol} />
  ) : (
    <></>
  )
}

const TimeWindowPlotElement: FunctionComponent<{
  windowIndex: number
  numberOfWindows: number
  sessionSymbol: string
  windowState: AdherenceWindowState
  dayWidthInPx: number
  maxNumberOfWindows: number
}> = ({
  windowIndex,
  numberOfWindows,
  sessionSymbol,
  dayWidthInPx,
  windowState,
  maxNumberOfWindows,
}) => {
  const classes = useStyles()
  const leftOffset =
    (dayWidthInPx / numberOfWindows) * windowIndex +
    dayWidthInPx / (2 * numberOfWindows) -
    5

  const topOffset = 4 //sessionsInStream.indexOf(sessionGuid) * 20

  //these states will show empty dot
  const isEmptyDot = SHAPE_CLASSES[windowState] === -1

  //0 - filled, 1- partcial, 2 - empty
  const variant = SHAPE_CLASSES[windowState]
  if (variant === undefined) {
    throw Error('unknown state')
  }

  var x = clsx({[classes.empty]: variant === 2, [classes.plotElement]: true})

  const el = isEmptyDot ? (
    <div className={classes.dot} />
  ) : (
    React.cloneElement(
      SessionSymbols.get(sessionSymbol)![variant == 2 ? 0 : variant],
      {className: x}
    )
  )

  return (
    <div
      id={'window_' + windowIndex}
      style={{
        width: `${Math.floor(100 / maxNumberOfWindows)}%`,
        //  position: 'absolute',
        //  top: `${topOffset}px`,
        //  left: `${leftOffset}px`,
      }}>
      {el}
    </div>
  )
}

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  ({adherenceReport}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 200)

    const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)
    const classes = useStyles()

    // const weeks = Math.ceil(adherenceReport.dayRangeOfAllStreams.max / 7)

    const getWeeksForStream = (stream: AdherenceEventStream): number => {
      const maxDay = Math.max(
        ...Object.keys(stream.byDayEntries).map(key => parseInt(key) + 1)
      )
      return Math.ceil(maxDay / 7)
    }
    React.useEffect(() => {
      if (adherenceReport) {
        console.log('ar')
        setMaxNumberOfTimeWinsows(getMaxNumberOfTimeWindows(adherenceReport))
      }
    }, [adherenceReport])

    return (
      <div ref={ref} className={classes.adherenceGrid}>
        <div className={classes.daysList}>
          <PlotDaysDisplay
            title="Schedule by week day"
            unitWidth={dayWidthInPx}
            endLabel={
              <div
                style={{
                  position: 'absolute',
                  width: `${dayWidthInPx}px`,
                  top: '-16px',
                  fontSize: '12px',
                  left: `${dayWidthInPx * 7 - 10}px`,
                  textAlign: 'left',
                }}>
                Adherence
                <br />%
              </div>
            }
          />
        </div>
        {adherenceReport.streams.map((stream, streami) => (
          <div className={classes.eventRow} id={'event' + stream.startEventId}>
            {[...new Array(getWeeksForStream(stream))].map((_i2, wkIndex) => (
              <div
                className={classes.eventRowForWeek}
                id={stream.startEventId + '_' + wkIndex}>
                <div className={classes.startEventId}>
                  {wkIndex === 0 && (
                    <strong>
                      {EventService.formatEventIdForDisplay(
                        stream.startEventId
                      )}{' '}
                      <br />
                    </strong>
                  )}
                  Week {wkIndex + 1}
                </div>
                <div
                  id={'eventRowForWeek' + wkIndex}
                  className={classes.eventRowForWeekSessions}>
                  {stream.sessionGuids.map(guid => (
                    <div
                      id={'session' + guid}
                      style={{position: 'relative', height: '20px'}}>
                      <div className={classes.sessionLegendIcon}>
                        <SessionSymbolFromStream
                          sessionGuid={guid}
                          byDayEntries={stream.byDayEntries}
                        />
                      </div>
                      <div
                        id={'wk' + wkIndex + 'events'}
                        style={{
                          display: 'flex',
                          position: 'relative',
                          left: '-15px',
                        }}>
                        {[...new Array(7)].map((i, dayIndex) => (
                          <div
                            className={classes.dayCell}
                            style={{width: dayWidthInPx + 'px'}}>
                            <DayDisplayForSessions
                              dayWidthInPx={dayWidthInPx}
                              maxNumberOfTimeWindows={maxNumbrOfTimeWindows}
                              wkIndex={wkIndex}
                              dayIndex={dayIndex}
                              sessionGuid={guid}
                              byDayEntries={stream.byDayEntries}
                            />
                          </div>
                        ))}
                        100%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

export default AdherenceParticipantGrid
