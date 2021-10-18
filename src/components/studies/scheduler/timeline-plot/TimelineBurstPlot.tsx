import {Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import React from 'react'
import {ReactComponent as SessionStartIcon} from '../../../../assets/scheduler/calendar_icon.svg'
import {latoFont} from '../../../../style/theme'
import {StudySession} from '../../../../types/scheduling'
import {SingleSessionGridPlot} from './GridPlot'
import SessionPlot from './SingleSessionPlot'
import {daysPage, TimelineScheduleItem, TimelineZoomLevel} from './types'
import Utility from './utility'

const leftPad = 124
const containerTopPad = 35
const graphSessionHeight = 25

const useStyles = makeStyles(theme => ({
  graph: {
    height: '37px',
    display: 'flex',
    overflowX: 'clip',
  },
  burstTitle: {
    fontFamily: latoFont,
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '12px',
    margin: '24px 0  12px 8px',
    lineHeight: '12px',
    color: '#282828',
  },
  frequencyBracket: {
    display: 'flex',
    position: 'absolute',
    right: '-95px',
    width: '80px',

    height: '80px',
    top: '-40px',
    '&> div:first-child': {
      width: '12px',
      height: '80px',
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
    // position: 'relative',
    // top: '-12px',
    fontSize: '12px',
    //  backgroundColor: '#FFF509',
    padding: '5px',
    width: `${leftPad}px`,
    display: 'block',
    lineHeight: `${graphSessionHeight}px`,
    height: `${graphSessionHeight}px`,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    // marginLeft: `${-leftPad}px`,
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

const FrequencyBracket: React.FunctionComponent<{frequency: number}> = ({
  frequency,
}) => {
  const classes = useStyles()
  return (
    <div className={classes.frequencyBracket}>
      <div />
      <div>
        <SessionStartIcon />
        <span className={classes.frequencyText}>{frequency} weeks</span>
      </div>
    </div>
  )
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
  const [page, setPage] = React.useState(0)
  const [burstSessions, setBurstSessions] = React.useState<StudySession[]>([])
  const [nonBurstSessions, setNonBurstSessions] = React.useState<
    StudySession[]
  >([])

  const ref = React.useRef<HTMLDivElement>(null)

  const [plotWidth, setPlotWidth] = React.useState<number | null>(null)

  React.useEffect(() => {
    setNonBurstSessions(
      sortedSessions.filter(s => !burstSessionGuids.includes(s.guid!))
    )
    setBurstSessions(
      sortedSessions.filter(s => burstSessionGuids.includes(s.guid!))
    )
  }, [burstSessionGuids])

  function handleResize() {
    if (ref && ref.current) {
      const {width} = ref?.current?.getBoundingClientRect()
      setPlotWidth(width)
    }
  }

  React.useEffect(() => {
    setPage(0)
  }, [zoomLevel])

  React.useLayoutEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
  })

  const getPlotDaysInterval = (): {start: number; end: number} => {
    return {
      start: page * daysPage[zoomLevel],
      end: (page + 1) * daysPage[zoomLevel],
    }
  }
  const isLastPage = (): boolean => {
    return scheduleLength < (page + 1) * daysPage[zoomLevel]
  }

  const getUnitWidth = (): number => {
    return ((plotWidth || 0) - 30 - 124) / daysPage[zoomLevel]
  }

  return (
    <div style={{paddingRight: '30px'}} ref={ref}>
      <div style={{textAlign: 'right'}}>
        <Button disabled={page == 0} onClick={e => setPage(prev => prev - 1)}>
          &lt;&lt; PREV
        </Button>
        |
        <Button
          disabled={isLastPage()}
          onClick={e => setPage(prev => prev + 1)}>
          NEXT &gt;&gt;
        </Button>
      </div>
      <div className={classes.graph} style={{height: '20px'}}>
        <div className={classes.sessionName}>&nbsp;</div>
        <div style={{position: 'relative', top: '10px'}}>
          {' '}
          <SingleSessionGridPlot
            graphSessionHeight={graphSessionHeight - 10}
            unitPixelWidth={getUnitWidth()}
            hideDays={false}
            interval={{...getPlotDaysInterval()}}
            zoomLevel={zoomLevel}
            numberSessions={1}
            scheduleLength={scheduleLength}
          />
        </div>
      </div>
      {nonBurstSessions.map(session => (
        <div className={classes.graph} style={{backgroundColor: '#EDEDED'}}>
          <div className={classes.sessionName}>{session.name}</div>
          <div style={{position: 'relative', top: '10px'}}>
            <SingleSessionGridPlot
              graphSessionHeight={graphSessionHeight - 10}
              unitPixelWidth={getUnitWidth()}
              hideDays={true}
              zoomLevel={zoomLevel}
              numberSessions={1}
              scheduleLength={scheduleLength}
            />

            <SessionPlot
              sessionIndex={sortedSessions.findIndex(
                s => s.guid === session.guid
              )}
              xCoords={Utility.getDaysFractionForSingleSession(
                session.guid!,
                schedulingItems,
                {...getPlotDaysInterval()}
              )}
              displayIndex={0}
              unitPixelWidth={getUnitWidth()}
              scheduleLength={scheduleLength}
              zoomLevel={zoomLevel}
              schedulingItems={schedulingItems}
              sessionGuid={session.guid!}
              graphSessionHeight={graphSessionHeight}
            />
          </div>
        </div>
      ))}
      {[...Array(burstNumber)].map((i, burstIndex) => (
        <div style={{position: 'relative'}}>
          {burstIndex > 0 && <FrequencyBracket frequency={burstFrequency} />}
          <div className={classes.burstTitle}>Burst {burstIndex + 1}</div>
          <div>
            {burstSessions.map((session, sIndex) => (
              <div
                className={classes.graph}
                style={{
                  backgroundColor: 'yellow',
                }}>
                <div className={classes.sessionName}>{session.name}</div>
                <div style={{position: 'relative', top: '10px'}}>
                  <SingleSessionGridPlot
                    graphSessionHeight={graphSessionHeight - 10}
                    unitPixelWidth={getUnitWidth()}
                    hideDays={true}
                    zoomLevel={zoomLevel}
                    numberSessions={1}
                    scheduleLength={scheduleLength}
                  />

                  <SessionPlot
                    xCoords={Utility.getDaysFractionForSingleSession(
                      session.guid!,
                      schedulingItems,
                      {...getPlotDaysInterval()}
                    )}
                    sessionIndex={sortedSessions.findIndex(
                      s => s.guid === session.guid
                    )}
                    displayIndex={0}
                    unitPixelWidth={getUnitWidth()}
                    scheduleLength={scheduleLength}
                    zoomLevel={zoomLevel}
                    schedulingItems={schedulingItems}
                    sessionGuid={session.guid!}
                    graphSessionHeight={graphSessionHeight}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TimelineBurstPlot
