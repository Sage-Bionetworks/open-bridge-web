import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {Box, makeStyles, Tooltip} from '@material-ui/core'
import AdherenceService from '@services/adherence.service'
import ParticipantService from '@services/participants.service'
import {theme} from '@style/theme'
import {AdherenceWeeklyReport} from '@typedefs/types'
import clsx from 'clsx'
import React, {FunctionComponent} from 'react'
import {Link} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import DayDisplay from '../DayDisplay'
import AdherenceSessionIcon from '../participant-detail/AdherenceSessionIcon'
import {useCommonStyles} from '../styles'
import NextActivity from './NextActivity'

export const useStyles = makeStyles(theme => ({
  participantRow: {
    display: 'flex',
    borderBottom: '4px solid #fbfbfb',
    padding: theme.spacing(2, 0),
    alignItems: 'center',
  },
  adherenceCell: {
    borderRight: 'none',
    borderLeft: '1px solid black',
    verticalAlign: 'middle',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
  },
  lastCell: {
    borderRight: 'none',
  },
}))

type AdherenceParticipantsGridProps = {
  studyId: string

  adherenceWeeklyReport: {items: AdherenceWeeklyReport[]; total: number}
}

const AdherenceParticipantsGrid: FunctionComponent<AdherenceParticipantsGridProps> =
  ({studyId, adherenceWeeklyReport}) => {
    const classes = {...useCommonStyles(), ...useStyles()}

    const ref = React.useRef<HTMLDivElement>(null)
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 300)
    //  const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)

    return (
      <div ref={ref} style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', marginBottom: '16px'}}>
          <Box width={theme.spacing(11)}>Participant</Box>
          <Box width={theme.spacing(12)}>Day in Study</Box>
          <div style={{marginLeft: '-40px'}}>
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
            <div
              className={classes.participantRow}
              key={`no_participant_${index}`}>
              the participant withdrew
            </div>
          ) : (
            <div
              key={`${item.participant}_${index}`}
              className={classes.participantRow}>
              <Box width={theme.spacing(11)} key={'pIdentifier'}>
                <Link
                  to={`adherence/${item.participant?.identifier || 'nothing'}`}>
                  {ParticipantService.formatExternalId(
                    studyId,
                    item.participant.externalId
                  )}
                </Link>
              </Box>
              <div
                key={'data'}
                id="data"
                style={{width: '100%', display: 'flex'}}>
                {item.rows.length === 0 ? (
                  <NextActivity
                    dayPxWidth={dayWidthInPx}
                    info={item.nextActivity}
                    completionStatus={item.progression}
                  />
                ) : (
                  <>
                    <div id="headers">
                      {item.rows.map((info, rowIndex) => (
                        <div
                          key={`${/*info.sessionGuid*/ info}_ind${rowIndex}`}
                          className={classes.sessionRow}>
                          <Tooltip title={info.label}>
                            <Box
                              key="label"
                              width={theme.spacing(16.5)}
                              fontSize={'12px'}
                              lineHeight={1}
                              paddingRight="12px"
                              height="16px">
                              {AdherenceUtility.getDisplayFromLabel(
                                info.label,
                                info.studyBurstNum
                              )}
                            </Box>
                          </Tooltip>
                          <div className={classes.sessionLegendIcon}>
                            <AdherenceSessionIcon
                              sessionSymbol={info.sessionSymbol}
                              windowState="completed">
                              &nbsp;
                            </AdherenceSessionIcon>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div id="data">
                      {item.rows.map((info, rowIndex) => (
                        <div
                          key={`${/*info.sessionGuid*/ info}_ind${rowIndex}`}
                          className={classes.sessionRow}>
                          {[...new Array(7)].map((i, dayIndex) => (
                            <DayDisplay
                              todayStyle={true}
                              key={dayIndex}
                              entry={AdherenceUtility.getItemFromByDayEntries(
                                item.byDayEntries,
                                dayIndex,
                                rowIndex
                              )}
                              isCompliant={
                                item.weeklyAdherencePercent >=
                                AdherenceService.COMPLIANCE_THRESHOLD
                              }
                              timeZone={item.clientTimeZone}
                              dayWidth={dayWidthInPx}
                              sessionSymbol={info.sessionSymbol}
                              numOfWin={AdherenceUtility.getMaxNumberOfTimeWindows(
                                adherenceWeeklyReport.items
                              )}
                              border={dayIndex !== 6}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <Box
                key="adherence"
                className={clsx(
                  classes.adherenceCell,
                  item.weeklyAdherencePercent <
                    AdherenceService.COMPLIANCE_THRESHOLD && classes.red
                )}>
                {item.progression === 'unstarted'
                  ? '-! '
                  : `${item.weeklyAdherencePercent}%`}
              </Box>
            </div>
          )
        )}
      </div>
    )
  }

export default AdherenceParticipantsGrid
