import SessionIcon from '@components/widgets/SessionIcon'
import {Tooltip} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont} from '@style/theme'
import {StudySession, TimelineScheduleItem} from '@typedefs/scheduling'
import _ from 'lodash'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility from './utility'

const useStyles = makeStyles(theme => ({
  root: {width: '100%', position: 'relative'},
  plotContainer: {
    padding: `35px 0 20px 0px`,
  },

  graph: {
    display: 'flex',
    marginBottom: '5px',
    height: '16px',
    alignItems: 'center',
    flexDirection: 'row',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  sessionName: {
    display: 'flex',
    width: '20px',
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
    marginBottom: '4px',
    backgroundColor: '#f8f8f8',
    padding: theme.spacing(1, 0, 1, 1.5),
  },
  weekDays: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '10px',
    fontFamily: latoFont,

    fontSize: '12px',
  },

  dayNumbers: {
    width: '20px',

    textAlign: 'center',
    position: 'absolute',
  },

  lessIcon: {
    transform: 'rotate(180deg)',
  },
  showMore: {
    fontFamily: latoFont,
    fontStyle: 'italic',
    fontWeight: 'normal',
    fontSize: '12px',
    textAlign: 'right',
  },
}))

export interface TimelinePlotProps {
  schedulingItems: TimelineScheduleItem[]
  sortedSessions: StudySession[]
  maxWindows: number
}

type PlotData = {
  sessionInfos: {
    startEventId?: string
    coords: number[]
    session: StudySession
  }[]
  weekNumber: number
}

const EmptyPlotSC: React.FunctionComponent<{
  sortedSessions: StudySession[]
  unitWidth: number
}> = ({sortedSessions, unitWidth}) => {
  const classes = useStyles()
  const result = (
    <div className={classes.week} key={`week_none`}>
      <div style={{width: '60px'}} key="week_index">
        Week
      </div>
      <div style={{flexGrow: 1, flexShrink: 0}} key="week_graph">
        {sortedSessions.map((session, sIndex) => (
          <div className={classes.graph} key={`session_${sIndex}`}>
            <Tooltip
              key="tooltip"
              placement="top"
              title={`Starts on: ${session.startEventIds[0]}`}>
              <div className={classes.sessionName}>
                <SessionIcon index={sIndex} />
              </div>
            </Tooltip>
            <div style={{position: 'relative', top: '0px'}} key="session_plot">
              <SessionPlot
                xCoords={[]}
                sessionSymbol={session.symbol}
                displayIndex={2}
                unitPixelWidth={unitWidth}
                sessionGuid={session.guid!}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  return result
}

const TimelinePlot: React.FunctionComponent<TimelinePlotProps> = ({
  schedulingItems,
  sortedSessions,
  maxWindows,
}: TimelinePlotProps) => {
  const classes = useStyles()
  const ref = React.useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)
  const [plotData, setPlotData] = React.useState<PlotData[]>()

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

  React.useEffect(() => {
    if (schedulingItems) {
      const result = createPlotData(schedulingItems)
      setPlotData(result)
    }
  }, [schedulingItems])

  const unitWidth = getUnitWidth()

  function getUnitWidth(): number {
    const unitWidth = Math.round(((plotWidth || 0) - 100) / 7)
    return unitWidth
  }

  function createPlotData(schedulingItems: TimelineScheduleItem[]): PlotData[] {
    var lastDay = Math.max(...schedulingItems.map(s => s.endDay)) + 1

    const numOfWeeks = Math.ceil(lastDay / 7)

    var result: Record<string, PlotData> = {}

    for (var weekNumber = 0; weekNumber < numOfWeeks; weekNumber++) {
      const sessionInfos = sortedSessions.map(session => {
        const infos = Utility.getDaysFractionForSingleSession(
          session.guid!,
          schedulingItems,
          {start: weekNumber * 7, end: (weekNumber + 1) * 7},
          false,
          maxWindows
        )
        return {...infos, session}
      })

      var noEmpties = sessionInfos.filter(s => s.coords.length > 0)

      if (noEmpties.length && true) {
        result[weekNumber] = {
          sessionInfos,
          weekNumber,
        }
      }
    }

    var sortedResult = _.sortBy(result, [
      function (o) {
        return o.weekNumber
      },
    ])

    return sortedResult
  }
  if (!schedulingItems || !plotData) {
    return <></>
  }

  return (
    <>
      <div className={classes.root}>
        <div ref={ref} className={classes.plotContainer}>
          <div
            style={{
              position: 'relative',
            }}>
            <div className={classes.weekDays}>
              <div style={{width: 92 + unitWidth / 2 + 'px', fontSize: '12px'}}>
                Schedule by week day
              </div>
              <div className={classes.graph}>
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

            {_.isEmpty(plotData) && (
              <EmptyPlotSC
                sortedSessions={sortedSessions}
                unitWidth={unitWidth}
              />
            )}

            {plotData &&
              plotData.map((wk, index) => (
                /*(isExpanded || index < 3) &&*/ <div
                  className={classes.week}
                  key={`week_${index}`}>
                  <div style={{width: '60px'}} key="week_index">
                    Week {wk.weekNumber + 1}
                  </div>
                  <div style={{flexGrow: 1, flexShrink: 0}} key="week_graph">
                    {wk.sessionInfos
                      .filter(s => s.coords.length > 0)
                      .map((sessionInfo, sIndex) => (
                        <div
                          className={classes.graph}
                          key={`session_${sIndex}`}>
                          <Tooltip
                            key="tooltip"
                            placement="top"
                            title={`Starts on: ${sessionInfo.startEventId}`}>
                            <div className={classes.sessionName}>
                              <SessionIcon
                                index={sIndex}
                                symbolKey={sessionInfo.session.symbol}
                              />
                            </div>
                          </Tooltip>
                          <div
                            style={{position: 'relative', top: '0px'}}
                            key="session_plot">
                            <SessionPlot
                              xCoords={sessionInfo.coords}
                              sessionSymbol={sessionInfo.session.symbol}
                              displayIndex={2}
                              unitPixelWidth={unitWidth}
                              sessionGuid={sessionInfo.session.guid!}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            {/*plotData.length > 2 && (
              <div className={classes.showMore}>
                <Button
                  onClick={e => setIsExpanded(prev => !prev)}
                  variant="text">
                  {isExpanded ? (
                    <>
                      <span>Show less&nbsp;</span>
                      <Arrow className={classes.lessIcon} />
                    </>
                  ) : (
                    <>
                      <span>Show more&nbsp;</span>
                      <Arrow />
                    </>
                  )}
                </Button>
              </div>
                  )*/}
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelinePlot
