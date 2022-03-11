import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {makeStyles, Tooltip} from '@material-ui/core'
import AdherenceService from '@services/adherence.service'
import {AdherenceDetailReport} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import DayDisplayForSession from '../DayDisplayForSession'
import {useCommonStyles} from '../styles'
import AdherenceSessionIcon from './AdherenceSessionIcon'

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
  adherenceReport: AdherenceDetailReport
}

function getSequentialDayNumber(weekIndex: number, dayIndex: number): number {
  return weekIndex * 7 + dayIndex
}

//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/AdherenceUtils.java
//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/SessionCompletionState.java

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  ({adherenceReport}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 200)
    const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)

    const classes = {...useCommonStyles(), ...useStyles()}

    const isCompliant = (adherence: number): boolean =>
      adherence > AdherenceService.COMPLIANCE_THRESHOLD

    return (
      <div ref={ref} className={classes.adherenceGrid}>
        <div className={classes.daysList} key={'day_list'}>
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
        {adherenceReport.weeks.map((week, weekIndex) => (
          <div
            className={classes.eventRowForWeek}
            key={`${'inner' + week.weekInStudy}_${weekIndex}`}>
            <div className={classes.startEventId} key={'wk_name'}>
              Week {week.weekInStudy}
            </div>
            <div
              key={'eventRowForWeek' + weekIndex}
              className={classes.eventRowForWeekSessions}>
              <div key="sessions">
                {week.rows.map((row, rowIndex) => (
                  <div
                    className={classes.eventRowForWeekSingleSession}
                    id={'session' + row.label}>
                    <Tooltip title={row.label}>
                      <div className={classes.sessionLegendIcon}>
                        <AdherenceSessionIcon
                          sessionSymbol={row.sessionSymbol || undefined}
                          windowState="completed">
                          &nbsp;
                        </AdherenceSessionIcon>
                      </div>
                    </Tooltip>
                    <div
                      id={'wk' + weekIndex + 'events'}
                      className={classes.sessionWindows}>
                      {[...new Array(7)].map((i, dayIndex) => (
                        <div
                          className={classes.dayCell}
                          style={{width: `${dayWidthInPx}px`}}>
                          <DayDisplayForSession
                            isCompliant={isCompliant(week.adherencePercent)}
                            entryIndex={rowIndex}
                            sessionSymbol={row.sessionSymbol}
                            byDayEntries={week.byDayEntries}
                            maxNumberOfTimeWindows={maxNumbrOfTimeWindows}
                            sequentialDayNumber={dayIndex}
                            propertyValue={row.sessionGuid}
                            propertyName="sessionGuid"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div
                key={'adherence'}
                className={clsx(
                  classes.adherenceDisplay,
                  !isCompliant(week.adherencePercent) && classes.red
                )}>
                {week.adherencePercent !== undefined
                  ? `${week.adherencePercent}%`
                  : '-'}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

export default AdherenceParticipantGrid
