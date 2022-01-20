import {ReactComponent as Arrow} from '@assets/arrow_long.svg'
import {
  PlotDaysDisplay,
  useGetPlotAndUnitWidth,
} from '@components/studies/scheduler/timeline-plot/TimelineBurstPlot'
import {Box, makeStyles} from '@material-ui/core'
import AdherenceService from '@services/adherence.service'
import ParticipantService from '@services/participants.service'
import {theme} from '@style/theme'
import {AdherenceWeeklyReport} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {Link} from 'react-router-dom'
import AdherenceUtility from '../adherenceUtility'
import DayDisplayForSession from '../DayDisplayForSession'
import {useCommonStyles} from '../styles'

export const useStyles = makeStyles(theme => ({
  participantRow: {
    display: 'flex',
    borderBottom: '4px solid #fbfbfb',
    padding: theme.spacing(2),
    alignitems: 'center',
  },
  sessionRow: {
    margin: '4px 0',
    display: 'flex',
    alignItems: 'center',
    height: '20px',
  },
  nextActivity: {
    textAlign: 'center',
    marginRight: theme.spacing(1),
    background:
      'linear-gradient(to bottom, #fff 10px, #333 10px 11px, #fff 11px )',
    '& span': {
      backgroundColor: '#fff',
      padding: theme.spacing(0, 3),
    },
  },
}))

type AdherenceParticipantsGridProps = {
  studyId: string
  //token: string
  adherenceWeeklyReport: AdherenceWeeklyReport[]
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
          AdherenceUtility.getMaxNumberOfTimeWindows(adherenceWeeklyReport)
        )
      }
    }, [adherenceWeeklyReport])

    const getLabel = (label: string): string => {
      //label format:
      //
      // nonburst: "Week 4 : Session #1 Circle
      //burst: ""custom_Event 2_burst 1 : Week 3 : Session #2 Triangl""

      const labelArray = label.split(':')
      const sessionName = labelArray[labelArray.length - 1]
      const week = labelArray[labelArray.length - 2]
      const event = labelArray.length === 3 ? labelArray[0] : undefined
      return week
    }

    return (
      <div ref={ref} style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', marginBottom: '16px'}}>
          <Box width={theme.spacing(11)}>Participant</Box>
          <Box width={theme.spacing(11)}>Schedule</Box>
          <div style={{marginLeft: '-117px'}}>
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
        {adherenceWeeklyReport.map((a, index) => (
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
              {a.rowLabels.length === 0 ? (
                <div key={`nothing`} className={classes.sessionRow}>
                  <Box key="label" width={theme.spacing(11)}>
                    <Arrow style={{transform: 'scaleX(-1)'}} />
                  </Box>
                  <div
                    className={classes.nextActivity}
                    style={{
                      width: `${dayWidthInPx * 7}px`,
                    }}>
                    <span>
                      Up Next: {a.nextActivity.sessionName} on{' '}
                      {new Date(a.nextActivity.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <Box
                    key="adherence"
                    style={{borderRight: 'none'}}
                    className={classes.dayCell}>
                    {' '}
                    -
                  </Box>
                </div>
              ) : (
                a.rowLabels.map((label, index) => (
                  <div key={`${label}`} className={classes.sessionRow}>
                    <Box
                      key="label"
                      width={theme.spacing(11)}
                      borderRight={'1px solid black'}>
                      {getLabel(label)}
                    </Box>
                    {[...new Array(7)].map((i, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={classes.dayCell}
                        style={{width: `${dayWidthInPx}px`}}>
                        <DayDisplayForSession
                          sequentialDayNumber={dayIndex}
                          byDayEntries={a.byDayEntries}
                          maxNumberOfTimeWindows={3}
                          isCompliant={
                            a.weeklyAdherencePercent >=
                            AdherenceService.COMPLIANCE_THRESHOLD
                          }
                          propertyName="label"
                          propertyValue={label}
                        />
                      </div>
                    ))}
                    <Box
                      key="adherence"
                      style={{borderRight: 'none'}}
                      className={classes.dayCell}>
                      {' '}
                      {a.weeklyAdherencePercent}%
                    </Box>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

export default AdherenceParticipantsGrid
