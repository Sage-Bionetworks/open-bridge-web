import {
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  Theme,
  Box,
} from '@material-ui/core'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import React, {FunctionComponent} from 'react'
import {useAsync} from '../../../helpers/AsyncHook'
import StudyService from '../../../services/study.service'
import {latoFont, playfairDisplayFont, poppinsFont} from '../../../style/theme'
import {Schedule} from '../../../types/scheduling'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import SmallTextBox from '../../widgets/SmallTextBox'
import BurstTimeline from './timeline-plot/BurstTimeline'
import {TooltipHoverDisplay} from './ScheduleTimeline'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(13, 7, 3, 7),
      textAlign: 'left',
    },
    burstBox: {
      display: 'flex',
      padding: theme.spacing(8, 5),
      border: '1px solid black',
      margin: theme.spacing(8, 3),

      '& > div': {
        flex: '1 1 0px',
        textAlign: 'center',
        padding: theme.spacing(0, 8),
        '&:first-child': {
          textAlign: 'left',
          borderRight: '1px solid black',
        },
      },
    },
    checked: {
      color: '#FFF509',
      '& .MuiSvgIcon-root': {
        fill: '#FFF509',
        backgroundColor: 'black',
        clipPath: 'polygon(7% 8%, 95% 8%, 95% 94%, 7% 94%)',
      },
    },
    burstSchedule: {
      alignItems: 'flex-end',
      padding: theme.spacing(5, 0, 0, 5),
      marginBottom: theme.spacing(7),

      '& .MuiFormControl-root': {
        flexDirection: 'row',
        marginBottom: theme.spacing(1),
        fontFamily: poppinsFont,
        fontSize: '14px',
        display: 'flex',
        justifyContent: 'flex-end',
        '& label': {
          lineHeight: '21px',
          fontFamily: poppinsFont,
          fontSize: '14px',
          position: 'static',
          transform: 'none',
          maxWidth: '100px',
          textAlign: 'left',
          marginRight: theme.spacing(2),
        },
        '& .MuiTextField-root': {
          marginLeft: theme.spacing(2),
          marginRight: theme.spacing(2),
        },
      },
    },
    toggleButtonRoot: {
      '& .Mui-selected': {
        backgroundColor: '#BCD5E4',
        '&:hover': {
          backgroundColor: '#BCD5E4',
        },
      },
    },
  })
)

type ConfigureBurstTabProps = {
  schedule: Schedule
  onUpdate: Function
  onSave: Function
  token: string
  // hasObjectChanged: boolean
  //saveLoader: boolean
}

