import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {makeStyles, Tooltip} from '@material-ui/core'
import AdherenceService from '@services/adherence.service'
import {latoFont} from '@style/theme'
import {AdherenceDetailReport} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import DayDisplay from '../DayDisplay'
import {useCommonStyles} from '../styles'
import AdherenceSessionIcon from './AdherenceSessionIcon'

const useStyles = makeStyles(theme => ({
  daysList: {
    paddingLeft: 0,
    marginBottom: theme.spacing(0.5),
  },
  startEventId: {
    width: theme.spacing(20),
    fontSize: '12px',
    fontFamily: latoFont,
    padding: theme.spacing(0, 1, 0, 2),
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
    backgroundColor: '#fff',
    padding: theme.spacing(1, 0),
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
    // position: 'relative',
    // left: '-15px',
  },

  sessionWindows: {
    width: '100%',
    position: 'relative',
    display: 'flex',
    minHeight: '20px',
  },
  adherenceDisplay: {
    fontSize: '14px',
  },
  sessionLegendIcon: {
    display: 'flex',
    '& svg': {
      width: '6px',
    },
    //position: 'relative',
    // left: '-18px',
  },
}))

type AdherenceParticipantGridProps = {
  adherenceReport: AdherenceDetailReport
}

//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/AdherenceUtils.java
//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/SessionCompletionState.java

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  ({adherenceReport}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 250)
    const classes = {...useCommonStyles(), ...useStyles()}
    const isCompliant = (adherence: number): boolean =>
      adherence > AdherenceService.COMPLIANCE_THRESHOLD

    const dayListingTitleStyle: React.CSSProperties = {
      fontWeight: 'bold',
      paddingLeft: '16px',
      fontSize: '14px',
      width: '225px',
    }

    const adHerenceLabelStyle: React.CSSProperties = {
      top: '-7px',
      lineHeight: '1',
      width: `${dayWidthInPx}px`,
      left: `${dayWidthInPx * 7}px`,
    }

    return (
      <div ref={ref} className={classes.adherenceGrid}>
        <div className={classes.daysList} key={'day_list'}>
          <PlotDaysDisplay
            title="Day in Study"
            titleStyle={dayListingTitleStyle}
            unitWidth={dayWidthInPx}
            endLabel={
              <div
                className={classes.adherenceLabel}
                style={adHerenceLabelStyle}>
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
            <div
              key={'eventRowForWeek' + weekIndex}
              className={classes.eventRowForWeekSessions}>
              <div key="sessions">
                {week.rows.map((row, rowIndex) => (
                  <div
                    className={classes.eventRowForWeekSingleSession}
                    id={'session' + row.label}>
                    <div className={classes.startEventId} key={'wk_name'}>
                      Week {week.weekInStudy}/
                      {row.studyBurstNum !== undefined
                        ? `Burst ${row.studyBurstNum}`
                        : row.sessionName}
                    </div>
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
                        <DayDisplay
                          key={dayIndex}
                          entry={AdherenceUtility.getItemFromByDayEntries(
                            week.byDayEntries,
                            dayIndex,
                            rowIndex
                          )}
                          isCompliant={isCompliant(week.adherencePercent)}
                          dayWidth={dayWidthInPx}
                          sessionSymbol={row.sessionSymbol}
                          numOfWin={AdherenceUtility.getMaxNumberOfTimeWindows(
                            adherenceReport.weeks
                          )}
                          timeZone={adherenceReport.clientTimeZone}
                        />
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
