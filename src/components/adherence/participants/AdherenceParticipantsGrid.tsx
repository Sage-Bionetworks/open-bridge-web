import {PlotDaysDisplay, useGetPlotAndUnitWidth} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {Box, styled, Tooltip} from '@mui/material'
import {Link} from 'react-router-dom'

import makeStyles from '@mui/styles/makeStyles'

import {getSessionSymbolName} from '@components/widgets/SessionIcon'
import AdherenceService from '@services/adherence.service'
import ParticipantService from '@services/participants.service'
import {theme} from '@style/theme'
import {AdherenceWeeklyReport, ProgressionStatus, SessionDisplayInfo} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import AdherenceUtility from '../adherenceUtility'
import DayDisplay from '../DayDisplay'
import {useCommonStyles} from '../styles'
import NextActivity from './NextActivity'

const StyledParticipantRow = styled(Box, {label: 'StyledParticipantRow'})<{progression?: ProgressionStatus}>(
  ({theme, progression}) => ({
    display: 'flex',
    borderBottom: '4px solid #fbfbfb',
    padding: theme.spacing(1, 0),
    alignItems: 'center',
    textAlign: 'center',
    // backgroundColor: progression === 'done' ? '#F7FBF6;' : 'transparent',
  })
)

export const useStyles = makeStyles(theme => ({
  adherenceCell: {
    borderRight: 'none',
    borderLeft: '1px solid black',
    verticalAlign: 'middle',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  labelDisplay: {
    width: theme.spacing(17),
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
  const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 260)
  //  const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)

  return (
    <div ref={ref} style={{marginBottom: '32px'}}>
      <div style={{display: 'flex', marginBottom: '16px'}}>
        <Box width={theme.spacing(11)}>Participant</Box>
        <Box width={theme.spacing(12)}>Day in Study</Box>
        <div style={{marginLeft: '-60px'}}>
          <PlotDaysDisplay
            title=""
            unitWidth={dayWidthInPx}
            endLabel={
              <div
                className={classes.adherenceLabel}
                style={{
                  width: `${dayWidthInPx}px`,
                  left: `${dayWidthInPx * 7 + 12}px`,
                  top: '0px',
                }}>
                Adh
                <br />%
              </div>
            }
          />
        </div>
      </div>
      {adherenceWeeklyReport.items.map((item, index) =>
        !item.participant ? (
          <StyledParticipantRow key={`no_participant_${index}`}>the participant withdrew</StyledParticipantRow>
        ) : (
          <StyledParticipantRow key={`${item.participant}_${index}`} progression={item.progression}>
            <Box sx={{width: theme.spacing(11), flexShrink: 0}} key={'pIdentifier'}>
              <Link to={`adherence/${item.participant?.identifier || 'nothing'}`}>
                {ParticipantService.formatExternalId(studyId, item.participant.externalId)}
              </Link>
            </Box>
            <div key={'data'} id="data" style={{width: '100%', display: 'flex'}}>
              {!item.rows?.length ? (
                <NextActivity
                  dayPxWidth={dayWidthInPx}
                  nextActivity={item.nextActivity}
                  completionStatus={item.progression}
                />
              ) : (
                <div style={{}} className={classes.eventRowForWeekSessions}>
                  <div>
                    {item.rows.map((info, rowIndex) => (
                      <div
                        key={`${/*info.sessionGuid*/ info}_ind${rowIndex}`}
                        className={classes.eventRowForWeekSingleSession}>
                        <Tooltip title={info.label}>
                          <Box key="label" className={classes.labelDisplay}>
                            {AdherenceUtility.getDisplayFromLabel(info.label, info.studyBurstNum)}
                          </Box>
                        </Tooltip>
                        {/*    <div className={classes.sessionLegendIcon}>
                            <AdherenceSessionIcon
                              sessionSymbol={info.sessionSymbol}
                              windowState="completed">
                              &nbsp;
                            </AdherenceSessionIcon>
                              </div>*/}

                        <div key={`${/*info.sessionGuid*/ info}_ind${rowIndex}`} className={classes.sessionWindows}>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <AdherenceCell
                progression={item.progression}
                adherencePercent={item.weeklyAdherencePercent}
                activityRows={item.rows?.length || 0}
              />
            </div>
          </StyledParticipantRow>
        )
      )}
    </div>
  )
}

export default AdherenceParticipantsGrid