const ConfigureBurstTab: FunctionComponent<ConfigureBurstTabProps> = ({
  //hasObjectChanged,
  //saveLoader,
  onUpdate,
  schedule,
  onSave,
  token,
}: ConfigureBurstTabProps) => {
  const classes = useStyles()

  const [hasBursts, setHasBursts] = React.useState(true)
  const [burstSessionGuids, setBurstSessionGuids] = React.useState<string[]>([])
  const [burstNumber, setBurstNumber] = React.useState<number | undefined>()
  const [burstFrequency, setBurstFrequency] = React.useState<
    number | undefined
  >()

  const {data: timeline, status, error, run, setData} = useAsync<any>({
    status: 'PENDING',
    data: [],
  })
  //console.log('rerender')

  React.useEffect(() => {
    console.log('%c ---timeline getting--' + schedule.version, 'color: blue')
    return run(StudyService.getStudyScheduleTimeline(schedule.guid, token!))
  }, [run, schedule.version, token])

  //setting new state
  const updateData = (schedule: Schedule) => {
    // setSchedule(schedule)
    onUpdate(schedule)
  }

  return (
    <div className={classes.root}>
      <MTBHeadingH1
        style={{
          fontStyle: playfairDisplayFont,
          fontSize: '21px',
          lineHeight: '28px',
          marginBottom: '24px',
        }}>
        Burst Design
      </MTBHeadingH1>
      <p
        style={{
          maxWidth: '590px',
          lineHeight: '18px',
          fontSize: '15px',
          fontFamily: latoFont,
        }}>
        A burst design involves repeating multiple study sessions that are
        spaced out over time at regular intervals with long breaks. This is
        intended to maximize longitudinal participation with minimal burden.
      </p>
      <Box
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          maxWidth: '380px',
          marginTop: '40px',
        }}>
        <MTBHeadingH2
          style={{
            fontFamily: poppinsFont,
            fontSize: '18px',
            lineHeight: '27px',
          }}>
          Will your study include a Burst Design?
        </MTBHeadingH2>
        <ToggleButtonGroup
          value={hasBursts}
          exclusive={true}
          classes={{root: classes.toggleButtonRoot}}
          onChange={(e: React.MouseEvent<HTMLElement>, val: boolean) => {
            if (val !== null) {
              setHasBursts(val)
            }
          }}
          aria-label="study includes bursts">
          <ToggleButton
            value={true}
            aria-label="yes"
            style={{
              border: '1px solid black',
              color: 'black',
              borderRadius: '0px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            }}>
            Yes
          </ToggleButton>
          <ToggleButton
            value={false}
            aria-label="no"
            style={{
              marginLeft: '16px',
              border: '1px solid black',
              color: 'black',
              borderRadius: '0px',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            }}>
            No
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {hasBursts && (
        <div className={classes.burstBox}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}>
            <MTBHeadingH2
              style={{
                fontSize: '18px',
                lineHeight: '27px',
                fontStyle: poppinsFont,
                width: '270px',
              }}>
              What scheduled session(s) in your study should be repeated as a
              burst?
            </MTBHeadingH2>

            <FormGroup
              style={{
                alignItems: 'left',
                marginTop: '24px',
                marginLeft: '24px',
              }}>
              {schedule.sessions.map((s, index) => (
                <FormControlLabel
                  key={s.guid}
                  control={
                    <Checkbox
                      color="secondary"
                      classes={{checked: classes.checked}}
                      checked={burstSessionGuids.includes(s.guid!)}
                      onChange={e => {
                        e.target.checked
                          ? setBurstSessionGuids(prev => [...prev, s.guid!])
                          : setBurstSessionGuids(prev =>
                              prev.filter(guid => guid !== s.guid)
                            )
                      }}
                      name="isburst"
                    />
                  }
                  label={
                    <TooltipHoverDisplay
                      session={s}
                      index={index}
                      getSession={() => {
                        return {label: s.name}
                      }}
                    />
                  }></FormControlLabel>
              ))}
            </FormGroup>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <MTBHeadingH2
              style={{
                fontSize: '18px',
                lineHeight: '27px',
                fontStyle: poppinsFont,
                width: '290px',
                textAlign: 'left',
              }}>
              How often should this burst be scheduled to repeat?
            </MTBHeadingH2>
            <FormGroup className={classes.burstSchedule}>
              <FormControl fullWidth>
                <InputLabel htmlFor="burst-freq">
                  Assign a new <br />
                  burst every:
                </InputLabel>
                <SmallTextBox
                  value={burstFrequency || ''}
                  isLessThanOneAllowed={false}
                  onChange={e => setBurstFrequency(Number(e.target.value))}
                />
                weeks
              </FormControl>

              <FormControl fullWidth>
                <InputLabel htmlFor="burst-num">For:</InputLabel>
                <SmallTextBox
                  isLessThanOneAllowed={false}
                  value={burstNumber || ''}
                  onChange={e => setBurstNumber(Number(e.target.value))}
                />
                bursts
              </FormControl>
            </FormGroup>
            <SaveButton />
          </div>
        </div>
      )}
      {schedule && hasBursts && (
        <BurstTimeline
          burstSessionGuids={burstSessionGuids}
          burstNumber={burstNumber || 0}
          burstFrequency={burstFrequency || 0}
          schedule={schedule}
          token={token}></BurstTimeline>
      )}
    </div>
  )
}

export default ConfigureBurstTab
