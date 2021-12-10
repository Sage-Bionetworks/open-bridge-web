import {ReactComponent as SessionStartIcon} from '@assets/scheduler/calendar_icon.svg'
import {useStudy} from '@components/studies/studyHooks'
import SessionIcon from '@components/widgets/SessionIcon'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import EventService, {JOINED_EVENT_ID} from '@services/event.service'
import ScheduleService from '@services/schedule.service'
import {latoFont, poppinsFont} from '@style/theme'
import {
  ScheduleTimeline,
  SchedulingEvent,
  StudySessionTimeline,
  TimelineScheduleItem,
} from '@typedefs/scheduling'
import _ from 'lodash'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility from './utility'

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
  burstsInfoText: {
    width: '420px',

    margin: '0 auto',

    display: 'flex',
    '& p': {
      fontFamily: poppinsFont,
      fontSize: '14px',
      lineHeight: '21px',
    },
  },
  calendarIcon: {
    width: '20px',
    height: '20px',
    marginTop: theme.spacing(2.4),
    marginRight: theme.spacing(2.5),
  },
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

  root: {width: '100%', position: 'relative'},
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
}))

export interface TimelineBurstPlotProps {
  timeline: ScheduleTimeline
  studyId: string
}

type PlotData = {
  name: number
  burst: boolean
  burstNum: number
  sessions: {
    sessionIndex: number
    startEventId: string | undefined
    coords: number[]
    session: StudySessionTimeline
  }[]
}

const FrequencyBracket: React.FunctionComponent<{
  frequency: number
  heightInterval: number
}> = ({frequency, heightInterval}) => {
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
        <span className={classes.frequencyText}>{frequency} weeks</span>
      </div>
    </div>
  )
}

const TimelineBurstPlot: React.FunctionComponent<TimelineBurstPlotProps> = ({
  studyId,
  timeline,
}) => {
  const classes = useStyles()

  const [isLoading, setIsLoading] = React.useState(true)
  const [eventIds, setEventIds] = React.useState<string[]>([])

  const {data: study} = useStudy(studyId)
  const ref = React.useRef<HTMLDivElement>(null)
  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)
  const [plotData, setPlotData] = React.useState<
    Record<string, PlotData[]> | undefined
  >()

  //check if we are dealing with the sesison converted into a burst
  const isSessionBurst = (sessionGuid: string): boolean => {
    return (
      timeline?.schedule.find(
        scheduleItem =>
          scheduleItem.refGuid === sessionGuid && scheduleItem.studyBurstId
      ) !== undefined
    )
  }

  const getBurstFrequency = (): number => {
    const burst = ScheduleService.getStudyBurst(timeline)
    return burst ? Number(burst.interval.replace(/[PW]/g, '')) : 0
  }

  function handleResize() {
    if (ref && ref.current) {
      const {width} = ref?.current?.getBoundingClientRect()
      setPlotWidth(width)
    }
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
        var result: Record<string, PlotData[]> = {}
        for (var event of events) {
          const plotData = getPlotData(
            unwrappedSessions,
            numOfWeeks,
            maxWindows,
            event
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

  React.useLayoutEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  if (!timeline?.schedule) {
    return <></>
  }

  const unitWidth = getUnitWidth()

  function getUnitWidth(): number {
    const unitWidth = Math.round(((plotWidth || 0) - 180) / 7)
    return unitWidth
  }

  //id in the form study_burst:[eventName]_burst:02
  function getBurstNumberFromStartEventId(startEventId: string) {
    const isBurst = EventService.isEventBurstEvent(startEventId)

    return !isBurst ? -1 : EventService.getBurstNumberFromEventId(startEventId)
  }

  function unWrapSessions(items: TimelineScheduleItem[]) {
    const lastBurstSessionEndDay = Math.max(
      ...items.filter(s => isSessionBurst(s.refGuid)).map(s => s.endDay)
    )
    const burstLength = Math.floor(lastBurstSessionEndDay / 7) * 7
    const unwrapped = items.map(i => {
      const burstNumber = getBurstNumberFromStartEventId(i.startEventId)
      //not burst -- return
      if (burstNumber === -1) {
        return i
      } else {
        const offSet =
          (burstNumber - 1) * (getBurstFrequency() * 7 + burstLength)
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

  function getPlotData(
    schedItems: TimelineScheduleItem[],
    numOfWeeks: number,
    maxWindows: number,
    eventId: string
  ): PlotData[] {
    if (!timeline) {
      return []
    }
    var r: Record<string, PlotData[]> = {}
    //for (var eventName in eventIds) {
    var result: Record<string, PlotData> = {}

    for (var weekNumber = 0; weekNumber < numOfWeeks; weekNumber++) {
      // do the non-burst sessions

      let s = timeline.sessions.filter(
        s =>
          !isSessionBurst(s.guid!) &&
          //_.first(s.startEventIds) &&
          s.startEventId === eventId
      )
      let noEmpties = getDataForSessionsInWeek(
        schedItems,
        s,
        weekNumber,
        maxWindows
      )
      if (noEmpties.length) {
        result[`${weekNumber}`] = {
          name: weekNumber + 1,
          burst: false,
          burstNum: -1,
          sessions: noEmpties,
        }
      }
      const burst = ScheduleService.getStudyBurst(timeline)
      if (burst) {
        s =
          // TEMPORARAY UNTILL BURST GETS EVENT ID burst.originEventId === eventId
          burst.identifier === `${eventId.replace(':', '_')}_burst`
            ? timeline.sessions.filter(s => isSessionBurst(s.guid!))
            : []
        noEmpties = getDataForSessionsInWeek(
          schedItems,
          s,
          weekNumber,
          maxWindows
        )

        if (noEmpties.length) {
          const schedItemsForWeek = schedItems.filter(
            i =>
              i.startDay >= weekNumber * 7 && i.startDay < (weekNumber + 1) * 7
          )
          // for burst get the burst number
          const firstSession = _.first(
            schedItemsForWeek.filter(s => isSessionBurst(s.refGuid))
          )
          result[`${weekNumber}_burst`] = {
            name: weekNumber + 1,
            burst: true,
            burstNum: getBurstNumberFromStartEventId(
              firstSession!.startEventId
            ),
            sessions: noEmpties,
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
    // r[eventName]=sortedResult
    // }

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
      <div className={classes.week}>
        <div
          style={{
            width: `${99 + unitWidth / 2}px`,
            paddingLeft: '12px',
            fontSize: '12px',
          }}>
          {' '}
          Schedule by week day
        </div>
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
                  width: unitWidth + 'px',
                  left: unitWidth * index - 10 + 'px',
                }}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{position: 'relative'}}>
        {!isLoading &&
          plotData &&
          eventIds.map((evt, evtIndex) => (
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
                    frequency={getBurstFrequency()}
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
                      <div className={classes.graph} key={`sessionA_${sIndex}`}>
                        <Tooltip
                          key="tooltip"
                          placement="top"
                          title={`Starts on: ${sessionInfo.startEventId}`}>
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
                          displayIndex={2}
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
      </div>
    </div>
  )
}

export default React.memo(TimelineBurstPlot)
