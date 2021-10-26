import {ReactComponent as SessionStartIcon} from '@assets/scheduler/calendar_icon.svg'
import SessionIcon from '@components/widgets/SessionIcon'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont} from '@style/theme'
import {StudySession, TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility from './utility'

const LayoutConstants = {
  marginGap: 4,
  bracketOverlay: 16,
  weekVPad: 10,
  singleSessionGraphHeight: 16,
  singleSessionGraphBottomMargin: 5,
  weekMinHeight: 44,
}

const useStyles = makeStyles(theme => ({
  frequencyBracket: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    position: 'absolute',
    right: '-75px',
    // width: '80px',

    // height: '80px',
    // top: '-40px',
    '&> div:first-child': {
      width: '14px',
      // height: '80px',
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
    //  backgroundColor: '#ECECEC',
    padding: `35px 0 20px 54px`,
  },

  graph: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: `${LayoutConstants.singleSessionGraphBottomMargin}px`,
    height: `${LayoutConstants.singleSessionGraphHeight}px`,
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
  schedulingItems: TimelineScheduleItem[]
  burstSessionGuids: string[]
  burstNumber: number
  burstFrequency: number
  sortedSessions: StudySession[]
}

type PlotData = {
  name: number
  burst: boolean
  burstNum: number
  sessions: {
    startEventId: string | undefined
    coords: number[]
    guid: string | undefined
  }[]
}

const FrequencyBracket: React.FunctionComponent<{
  frequency: number
  topX: number[]
}> = ({frequency, topX}) => {
  const classes = useStyles()
  if (topX[0] === -1) {
    return <></>
  }
  const [sessions, weeks] = topX
  console.log(topX + 'top X')
  const bot = -1 * (topX[0] + LayoutConstants.bracketOverlay) // sessions === 0 ? -19 : -1 * (sessions * 34 + weeks * 4)
  const heightMe = topX[0] + LayoutConstants.bracketOverlay * 2 //sessions == 0 ? 34 : -bot
  console.log(heightMe)
  return (
    <div
      className={classes.frequencyBracket}
      style={{bottom: bot + 'px', height: heightMe + 'px'}}>
      <div style={{height: heightMe}} />
      <div>
        <SessionStartIcon />
        <span className={classes.frequencyText}>{frequency} weeks</span>
      </div>
    </div>
  )
}

const TimelineBurstPlot: React.FunctionComponent<TimelineBurstPlotProps> = ({
  schedulingItems,
  burstNumber,
  burstFrequency,
  burstSessionGuids,
  sortedSessions,
}) => {
  const classes = useStyles()
  const ref = React.useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)
  const [lastWeekToShowCollapsed, setLastWeekToShowCollapsed] =
    React.useState(1)

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

  if (!schedulingItems) {
    return <></>
  }
  //const weeks = new Array(Math.ceil(_.last(schedulingItems!)!.endDay / 7)) //Math.ceil(scheduleLength / 7))

  //console.log('weeks', weeks)
  const unitWidth = getUnitWidth()
  const unwrappedSessions = unWrapSessions(schedulingItems)
  const weeks = new Array(
    Math.ceil(Math.max(...unwrappedSessions.map(s => s.endDay)) / 7)
  )
  //console.log(unwrappedSessions.map(s => s.endDay))
  const xCoords = getXCoords(unwrappedSessions)

  function getUnitWidth(): number {
    //  const unitWidth = ((plotWidth || 0) - 30 - 124) / 7
    const unitWidth = Math.round(((plotWidth || 0) - 170) / 7)
    return unitWidth
  }

  //id in the form study_burst:[eventName]_burst:02
  function getBurstNumberFromStartEventId(
    startEventId: string,
    sessionGuid: string
  ) {
    const burstParts = startEventId.match(/_burst:[0-9]+/g)

    if (!burstParts?.length) {
      if (burstSessionGuids.includes(sessionGuid)) {
        return 0
      } else {
        return -1
      }
    } else {
      return Number(burstParts[0].split(':')[1])
    }
  }

  /*  function getAdjustedSessionStartAndEndForBurst(s: TimelineScheduleItem) {
    const sessionStartDay = Math.min(
      ...items.filter(s => s.refGuid === i.refGuid).map(s => s.startDay)
    )
    const sessionEndDay = Math.max(
      ...items.filter(s => s.refGuid === i.refGuid).map(s => s.endDay)
    )
    const sessionLength = sessionEndDay - sessionStartDay + 1

    const offSet =
      burstNumber * (sessionLength + +sessionStartDay + burstFrequency * 7)
    return {...i, startDay: i.startDay + offSet, endDay: i.endDay + offSet}

  }*/

  function getBurstLength(items: TimelineScheduleItem[]) {
    var lastEndDay = Math.max(
      ...items
        .filter(s => burstSessionGuids.includes(s.refGuid))
        .map(s => s.endDay)
    )
    return Math.floor(lastEndDay / 7) * 7
    /*  var distinctSessions = _.groupBy(items, i => i.refGuid)
    var sessionLengths: Record<string, number> = {}
    for (var l in distinctSessions) {
      var firstStartDay = Math.min(...distinctSessions[l].map(s => s.startDay))
      var lastEndDay = Math.max(...distinctSessions[l].map(s => s.endDay))
      const duration = lastEndDay - firstStartDay + 1
      sessionLengths[l] = duration
    }
    return sessionLengths*/
  }

  function unWrapSessions(items: TimelineScheduleItem[]) {
    const sessionLength = getBurstLength(items)

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
        // const scheduleItem =

        const sessionStartDay = Math.min(
          ...items.filter(s => s.refGuid === i.refGuid).map(s => s.startDay)
        )
        /*  const sessionEndDay = Math.max(
          ...items.filter(s => s.refGuid === i.refGuid).map(s => s.endDay)
        )
        const sessionLength = sessionEndDay - sessionStartDay + 1*/

        const offSet =
          burstNumber /*sessionStartDay +*/ *
          /*sessionLengths[i.refGuid]*/ (burstFrequency * 7 + sessionLength) //+
        // sessionStartDay

        return {...i, startDay: i.startDay + offSet, endDay: i.endDay + offSet}
      }
    })
    return unwrapped
  }

  /*function getSessionLastDays() {
    // single week
    const max = sortedSessions.map(session => {
      var isBurstSession = burstSessionGuids.includes(session.guid!)
      var max = -1
      // if (!isBurstSession) {
      const endDays = schedulingItems
        .filter(i => i.refGuid === session.guid)
        .map(i => i.endDay)

      max = Math.max(...endDays)
      if (isBurstSession) {
        max = (max + burstFrequency * 7) * burstNumber
      }
      //   }

      return max
    })
    return max
  }*/

  function getXCoords(schedItems: TimelineScheduleItem[]) {
    var result: Record<string, PlotData> = {}
    const xCoordsMap = [...weeks].map((_week, weekNumber) => {
      // single week
      const schedItemsForWeek = schedItems.filter(
        i => i.startDay >= weekNumber * 7 && i.endDay < (weekNumber + 1) * 7
      )
      const coordsNonBurst = sortedSessions
        .filter(s => !burstSessionGuids.includes(s.guid!))
        .map(session => {
          const sessionCoords = Utility.getDaysFractionForSingleSession(
            session.guid!,
            schedItems,
            {start: weekNumber * 7, end: (weekNumber + 1) * 7},
            true
          )
          // const last = Math.ceil(_.last(sessionCoords.coords) || -1)
          return {...sessionCoords, guid: session.guid}
        })
      const hasItemsNonBurst = coordsNonBurst.find(
        coordArr => coordArr.coords.length > 0
      )
      if (hasItemsNonBurst) {
        result[`${weekNumber}`] = {
          name: weekNumber + 1,
          burst: false,
          burstNum: -1,
          sessions: coordsNonBurst,
          //  isVisible: hasItemsNonBurst,
        }
      }

      const coordsBurst = sortedSessions
        .filter(s => burstSessionGuids.includes(s.guid!))
        .map(session => {
          const sessionCoords = Utility.getDaysFractionForSingleSession(
            session.guid!,
            schedItemsForWeek,

            {start: weekNumber * 7, end: (weekNumber + 1) * 7},
            true
          )
          // const last = Math.ceil(_.last(sessionCoords.coords) || -1)
          return {...sessionCoords, guid: session.guid}
        })
      const hasItems = coordsBurst.find(coordArr => coordArr.coords.length > 0)
      if (hasItems) {
        const firstSession = _.first(
          schedItemsForWeek.filter(s => burstSessionGuids.includes(s.refGuid))
        )
        result[`${weekNumber}_burst`] = {
          name: weekNumber + 1,
          burst: true,
          sessions: coordsBurst,
          burstNum: getBurstNumberFromStartEventId(
            firstSession!.startEventId,
            firstSession!.refGuid
          ),
          // isVisible: hasItems,
        }
      }
    })
    var x = _.sortBy(result, [
      function (o) {
        return o.name
      },
    ])
    console.log(x)
    return x //{xCoords: xCoordsMap /*, sessionMax: getSessionLastDays()*/}
  }

  function calculateNumOfSessionsToNextBurst(
    coords: PlotData[],
    wkNumber: number,
    burstNumber: number
  ) {
    var sessionsBetween = 0
    var weeksBetween = 0

    const isLargeNumber = (x: PlotData) => {
      return x.name == wkNumber && x.burstNum === burstNumber
    }

    const firstIndex = coords.findIndex(isLargeNumber)
    // console.log('find me', firstIndex)
    if (firstIndex === coords.length - 1) {
      return [-1]
    }
    if (coords[firstIndex + 1].burstNum == burstNumber || burstNumber === -1) {
      return [-1]
    }

    sessionsBetween = LayoutConstants.marginGap //coords[firstIndex].sessions.length
    console.log(sessionsBetween)
    console.log(firstIndex + 'firstINdex')
    for (var i = firstIndex + 1; i < coords.length; i++) {
      const val = coords[i]
      // console.log('looking at', val)
      if (val.burstNum === burstNumber + 1) {
        console.log('returning', sessionsBetween)
        return [sessionsBetween, weeksBetween]
      } else {
        if (!val.burst) {
          weeksBetween++
          const weekHeight =
            val.sessions.length * LayoutConstants.singleSessionGraphHeight +
            (val.sessions.length - 1) *
              LayoutConstants.singleSessionGraphBottomMargin

          sessionsBetween =
            sessionsBetween +
            Math.max(weekHeight, LayoutConstants.weekMinHeight)
          sessionsBetween = sessionsBetween + LayoutConstants.weekVPad * 2
        }
      }
    }
    return [-1]
  }

  return (
    <>
      <div className={classes.root}>
        <div ref={ref} className={classes.plotContainer}>
          <div
            style={{
              // height: `${sortedSessions.length * graphSessionHeight}px`,
              position: 'relative',
            }}>
            <div className={classes.week}>
              <div style={{width: '99px', paddingLeft: '12px'}}>Schedule</div>
              <div className={classes.graph}>
                <div className={classes.sessionName}></div>
                <div style={{position: 'relative'}}>
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
              xALINA
              {xCoords &&
                xCoords.map((wk, index) => (
                  <div
                    className={classes.week}
                    key={`week_${wk.name}_ ${wk.burstNum}`}
                    style={{
                      marginBottom:
                        xCoords[index + 1] &&
                        xCoords[index + 1].burstNum === wk.burstNum
                          ? '0px'
                          : `${LayoutConstants.marginGap}px`,
                      padding: `${LayoutConstants.weekVPad}px 16px`,
                      backgroundColor: wk.burst ? 'yellow' : '#eee',
                      position: 'relative',
                    }}>
                    <FrequencyBracket
                      frequency={burstFrequency}
                      topX={calculateNumOfSessionsToNextBurst(
                        xCoords,
                        wk.name,
                        wk.burstNum
                      )}
                    />

                    <div className={classes.weekTitle} key="week_index">
                      Week {wk.name}
                      {wk.burst !== false
                        ? '/ Burst' + (wk.burstNum * 1 + 1)
                        : ''}
                    </div>
                    <div style={{flexGrow: 1, flexShrink: 0}} key="week_graph">
                      {wk.sessions.map((session, sIndex: number) => (
                        <div
                          className={classes.graph}
                          key={`session_${sIndex}`}>
                          <Tooltip
                            key="tooltip"
                            placement="top"
                            title={`Starts on: ${session.startEventId}`}>
                            <div className={classes.sessionName}>
                              <SessionIcon
                                index={sortedSessions.findIndex(
                                  s => s.guid === session.guid
                                )}
                              />
                            </div>
                          </Tooltip>

                          <SessionPlot
                            xCoords={session.coords}
                            sessionIndex={sortedSessions.findIndex(
                              s => s.guid === session.guid
                            )}
                            displayIndex={2}
                            unitPixelWidth={unitWidth}
                            scheduleLength={7}
                            schedulingItems={schedulingItems}
                            sessionGuid={session.guid!}
                          />
                        </div>
                      ))}
                    </div>
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
