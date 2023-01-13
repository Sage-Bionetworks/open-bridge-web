import {useGetPlotAndUnitWidth} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {getSessionSymbolName} from '@components/widgets/SessionIcon'
import {BorderedTableCell} from '@components/widgets/StyledComponents'
import UtilityObject from '@helpers/utility'
import {Box, Table, TableBody, TableRow, Tooltip} from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import EventService from '@services/event.service'
import {latoFont} from '@style/theme'
import {AdherenceDetailReport, EventStreamDay, ParticipantClientData, SessionDisplayInfo} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import DayDisplay from '../DayDisplay'
import {useCommonStyles} from '../styles'
import TableHeader from '../TableHeader'

const useStyles = makeStyles(theme => ({
  daysList: {
    paddingLeft: 0,
    marginBottom: theme.spacing(0.5),
  },
  startEventId: {
    width: '138px',
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
  sessions: SessionDisplayInfo[]
}

const UndefinedEvents: FunctionComponent<{startEventIds: string[]}> = ({startEventIds}) => {
  const classes = useStyles()
  return (
    <>
      {startEventIds.map(name => (
        <div className={classes.eventRowForWeek}>
          <Box px={2}>
            <strong>{EventService.formatEventIdForDisplay(name)}</strong>
            &nbsp; calendar date has not been defined for this participant. Session(s) tied to this event will be
            displayed once date is provided. Edit Participant Event Date below.
          </Box>
        </div>
      ))}
    </>
  )
}

//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/AdherenceUtils.java
//https://github.com/Sage-Bionetworks/BridgeServer2/blob/develop/src/main/java/org/sagebionetworks/bridge/models/schedules2/adherence/SessionCompletionState.java

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> = ({
  adherenceReport,
  clientData,
  sessions,
}) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 250)
  const classes = {...useCommonStyles(), ...useStyles()}

  const mergeWithClientData = (eventStreamDay: EventStreamDay): EventStreamDay => {
    if (clientData && UtilityObject.isArcApp()) {
      const windows = eventStreamDay.timeWindows.map(window => {
        let record = (clientData.sessionStartLocalTimes || []).find(x => x.guid === window.sessionInstanceGuid)

        return record ? {...window, startTime: record.start} : window
      })
      console.log(windows)
      return {...eventStreamDay, timeWindows: windows}
    } else {
      return eventStreamDay
    }
  }

  const getRowLabel = (wkInStudy: number, sessionName: string, burstNum?: number) => {
    const label = `Week ${wkInStudy}${burstNum !== undefined ? `/Burst ${burstNum}` : ''}/${sessionName}`
    return (
      <Tooltip title={label}>
        <Box
          sx={{
            width: '110px',
            display: 'block',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}>
          {label}
        </Box>
      </Tooltip>
    )
  }

  return (
    <div ref={ref} style={{marginBottom: '32px'}}>
      <Table sx={{border: '1px solid #EAECEE', borderCollapse: 'separate'}}>
        <TableHeader prefixColumns={[['Schedule by weekday', 138]]} unitWidth={dayWidthInPx} />
        <TableBody>
          {adherenceReport.weeks.map((week, weekIndex) => (
            <TableRow id="eventRowForWeek" key={`${'inner' + week.weekInStudy}_${weekIndex}`}>
              <BorderedTableCell
                key="sessions"
                colSpan={8}
                sx={{
                  padding: 0,
                  borderLeft: 'none',
                  textAlign: 'center',
                  backgroundColor: weekIndex % 2 == 0 ? '#fff' : '#FBFBFC',
                }}>
                <Table>
                  {week.rows.map((row, rowIndex) => (
                    <TableRow id={'session' + row.label}>
                      <BorderedTableCell className={classes.startEventId} key={'wk_name'}>
                        {getRowLabel(row.weekInStudy, row.sessionName, row.studyBurstNum)}
                      </BorderedTableCell>

                      {[...new Array(7)].map((i, dayIndex) => (
                        <DayDisplay
                          key={dayIndex}
                          entry={mergeWithClientData(
                            AdherenceUtility.getItemFromByDayEntries(week.byDayEntries, dayIndex, rowIndex)
                          )}
                          isCompliant={AdherenceUtility.isCompliant(week.adherencePercent)}
                          dayWidth={dayWidthInPx}
                          sessionSymbol={
                            row.sessionSymbol ||
                            getSessionSymbolName(sessions.findIndex(s => s.sessionGuid === row.sessionGuid))
                          }
                          numOfWin={AdherenceUtility.getMaxNumberOfTimeWindows(adherenceReport.weeks)}
                          timeZone={adherenceReport.clientTimeZone}
                        />
                      ))}
                    </TableRow>
                  ))}
                </Table>
              </BorderedTableCell>
              <BorderedTableCell
                key={'adherence'}
                className={clsx(
                  classes.adherenceDisplay,
                  !AdherenceUtility.isCompliant(week.adherencePercent) &&
                    adherenceReport.progression === 'in_progress' &&
                    classes.red
                )}
                sx={{backgroundColor: weekIndex % 2 == 0 ? '#fff' : '#FBFBFC'}}>
                {week.adherencePercent !== undefined && adherenceReport.progression !== 'unstarted'
                  ? `${week.adherencePercent}%`
                  : '-'}
              </BorderedTableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <UndefinedEvents startEventIds={adherenceReport.unsetEventIds} />
    </div>
  )
}

export default AdherenceParticipantGrid
