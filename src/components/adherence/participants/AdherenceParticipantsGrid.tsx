import {useGetPlotAndUnitWidth} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {Box, Table, TableBody, TableRow, Tooltip} from '@mui/material'
import {Link} from 'react-router-dom'

import makeStyles from '@mui/styles/makeStyles'

import {getSessionSymbolName} from '@components/widgets/SessionIcon'
import {BorderedTableCell} from '@components/widgets/StyledComponents'
import AdherenceService from '@services/adherence.service'
import ParticipantService from '@services/participants.service'
import {AdherenceWeeklyReport, ProgressionStatus, SessionDisplayInfo} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import DayDisplay from '../DayDisplay'
import {useCommonStyles} from '../styles'
import TableHeader from '../TableHeader'
import NextActivity from './NextActivity'

export const useStyles = makeStyles(theme => ({
  adherenceCell: {
    verticalAlign: 'middle',
    textAlign: 'center',
    paddingLeft: theme.spacing(1),
  },
  labelDisplay: {
    width: theme.spacing(15),
    display: 'flex',
    fontSize: '12px',
    lineHeight: 1,
    alignItems: 'center',
    paddingRight: '12px',
  },
  lastCell: {
    borderRight: 'none',
  },
}))

type AdherenceParticipantsGridProps = {
  studyId: string
  sessions: SessionDisplayInfo[]
  adherenceWeeklyReport: {items: AdherenceWeeklyReport[]; total: number}
}

const AdherenceCell: FunctionComponent<{
  progression: ProgressionStatus
  adherencePercent?: number
  activityRows: number
}> = ({progression, adherencePercent, activityRows}) => {
  const classes = {...useCommonStyles(), ...useStyles()}

  return (
    <Box
      key="adherence"
      className={clsx(
        classes.adherenceCell,
        adherencePercent ?? (100 < AdherenceService.COMPLIANCE_THRESHOLD && classes.red)
      )}>
      {adherencePercent !== undefined && activityRows > 0 ? `${adherencePercent}%` : 'n/a'}
    </Box>
  )
}

const AdherenceParticipantsGrid: FunctionComponent<AdherenceParticipantsGridProps> = ({
  studyId,
  adherenceWeeklyReport,
  sessions,
}) => {
  const classes = {...useCommonStyles(), ...useStyles()}

  const ref = React.useRef<HTMLDivElement>(null)
  const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 380)
  //  const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)

  return (
    <div ref={ref} style={{marginBottom: '32px'}}>
      <Table sx={{border: '1px solid #EAECEE', borderCollapse: 'separate'}}>
        <TableHeader
          prefixColumns={[
            ['Participant', 108],
            ['Day in Study', 166],
          ]}
          unitWidth={dayWidthInPx}
        />

        <TableBody>
          {adherenceWeeklyReport.items.map((item, index) =>
            !item.participant ? (
              <TableRow key={`no_participant_${index}`}>
                <BorderedTableCell colSpan={10} style={{border: 'none'}}>
                  the participant withdrew
                </BorderedTableCell>
              </TableRow>
            ) : (
              <TableRow key={`${item.participant}_${index}`}>
                <BorderedTableCell
                  $isDark={index % 2 === 1}
                  $staticColor={item.progression === 'done' ? '#F7FBF6' : undefined}
                  sx={{
                    width: '108px',
                    textAlign: 'center',
                  }}
                  key={'pIdentifier'}>
                  <Link to={`adherence/${item.participant?.identifier || 'nothing'}`}>
                    {ParticipantService.formatExternalId(studyId, item.participant.externalId)}
                  </Link>
                </BorderedTableCell>
                <BorderedTableCell
                  colSpan={8}
                  key={'data'}
                  id="data"
                  $isDark={index % 2 === 1}
                  $staticColor={item.progression === 'done' ? '#F7FBF6' : undefined}
                  sx={{
                    padding: 0,
                    textAlign: 'center',

                    borderLeft: 'none',
                  }}>
                  {!item.rows?.length ? (
                    <NextActivity
                      dayPxWidth={dayWidthInPx}
                      nextActivity={item.nextActivity}
                      completionStatus={item.progression}
                    />
                  ) : (
                    <Table>
                      {item.rows.map((info, rowIndex) => (
                        <TableRow key={`${info}_ind${rowIndex}`}>
                          <BorderedTableCell sx={{width: '166px', textAlign: 'center'}}>
                            <Tooltip title={info.label}>
                              <Box key="label" className={classes.labelDisplay}>
                                {AdherenceUtility.getDisplayFromLabel(info.label, info.studyBurstNum)}
                              </Box>
                            </Tooltip>
                          </BorderedTableCell>

                          {[...new Array(7)].map((i, dayIndex) => (
                            <DayDisplay
                              relevantReportStartDate={
                                //only care about the first day of weekly report
                                dayIndex === 0 ? item.startDate : undefined
                              }
                              todayStyle={true}
                              key={dayIndex}
                              entry={AdherenceUtility.getItemFromByDayEntries(item.byDayEntries, dayIndex, rowIndex)}
                              isCompliant={item.weeklyAdherencePercent >= AdherenceService.COMPLIANCE_THRESHOLD}
                              timeZone={item.clientTimeZone}
                              dayWidth={dayWidthInPx}
                              sessionSymbol={
                                info.sessionSymbol ||
                                getSessionSymbolName(sessions.findIndex(s => s.sessionGuid === info.sessionGuid))
                              }
                              numOfWin={AdherenceUtility.getMaxNumberOfTimeWindows(adherenceWeeklyReport.items)}
                              border={dayIndex !== 6}
                            />
                          ))}
                        </TableRow>
                      ))}
                    </Table>
                  )}
                </BorderedTableCell>
                <BorderedTableCell
                  $isDark={index % 2 === 1}
                  $staticColor={item.progression === 'done' ? '#F7FBF6' : undefined}>
                  <AdherenceCell
                    progression={item.progression}
                    adherencePercent={item.weeklyAdherencePercent}
                    activityRows={item.rows?.length || 0}
                  />
                </BorderedTableCell>
              </TableRow>
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdherenceParticipantsGrid
