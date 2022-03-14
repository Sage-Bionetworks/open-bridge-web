import {ReactComponent as SessionStartIcon} from '@assets/scheduler/calendar_icon.svg'
import {useStudy} from '@components/studies/studyHooks'
import SessionIcon from '@components/widgets/SessionIcon'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import ScheduleService from '@services/schedule.service'
import {latoFont} from '@style/theme'
import {
  ScheduleTimeline,
  SchedulingEvent,
  StudySessionTimeline,
  TimelineScheduleItem,
} from '@typedefs/scheduling'
import _ from 'lodash'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility, {CoordItem} from './utility'

const LayoutConstants = {
  marginGap: 4,
  bracketOverlay: 8,
  weekVPad: 10,
  height: 30,
  singleSessionGraphHeight: 16,
  singleSessionGraphBottomMargin: 0, //5,
  weekMinHeight: 22,
}

const useStyles = makeStyles(theme => ({
  frequencyBracket: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: '-70px',
    '&> div:first-child': {
      width: '14px',
      border: '1px solid black',
      borderLeft: 'none',
    },
    '&> div:not(first-child)': {
      padding: '8px 0 0 8px',
    },
  },
  frequencyText: {
    display: 'block',
    maxWidth: '50px',
    fontFamily: latoFont,
    fontSize: '12px',
    fontStyle: 'normal',
    marginLeft: '-4px',

    lineHeight: '14px',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  plotContainer: {
    paddingRight: theme.spacing(8),
  },

  graph: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: `${LayoutConstants.singleSessionGraphBottomMargin}px`,
    height: `${LayoutConstants.singleSessionGraphHeight}px`,
    '&:last-child': {
      marginBottom: 0,
    },
  },
  sessionName: {
    textAlign: 'center',
    width: '12px',
    '& svg': {
      width: '5px',
      height: '5px',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekTitle: {
    width: '82px',
    lineHeight: '12px',
    fontSize: '12px',
    fontFamily: latoFont,
  },
  dayNumbers: {
    fontFamily: latoFont,
    fontSize: '14px',
    width: '20px',
    textAlign: 'center',
    position: 'absolute',
  },
  defaultMessage: {
    left: `${82 + 16 + 16}px`,
    backgroundColor: '#fff',
    height: '50px',
    position: 'absolute',
    top: theme.spacing(4),
    justifyContent: 'space-around',
    alignItems: 'center',

    right: theme.spacing(1),
    zIndex: 1000,
    fontSize: '14px',
    fontWeight: 'bold',
    fontFamily: latoFont,
    display: 'flex',
  },
}))

export interface TimelineBurstPlotProps {
  timeline: ScheduleTimeline
  studyId: string
  children?: React.ReactNode
}

type PlotData = {
  name: number
  burst: boolean
  burstNum: number
  sessions: {
    sessionIndex: number
    startEventId: string | undefined
    coords: CoordItem[]
    session: StudySessionTimeline
  }[]
}

const FrequencyBracket: React.FunctionComponent<{
  intervalInWeeks: number
  heightInterval: number
}> = ({intervalInWeeks, heightInterval}) => {
  const classes = useStyles()
  if (heightInterval === -1) {
    return <></>
  }
  const bottom = -1 * (heightInterval + LayoutConstants.bracketOverlay)
  const height = heightInterval + LayoutConstants.bracketOverlay * 2
  return (
    <div
      className={classes.frequencyBracket}
      style={{bottom: `${bottom}px`, height: `${height}px`}}>
      <div style={{height: `${height}px`}} />
      <div>
        <SessionStartIcon />
        <span className={classes.frequencyText}>{intervalInWeeks} weeks</span>
      </div>
    </div>
  )
}

export const PlotDaysDisplay: React.FunctionComponent<{
  unitWidth: number
  title: string
  endLabel?: React.ReactNode
  titleStyle?: React.CSSProperties
}> = ({unitWidth, title, endLabel, titleStyle}) => {
  const classes = useStyles()
  const defaultTitleStyle = {
    width: `${99 + unitWidth / 2}px`,
    paddingLeft: '12px',
    fontSize: '12px',
  }
  return (
    <div className={classes.week}>
      <div style={{...defaultTitleStyle, ...titleStyle}}>{title}</div>
      <div className={classes.graph}>
        <div className={classes.sessionName}></div>
        <div
          style={{
            position: 'relative',
            top: '-10px',
            left: `-${unitWidth / 2}px`,
          }}>
          {[...new Array(7)].map((_i, index) => (
            <div
              key={`day_number_${index}`}
              className={classes.dayNumbers}
              style={{
                width: `${unitWidth}px`,
                left: `${unitWidth * index - 10}px`,
              }}>
              {index + 1}
            </div>
          ))}
          {endLabel}
        </div>
      </div>
    </div>
  )
}

export function useGetPlotAndUnitWidth(
  ref: React.RefObject<HTMLDivElement>,
  nOfUnits: number,
  padding = 0
) {
  // save current window width in the state object
  let [width, setWidth] = React.useState(
    ref?.current?.getBoundingClientRect()?.width
  )
  let [unitWidth, setUnitWidth] = React.useState(
    getUnitWidth(
      nOfUnits,
      ref?.current?.getBoundingClientRect()?.width,
      padding
    )
  )

  // in this case useEffect will execute only once because
  // it does not have any dependencies.

  function getUnitWidth(nOfUnits: number, width = 0, padding = 0) {
    return Math.round((width - padding) / nOfUnits)
  }

  React.useLayoutEffect(() => {
    const handleResize = () => {
      if (ref && ref.current) {
        const {width} = ref?.current?.getBoundingClientRect()
        const unitWidth = getUnitWidth(nOfUnits, width, padding)
        setWidth(width)
        setUnitWidth(unitWidth)
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      // remove resize listener
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {width, unitWidth}
}

const TimelineBurstPlot: React.FunctionComponent<TimelineBurstPlotProps> = ({
  studyId,
  timeline,
  children,
}) => {
  const classes = useStyles()

  const [isLoading, setIsLoading] = React.useState(true)
  const [eventIds, setEventIds] = React.useState<string[]>([])

  const {data: study} = useStudy(studyId)

  const [plotData, setPlotData] = React.useState<
    Record<string, PlotData[]> | undefined
  >()
  const ref = React.useRef<HTMLDivElement>(null)
  const {unitWidth} = useGetPlotAndUnitWidth(ref, 7, 180)

  //check if we are dealing with the sesison converted into a burst
  const isSessionBurst = (sessionGuid: string): boolean => {
    return (
      timeline?.schedule.find(
        scheduleItem =>
          scheduleItem.refGuid === sessionGuid && scheduleItem.studyBurstId
      ) !== undefined
    )
  }

  const getBurstIntervalInWeeks = (): number => {
    const burst = ScheduleService.getStudyBurst(timeline)
    return burst ? Number(burst.interval.replace(/[PW]/g, '')) : 0
  }

  React.useEffect(() => {
    setIsLoading(true)
    const getEvents = async (
      timeline: ScheduleTimeline,
      studyEvents: SchedulingEvent[]
    ) => {
      try {
        const events = [
          JOINED_EVENT_ID,
          ...studyEvents.map(e =>
            EventService.prefixCustomEventIdentifier(e.eventId)
          ),
        ]

        const unwrappedSessions = unWrapSessions(timeline.schedule)
        const lastDay = Math.max(...unwrappedSessions.map(s => s.endDay)) + 1
        const numOfWeeks = Math.ceil(lastDay / 7)
        const maxWindows = Math.max(
          ...timeline.sessions.map(s => s.timeWindowGuids.length)
        )
        const burst = ScheduleService.getStudyBurst(timeline)
        var result: Record<string, PlotData[]> = {}
        for (var event of events) {
          //if current event initiates burst pass the eventId
          const burstEventId =
            burst && burst.originEventId === event
              ? burst.originEventId
              : undefined
          const plotData = getPlotDataForEvent(
            unwrappedSessions,
            numOfWeeks,
            maxWindows,
            event,
            burstEventId
          )
          result[event] = plotData
        }

        const newEvents = events.filter(e => !_.isEmpty(result[e]))

        setEventIds(newEvents)
        setPlotData(result)
      } catch (e) {
        console.log((e as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
    if (timeline && study) {
      getEvents(timeline, study.customEvents || [])
    }
  }, [timeline, study?.customEvents])

  function unWrapSessions(items: TimelineScheduleItem[]) {
    const unwrapped = items.map(i => {
      //not burst -- return
      if (i.studyBurstNum === undefined) {
        return i
      } else {
        const offSet =
          (i.studyBurstNum - 1) *
          (getBurstIntervalInWeeks() * 7) /*+ burstLength*/
        return {...i, startDay: i.startDay + offSet, endDay: i.endDay + offSet}
      }
    })
    return unwrapped
  }

  function getDataForSessionsInWeek(
    schedItems: TimelineScheduleItem[],
    sessions: StudySessionTimeline[],
    weekNumber: number,
    maxWindows: number
  ) {
    let resultSessions = sessions.map(session => {
      const sessionCoords = Utility.getDaysFractionForSingleSessionWeek(
        session.guid!,
        schedItems,
        weekNumber,
        maxWindows
      )

      return {
        ...sessionCoords,
        session,
        sessionIndex: timeline.sessions.findIndex(s => s.guid === session.guid),
      }
    })
    const noEmpties = resultSessions.filter(s => s.coords.length > 0)
    return noEmpties
  }

  function getPlotDataForEvent(
    schedItems: TimelineScheduleItem[],
    numOfWeeks: number,
    maxWindows: number,
    eventId: string,
    burstOriginEventId?: string
  ): PlotData[] {
    if (!timeline) {
      return []
    }

    var result: Record<string, PlotData> = {}

    for (var weekNumber = 0; weekNumber < numOfWeeks; weekNumber++) {
      // do the non-burst sessions

      const nonBurstSessions = timeline.sessions.filter(
        s => !isSessionBurst(s.guid!) && s.startEventId === eventId
      )
      const dataForWeek = getDataForSessionsInWeek(
        schedItems,
        nonBurstSessions,
        weekNumber,
        maxWindows
      )
      if (dataForWeek.length) {
        result[`${weekNumber}`] = {
          name: weekNumber + 1,
          burst: false,
          burstNum: -1,
          sessions: dataForWeek,
        }
      }

      if (burstOriginEventId) {
        const burstSessions = timeline.sessions.filter(s =>
          isSessionBurst(s.guid!)
        )

        let dataForWeek = getDataForSessionsInWeek(
          schedItems,
          burstSessions,
          weekNumber,
          maxWindows
        )

        if (dataForWeek.length) {
          //get burst number from one of the items
          const itemsWidthBurstForWeek = Utility.getSchedulingItemsForWeek(
            schedItems,
            weekNumber
          ).filter(i => i.studyBurstNum !== undefined)

          result[`${weekNumber}_burst`] = {
            name: weekNumber + 1,
            burst: true,
            burstNum: _.first(itemsWidthBurstForWeek)?.studyBurstNum || -1,
            sessions: dataForWeek,
          }
        }
      }
    }
    // sort by week number
    var sortedResult = _.sortBy(result, [
      function (o) {
        return o.name
      },
    ])

    return sortedResult
  }

  function calculateDistanceToNextBurst(
    coords: PlotData[],
    wkNumber: number,
    burstNumber: number,
    allEventData: PlotData[]
  ) {
    var pxGapBetweenBursts = LayoutConstants.marginGap

    const getNextBurstNumber = (currentIndex: number) => {
      for (var i = currentIndex + 1; i < coords.length; i++) {
        if (allEventData![i].burst) {
          return allEventData![i].burstNum
        }
      }
    }

    const getThisSessionPlot = (weekPlot: PlotData) => {
      return weekPlot.name === wkNumber && weekPlot.burstNum === burstNumber
    }

    const thisPlotIndex = coords.findIndex(getThisSessionPlot)

    // it's a last graph -- no bracket or if it's not a burst or if the next graph is the same burst

    if (
      thisPlotIndex === coords.length - 1 ||
      burstNumber === -1 ||
      getNextBurstNumber(thisPlotIndex) === burstNumber
    ) {
      return -1
    }

    for (var i = thisPlotIndex + 1; i < coords.length; i++) {
      const plotData = coords[i]

      if (plotData.burstNum === burstNumber + 1) {
        //found the end

        return pxGapBetweenBursts
      } else {
        //if we are in the same bust - add graph height
        if (!plotData.burst) {
          const weekHeight =
            plotData.sessions.length *
              LayoutConstants.singleSessionGraphHeight +
            (plotData.sessions.length - 1) *
              LayoutConstants.singleSessionGraphBottomMargin
          //add padding
          pxGapBetweenBursts = pxGapBetweenBursts + LayoutConstants.weekVPad * 2

          pxGapBetweenBursts =
            pxGapBetweenBursts +
            Math.max(weekHeight, LayoutConstants.weekMinHeight)
        }
      }
    }
    return -1
  }

  return (
    <div ref={ref} className={classes.plotContainer}>
      <PlotDaysDisplay unitWidth={unitWidth} title="Schedule by week day" />
      <div style={{position: 'relative' /*, overflow: 'hidden'*/}}>
        {!isLoading && plotData && (
          <>
            {children && (
              <div
                className={classes.defaultMessage}
                style={{
                  height:
                    LayoutConstants.singleSessionGraphHeight *
                      timeline.sessions.length +
                    'px',
                }}>
                {children}
              </div>
            )}
            {eventIds.map((evt, evtIndex) => (
              <div>
                <div
                  className={classes.weekTitle}
                  style={{
                    width: 'auto',
                    fontWeight: 'bold',
                    padding: `${LayoutConstants.weekVPad}px 16px 0 16px`,
                    backgroundColor: plotData[evt]?.[0]?.burst
                      ? 'yellow'
                      : '#eee',
                  }}>
                  {' '}
                  {EventService.formatEventIdForDisplay(evt)}
                </div>

                {plotData[evt]?.map((wk, index) => (
                  <div
                    className={classes.week}
                    key={`week_${wk.name}_ ${wk.burstNum}`}
                    style={{
                      marginBottom:
                        plotData[evt][index + 1] &&
                        plotData[evt][index + 1].burstNum === wk.burstNum
                          ? '0px'
                          : `${LayoutConstants.marginGap}px`,
                      padding: `${LayoutConstants.weekVPad}px 16px`,
                      // height: `${LayoutConstants.height}px`,
                      backgroundColor: wk.burst ? 'yellow' : '#eee',
                      position: 'relative',
                    }}>
                    <FrequencyBracket
                      intervalInWeeks={getBurstIntervalInWeeks()}
                      heightInterval={calculateDistanceToNextBurst(
                        plotData[evt],
                        wk.name,
                        wk.burstNum,
                        plotData[evt]
                      )}
                    />

                    <div className={classes.weekTitle} key="week_index">
                      Week {wk.name}
                      {wk.burst !== false ? '/ Burst' + wk.burstNum * 1 : ''}
                    </div>
                    <div style={{flexGrow: 1, flexShrink: 0}} key="week_graph">
                      {wk.sessions.map((sessionInfo, sIndex: number) => (
                        <div
                          className={classes.graph}
                          key={`sessionA_${sIndex}`}>
                          <Tooltip
                            key="tooltip"
                            placement="top"
                            title={`Starts on: ${EventService.formatEventIdForDisplay(
                              sessionInfo.startEventId!
                            )}`}>
                            <div className={classes.sessionName}>
                              <SessionIcon
                                symbolKey={sessionInfo.session.symbol}
                                index={sessionInfo.sessionIndex}
                              />
                            </div>
                          </Tooltip>

                          <SessionPlot
                            sessionIndex={sessionInfo.sessionIndex}
                            lineNumber={index}
                            xCoords={sessionInfo.coords}
                            sessionSymbol={sessionInfo.session.symbol}
                            unitPixelWidth={unitWidth}
                            sessionGuid={sessionInfo.session.guid!}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(TimelineBurstPlot)
