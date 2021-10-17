import SessionIcon from '@components/widgets/SessionIcon'
import {Button} from '@material-ui/core'
import {makeStyles} from '@material-ui/core/styles'
import {latoFont} from '@style/theme'
import {StudySession, TimelineScheduleItem} from '@typedefs/scheduling'
import React from 'react'
import SessionPlot from './SingleSessionPlot'
import Utility from './utility'

const leftPad = 54
const containerTopPad = 35
const graphSessionHeight = 50

const useStyles = makeStyles(theme => ({
  rootOld: {
    // overflowX: 'scroll',
    width: '100%',
    position: 'relative',
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
  root: {width: '100%', position: 'relative'},
  plotContainer: {
    //  backgroundColor: '#ECECEC',
    padding: `${containerTopPad}px 0 20px ${leftPad}px`,
  },
  whiteBg: {
    //  height: `${containerTopPad}px`,
    marginTop: `-${containerTopPad}px`,
    marginLeft: `-${leftPad}px`,
    backgroundColor: '#FFF',
  },
  graph: {display: 'flex', marginBottom: '5px', height: '16px'},
  sessionName: {
    width: '20px',
    '& svg': {
      width: '5px',
      height: '5px',
    },
  },
  week: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '13px',
  },
  dayNumbers: {
    fontFamily: latoFont,

    fontSize: '14px',

    width: '20px',

    textAlign: 'center',
    position: 'absolute',
  },
}))

export interface TimelinePlotProps {
  schedulingItems: TimelineScheduleItem[]
  scheduleLength: number
  sortedSessions: StudySession[]
}

const TimelinePlot: React.FunctionComponent<TimelinePlotProps> = ({
  schedulingItems,
  scheduleLength,
  sortedSessions,
}: TimelinePlotProps) => {
  const classes = useStyles()
  const ref = React.useRef<HTMLDivElement>(null)
  const [isExpand, setIsExpand] = React.useState(false)
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

  const weeks = new Array(isExpand ? Math.ceil(scheduleLength / 7) : 2) //Math.ceil(scheduleLength / 7))
  console.log('weeks', weeks)

  const unitWidth = getUnitWidth()
  const xCoords = getXCoords()

  function getUnitWidth(): number {
    //  const unitWidth = ((plotWidth || 0) - 30 - 124) / 7
    console.log('plotWidth', plotWidth)
    const unitWidth = Math.round(((plotWidth || 0) - 154) / 7)
    console.log('unit width', unitWidth)
    return unitWidth
  }

  function getXCoords() {
    const xCoordsMap = [...weeks].map((_week, weekNumber) => {
      const coords = sortedSessions.map(session => {
        return Utility.getDaysFractionForSingleSession(
          session.guid!,
          schedulingItems,
          {start: weekNumber * 7, end: (weekNumber + 1) * 7}
        )
      })
      return coords
    })
    return xCoordsMap
  }

  const weekHasActivity = (xCoords: number[][]) => {
    const hasItems = xCoords.find(coordArr => coordArr.length > 0)
    return !!hasItems
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
              <div style={{width: '60px'}}>Schedule</div>
              <div className={classes.graph}>
                <div className={classes.sessionName}></div>
                <div style={{position: 'relative'}}>
                  {[...new Array(7)].map((_i, index) => (
                    <div
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
            {[...weeks].map(
              (wk, index) =>
                weekHasActivity(xCoords[index]) && (
                  <div className={classes.week}>
                    <div style={{width: '60px'}}>Week {index + 1}</div>
                    <div style={{flexGrow: 1, flexShrink: 0}}>
                      {sortedSessions.map((session, sIndex) => (
                        <div className={classes.graph}>
                          <div className={classes.sessionName}>
                            <SessionIcon index={sIndex} />
                          </div>
                          <div style={{position: 'relative', top: '0px'}}>
                            <SessionPlot
                              xCoords={
                                xCoords[index][
                                  sIndex
                                ] /*Utility.getDaysFractionForSingleSession(
                                session.guid!,
                                schedulingItems,
                                {...getPlotDaysInterval(index)}
                              )*/
                              }
                              sessionIndex={sortedSessions.findIndex(
                                s => s.guid === session.guid
                              )}
                              hasSessionLines={false}
                              displayIndex={0}
                              unitPixelWidth={unitWidth}
                              scheduleLength={7}
                              zoomLevel={'Weekly'}
                              schedulingItems={schedulingItems}
                              sessionGuid={session.guid!}
                              graphSessionHeight={graphSessionHeight}
                              containerWidth={Utility.getContainerWidth(
                                scheduleLength,
                                'Weekly'
                              )}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
            <div>
              <Button onClick={e => setIsExpand(prev => !prev)}>
                Expand {isExpand ? 'donw' : 'up'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TimelinePlot
