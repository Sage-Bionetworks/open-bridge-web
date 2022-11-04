import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import UtilityObject from '@helpers/utility'
import {Box} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import EventService from '@services/event.service'
import {latoFont} from '@style/theme'
import {
  AdherenceDetailReport,
  EventStreamDay,
  ParticipantClientData,
} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import DayDisplay from '../DayDisplay'
import RowLabel from '../RowLabel'
import {useCommonStyles} from '../styles'

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

  adherenceDisplay: {
    fontSize: '14px',
    paddingLeft: theme.spacing(1),
  },
}))

type AdherenceParticipantGridProps = {
  adherenceReport: AdherenceDetailReport
  clientData: ParticipantClientData | undefined
}

const UndefinedEvents: FunctionComponent<{startEventIds: string[]}> = ({
  startEventIds,
}) => {
  const classes = useStyles()
  return (
    <>
      {startEventIds.map(name => (
        <div className={classes.eventRowForWeek}>
          <Box px={2}>
            <strong>{EventService.formatEventIdForDisplay(name)}</strong>
            &nbsp; calendar date has not been defined for this participant.
            Session(s) tied to this event will be displayed once date is
            provided. Edit Participant Event Date below.
          </Box>
        </div>
      ))}
    </>
  )
}

//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/AdherenceUtils.java
//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/SessionCompletionState.java

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  ({adherenceReport, clientData}) => {
    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 250)
    const classes = {...useCommonStyles(), ...useStyles()}

    const dayListingTitleStyle: React.CSSProperties = {
      fontWeight: 'bold',
      paddingLeft: '16px',
      fontSize: '14px',
      width: '235px',
    }

    const adHerenceLabelStyle: React.CSSProperties = {
      top: '-7px',
      lineHeight: '1',
      width: `${dayWidthInPx}px`,
      left: `${dayWidthInPx * 7}px`,
    }

    const mergeWithClientData = (
      eventStreamDay: EventStreamDay
    ): EventStreamDay => {
      if (clientData && UtilityObject.isArcApp()) {
        console.log('clientData', clientData)
        const windows = eventStreamDay.timeWindows.map(window => {
          let record = (clientData.sessionStartLocalTimes || []).find(
            x => x.guid === window.sessionInstanceGuid
          )
          if (record) {
            console.log('record', record)
          }
          return record ? {...window, startTime: record.start} : window
        })
        console.log(windows)
        return {...eventStreamDay, timeWindows: windows}
      } else {
        return eventStreamDay
      }
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
                      <RowLabel
                        wkInStudy={week.weekInStudy}
                        burstNum={row.studyBurstNum}
                        sessionName={row.sessionName}
                      />
                    </div>
                    {/*  <Tooltip title={row.label}>
                      <div className={classes.sessionLegendIcon}>
                        <AdherenceSessionIcon
                          sessionSymbol={row.sessionSymbol || undefined}
                          windowState="completed">
                          &nbsp;
                        </AdherenceSessionIcon>
                      </div>
                      </Tooltip>*/}
                    <div
                      id={'wk' + weekIndex + 'events'}
                      className={classes.sessionWindows}>
                      {[...new Array(7)].map((i, dayIndex) => (
                        <DayDisplay
                          key={dayIndex}
                          entry={mergeWithClientData(
                            AdherenceUtility.getItemFromByDayEntries(
                              week.byDayEntries,
                              dayIndex,
                              rowIndex
                            )
                          )}
                          isCompliant={AdherenceUtility.isCompliant(
                            week.adherencePercent
                          )}
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
                  !AdherenceUtility.isCompliant(week.adherencePercent) &&
                    adherenceReport.progression === 'in_progress' &&
                    classes.red
                )}>
                {week.adherencePercent !== undefined &&
                adherenceReport.progression !== 'unstarted'
                  ? `${week.adherencePercent}%`
                  : '-'}
              </div>
            </div>
          </div>
        ))}
        <UndefinedEvents startEventIds={adherenceReport.unsetEventIds} />
      </div>
    )
  }

export default AdherenceParticipantGrid
