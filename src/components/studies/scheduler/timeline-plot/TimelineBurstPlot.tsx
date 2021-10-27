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
  schedulingItems,
  burstFrequency,
  burstSessionGuids,
  sortedSessions,
}) => {
  const classes = useStyles()
  const ref = React.useRef<HTMLDivElement>(null)
  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)

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

  const unitWidth = getUnitWidth()
  const unwrappedSessions = unWrapSessions(schedulingItems)

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

  function unWrapSessions(items: TimelineScheduleItem[]) {
    const lastBurstSessionEndDay = Math.max(
      ...items
        .filter(s => burstSessionGuids.includes(s.refGuid))
        .map(s => s.endDay)
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
        const offSet = burstNumber * (burstFrequency * 7 + burstLength)
        return {...i, startDay: i.startDay + offSet, endDay: i.endDay + offSet}
      }
    })
    return unwrapped
  }

  function getPlotData(schedItems: TimelineScheduleItem[]): PlotData[] {
    var result: Record<string, PlotData> = {}
    const numOfWeeks = Math.ceil(
      Math.max(...unwrappedSessions.map(s => s.endDay)) / 7
    )

    for (var weekNumber = 0; weekNumber < numOfWeeks; weekNumber++) {
      // do the non-burst sessions
      let sessions = sortedSessions
        .filter(s => !burstSessionGuids.includes(s.guid!))
        .map(session => {
          const sessionCoords = Utility.getDaysFractionForSingleSession(
            session.guid!,
            schedItems,
            {start: weekNumber * 7, end: (weekNumber + 1) * 7},
            true
          )
          return {...sessionCoords, guid: session.guid}
        })

      let hasItems = sessions.find(coordArr => coordArr.coords.length > 0)

      if (hasItems) {
        result[`${weekNumber}`] = {
          name: weekNumber + 1,
          burst: false,
          burstNum: -1,
          sessions,
        }
      }

      sessions = sortedSessions
        .filter(s => burstSessionGuids.includes(s.guid!))
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

      hasItems = sessions.find(coordArr => coordArr.coords.length > 0)

      if (hasItems) {
        const schedItemsForWeek = schedItems.filter(
          i => i.startDay >= weekNumber * 7 && i.endDay < (weekNumber + 1) * 7
        )
        // for burst get the burst number
        const firstSession = _.first(
          schedItemsForWeek.filter(s => burstSessionGuids.includes(s.refGuid))
        )
        result[`${weekNumber}_burst`] = {
          name: weekNumber + 1,
          burst: true,
          sessions,
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
    var sessionsBetween = 0
    const isLargeNumber = (x: PlotData) => {
      return x.name == wkNumber && x.burstNum === burstNumber
    }

    const firstIndex = coords.findIndex(isLargeNumber)

    if (firstIndex === coords.length - 1) {
      return -1
    }
    if (coords[firstIndex + 1].burstNum == burstNumber || burstNumber === -1) {
      return -1
    }

    sessionsBetween = LayoutConstants.marginGap
    for (var i = firstIndex + 1; i < coords.length; i++) {
      const val = coords[i]

      if (val.burstNum === burstNumber + 1) {
        return sessionsBetween
      } else {
        if (!val.burst) {
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
    return -1
  }

  return (
    <div ref={ref} className={classes.plotContainer}>
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
        {plotData &&
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
                frequency={burstFrequency}
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
                {wk.sessions.map((session, sIndex: number) => (
                  <div className={classes.graph} key={`session_${sIndex}`}>
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
  )
}

export default TimelineBurstPlot
