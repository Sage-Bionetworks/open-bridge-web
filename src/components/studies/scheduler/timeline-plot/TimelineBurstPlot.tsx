import CalendarIcon, {
  ReactComponent as SessionStartIcon,
} from '@assets/scheduler/calendar_icon.svg'
import {useSchedule, useTimeline} from '@components/studies/scheduleHooks'
import SessionIcon from '@components/widgets/SessionIcon'
import {Box, Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import EventService from '@services/event.service'
import {latoFont, poppinsFont} from '@style/theme'
import {StudySession, TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility from './utility'

const LayoutConstants = {
  marginGap: 4,
  bracketOverlay: 8,
  weekVPad: 10,
  singleSessionGraphHeight: 16,
  singleSessionGraphBottomMargin: 5,
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
    padding: `0 0 20px 54px`,
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
  // schedulingItems: TimelineScheduleItem[]

  studyId: string
}

type PlotData = {
  name: number
  burst: boolean
  burstNum: number
  sessions: {
    startEventId: string | undefined
    coords: number[]
    session: StudySession
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
  //schedulingItems,
  studyId,
}) => {
  const classes = useStyles()
  const {data: timeline, error, isLoading} = useTimeline(studyId)
  const {data: sessionsSchedule} = useSchedule(studyId)
  const ref = React.useRef<HTMLDivElement>(null)
  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)

  const isSessionBurst = (sessionGuid: string): boolean => {
    return (
      sessionsSchedule?.sessions
        .filter(s => !_.isEmpty(s.studyBurstIds))
        .map(s => s.guid!) || []
    ).includes(sessionGuid)
  }

  const getBurstsNumber = (): number => {
    const burst = _.first(sessionsSchedule?.studyBursts)
    return burst ? Number(burst.occurrences) : 0
  }

  const getBurstFrequency = (): number => {
    const burst = _.first(sessionsSchedule?.studyBursts)
    return burst ? Number(burst.interval.replace(/[PW]/g, '')) : 0
  }

  function handleResize() {
    if (ref && ref.current) {
      const {width} = ref?.current?.getBoundingClientRect()
      setPlotWidth(width)
    }
  }

  React.useLayoutEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  if (!timeline?.schedule) {
    return <></>
  }

  const unitWidth = getUnitWidth()
  const unwrappedSessions = unWrapSessions(timeline.schedule)

  const plotData = getPlotData(unwrappedSessions)

  function getUnitWidth(): number {
    const unitWidth = Math.round(((plotWidth || 0) - 170) / 7)
    return unitWidth
  }

  //id in the form study_burst:[eventName]_burst:02
  function getBurstNumberFromStartEventId(
    startEventId: string,
    sessionGuid: string
  ) {
    const isBurst = EventService.isEventBurstEvent(startEventId)

    if (!isBurst) {
      return isSessionBurst(sessionGuid) ? 0 : -1
    } else {
      return EventService.getBurstNumberFromEventId(startEventId)
    }
  }

  function unWrapSessions(items: TimelineScheduleItem[]) {
    const lastBurstSessionEndDay = Math.max(
      ...items.filter(s => isSessionBurst(s.refGuid)).map(s => s.endDay)
    )
    const burstLength = Math.floor(lastBurstSessionEndDay / 7) * 7
    const unwrapped = items.map(i => {
      const burstNumber = getBurstNumberFromStartEventId(
        i.startEventId,
        i.refGuid
      )
      //not burst -- return
      if (burstNumber === -1) {
        return i
      } else if (burstNumber === 0) {
        return {...i, startEventId: `study_burst:${i.startEventId}_burst:00`}
      } else {
        const offSet = burstNumber * (getBurstFrequency() * 7 + burstLength)
        return {...i, startDay: i.startDay + offSet, endDay: i.endDay + offSet}
      }
    })
    return unwrapped
  }

  function getPlotData(schedItems: TimelineScheduleItem[]): PlotData[] {
    if (!sessionsSchedule || !timeline) {
      return []
    }
    var result: Record<string, PlotData> = {}
    const lastDay = Math.max(...unwrappedSessions.map(s => s.endDay)) + 1

    const numOfWeeks = Math.ceil(lastDay / 7)

    const maxWindows = Math.max(
      ...timeline.sessions.map(s => s.timeWindowGuids.length)
    )

    for (var weekNumber = 0; weekNumber < numOfWeeks; weekNumber++) {
      // do the non-burst sessions
      let sessions = sessionsSchedule.sessions
        .filter(s => !isSessionBurst(s.guid!))
        .map(session => {
          const sessionCoords = Utility.getDaysFractionForSingleSession(
            session.guid!,
            schedItems,
            {start: weekNumber * 7, end: (weekNumber + 1) * 7},
            true,
            maxWindows
          )
          return {...sessionCoords, session}
        })
      let noEmpties = sessions.filter(s => s.coords.length > 0)
      // let hasItems = sessions.find(coordArr => coordArr.coords.length > 0)

      if (noEmpties.length) {
        result[`${weekNumber}`] = {
          name: weekNumber + 1,
          burst: false,
          burstNum: -1,
          sessions: noEmpties,
        }
      }

      sessions = sessionsSchedule.sessions
        .filter(s => isSessionBurst(s.guid!))
        .map(session => {
          const sessionCoords = Utility.getDaysFractionForSingleSession(
            session.guid!,
            schedItems,

            {start: weekNumber * 7, end: (weekNumber + 1) * 7},
            true,
            maxWindows
          )
          // const last = Math.ceil(_.last(sessionCoords.coords) || -1)
          return {...sessionCoords, session}
        })
      noEmpties = sessions.filter(s => s.coords.length > 0)
      // hasItems = sessions.find(coordArr => coordArr.coords.length > 0)

      if (noEmpties.length) {
        const schedItemsForWeek = schedItems.filter(
          i => i.startDay >= weekNumber * 7 && i.endDay < (weekNumber + 1) * 7
        )
        // for burst get the burst number
        const firstSession = _.first(
          schedItemsForWeek.filter(s => isSessionBurst(s.refGuid))
        )
        result[`${weekNumber}_burst`] = {
          name: weekNumber + 1,
          burst: true,
          sessions: noEmpties,
          burstNum: getBurstNumberFromStartEventId(
            firstSession!.startEventId,
            firstSession!.refGuid
          ),
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
    burstNumber: number
  ) {
    var pxGapBetweenBursts = LayoutConstants.marginGap

    const getNextBurstNumber = (currentIndex: number) => {
      for (var i = currentIndex + 1; i < coords.length; i++) {
        if (plotData[i].burst) {
          return plotData[i].burstNum
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
      <Box className={classes.burstsInfoText}>
        <img className={classes.calendarIcon} src={CalendarIcon}></img>
        <Box>
          <p>
            Your
            <strong style={{backgroundColor: '#FFF509'}}>
              {' '}
              {getBurstsNumber()} burst(s)
            </strong>{' '}
            will be automatically scheduled{' '}
            <strong>{getBurstFrequency()} week(s)</strong> apart from your&nbsp;
            <strong>Session Start Date</strong>.
          </p>
          <p>
            Bursts can be rescheduled in the Participant Manager to accomodate a
            participant’s availability.
          </p>
        </Box>
      </Box>

      <div className={classes.week}>
        <div style={{width: '99px', paddingLeft: '12px'}}>Schedule</div>
        <div className={classes.graph}>
          <div className={classes.sessionName}></div>
          <div style={{position: 'relative', top: '-10px'}}>
            <div style={{left: '-5px', top: '-20px', position: 'absolute'}}>
              {' '}
              Day
            </div>
            {[...new Array(7)].map((_i, index) => (
              <div
                key={`day_number_${index}`}
                className={classes.dayNumbers}
                style={{
                  left: unitWidth * index - 10 + 'px',
                }}>
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{position: 'relative'}}>
        {sessionsSchedule &&
          timeline &&
          plotData &&
          plotData.map((wk, index) => (
            <div
              className={classes.week}
              key={`week_${wk.name}_ ${wk.burstNum}`}
              style={{
                marginBottom:
                  plotData[index + 1] &&
                  plotData[index + 1].burstNum === wk.burstNum
                    ? '0px'
                    : `${LayoutConstants.marginGap}px`,
                padding: `${LayoutConstants.weekVPad}px 16px`,
                backgroundColor: wk.burst ? 'yellow' : '#eee',
                position: 'relative',
              }}>
              <FrequencyBracket
                frequency={getBurstFrequency()}
                heightInterval={calculateDistanceToNextBurst(
                  plotData,
                  wk.name,
                  wk.burstNum
                )}
              />

              <div className={classes.weekTitle} key="week_index">
                Week {wk.name}
                {wk.burst !== false ? '/ Burst' + (wk.burstNum * 1 + 1) : ''}
              </div>
              <div style={{flexGrow: 1, flexShrink: 0}} key="week_graph">
                {wk.sessions.map((sessionInfo, sIndex: number) => (
                  <div className={classes.graph} key={`session_${sIndex}`}>
                    <Tooltip
                      key="tooltip"
                      placement="top"
                      title={`Starts on: ${sessionInfo.startEventId}`}>
                      <div className={classes.sessionName}>
                        <SessionIcon
                          symbolKey={sessionInfo.session.symbol}
                          index={sessionsSchedule.sessions.findIndex(
                            s => s.guid === sessionInfo.session.guid
                          )}
                        />
                      </div>
                    </Tooltip>

                    <SessionPlot
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
    </div>
  )
}

export default TimelineBurstPlot
