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
import DayDisplayForSession from '../DayDisplayForSession'
import {useCommonStyles} from '../styles'
import NextActivity from './NextActivity'

export const useStyles = makeStyles(theme => ({
  participantRow: {
    display: 'flex',
    borderBottom: '4px solid #fbfbfb',
    padding: theme.spacing(2),
    alignitems: 'center',
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
    const {unitWidth: dayWidthInPx} = useGetPlotAndUnitWidth(ref, 7, 250)
    const [maxNumbrOfTimeWindows, setMaxNumberOfTimeWinsows] = React.useState(1)

    React.useEffect(() => {
      if (adherenceWeeklyReport) {
        setMaxNumberOfTimeWinsows(
          AdherenceUtility.getMaxNumberOfTimeWindows(
            adherenceWeeklyReport.items
          )
        )
      }
    }, [adherenceWeeklyReport])

    return (
      <div ref={ref} style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', marginBottom: '16px'}}>
          <Box width={theme.spacing(11)}>Participant</Box>
          <Box width={theme.spacing(11)}>Schedule</Box>
          <div style={{marginLeft: '-100px'}}>
            <PlotDaysDisplay
              title=""
              unitWidth={dayWidthInPx}
              endLabel={
                <div
                  className={classes.adherenceLabel}
                  style={{
                    width: `${dayWidthInPx}px`,
                    left: `${dayWidthInPx * 7 + 16}px`,
                    top: '0px',
                  }}>
                  Adh
                  <br />%
                </div>
              }
            />
          </div>
        </div>
        {adherenceWeeklyReport.items.map((a, index) => (
          <div
            key={`${a.participant}_${index}`}
            className={classes.participantRow}>
            <Box width={theme.spacing(11)} key={'pIdentifier'}>
              <Link to={`adherence/${a.participant.identifier}`}>
                {ParticipantService.formatExternalId(
                  studyId,
                  a.participant.externalId
                )}
              </Link>
            </Box>
            <div key={'data'}>
              {a.rows.length === 0 ? (
                <NextActivity dayPxWidth={dayWidthInPx} info={a.nextActivity} />
              ) : (
                a.rows.map((info, rowIndex) => (
                  <div
                    key={`${/*info.sessionGuid*/ info}_ind${rowIndex}`}
                    className={classes.sessionRow}>
                    <Tooltip title={info.label}>
                      <Box
                        key="label"
                        width={theme.spacing(11)}
                        fontSize={'12px'}
                        lineHeight={0.8}
                        borderRight={'1px solid black'}>
                        {
                          /*AdherenceUtility.getDisplayFromLabel(info.label)*/
                          `Week ${info.week}`
                        }
                      </Box>
                    </Tooltip>
                    {[...new Array(7)].map((i, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={classes.dayCell}
                        style={{
                          width: `${dayWidthInPx}px`,
                          borderRight:
                            dayIndex === 6 ? 'none' : '1px solid black',
                        }}>
                        <DayDisplayForSession
                          sequentialDayNumber={dayIndex}
                          byDayEntries={a.byDayEntries}
                          sessionSymbol={info.sessionSymbol}
                          maxNumberOfTimeWindows={maxNumbrOfTimeWindows}
                          isCompliant={
                            a.weeklyAdherencePercent >=
                            AdherenceService.COMPLIANCE_THRESHOLD
                          }
                          entryIndex={rowIndex}
                          propertyName="sessionGuid"
                          timeZone={a.clientTimeZone}
                          propertyValue={info.sessionGuid}
                        />
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
            <Box
              key="adherence"
              className={clsx(
                classes.adherenceCell,
                a.weeklyAdherencePercent <
                  AdherenceService.COMPLIANCE_THRESHOLD && classes.red
              )}>
              {' '}
              {a.weeklyAdherencePercent}%
            </Box>
          </div>
        ))}
      </div>
    )
  }

export default AdherenceParticipantsGrid
