import {
  Box,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import React from 'react'
import CalendarIcon from '../../../assets/scheduler/calendar_icon.svg'
import {latoFont, poppinsFont} from '../../../style/theme'
import {Schedule} from '../../../types/scheduling'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import SaveButton from '../../widgets/SaveButton'
import SmallTextBox from '../../widgets/SmallTextBox'
import {useSchedule, useTimeline} from '../scheduleHooks'
import {useStudy} from '../studyHooks'
import {TooltipHoverDisplay} from './ScheduleTimelineDisplay'
import BurstTimeline from './timeline-plot/BurstTimeline'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(13, 12, 3, 14),
      textAlign: 'left',
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(13, 3, 3, 3),
      },
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
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(8, 0),
      },
    },
    checked: {
      color: '#FFF509',
      '& .MuiSvgIcon-root': {
        fill: '#FFF509',
        backgroundColor: 'black',
        clipPath: 'polygon(7% 6%, 95% 6%, 95% 95%, 7% 95%)',
      },
    },
    burstSchedule: {
      alignItems: 'flex-end',
      padding: theme.spacing(5, 0, 0, 1),
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
      [theme.breakpoints.down('md')]: {
        padding: theme.spacing(5, 0, 0, 0),
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
    checkBoxStyling: {
      alignItems: 'left',
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(3),
    },
    paragraph: {
      maxWidth: '590px',
      lineHeight: '18px',
      fontSize: '15px',
      fontFamily: latoFont,
    },
    burstSummaryContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      maxWidth: '380px',
      marginTop: theme.spacing(5),
    },
    buttons: {
      border: '1px solid black',
      color: 'black',
      borderRadius: '0px',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      '&:last-child': {
        marginLeft: theme.spacing(2),
        // the left border disappears if this is not added
        border: '1px solid black',
      },
    },
    burstsInfoText: {
      height: '100px',
      width: '100%',
      justifyContent: 'center',
      alignSelf: 'center',
      display: 'flex',
    },
    calendarIcon: {
      width: '20px',
      height: '20px',
      marginRight: theme.spacing(2.5),
    },
    burstDesignHeading: {
      fontFamily: poppinsFont,
      fontSize: '18px',
      lineHeight: '27px',
    },
    setBurstInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    assignBurstText: {
      fontFamily: poppinsFont,
      fontSize: '14px',
      lineHeight: '21px',
      marginRight: theme.spacing(2.5),
    },
    row: {
      display: 'flex',
      alignItems: 'center',
    },
    burstInfoTextContainer: {
      maxWidth: '390px',
      fontFamily: poppinsFont,
      fontSize: '14px',
      lineHeight: '21px',
    },
  })
)

type ConfigureBurstTabProps = {
  id: string
  onNavigate: Function
  children: React.ReactNode
  // hasObjectChanged: boolean
  //saveLoader: boolean
}

type SaveHandle = {
  save: (a: number) => void
}

const ConfigureBurstTab: React.ForwardRefRenderFunction<
  SaveHandle,
  ConfigureBurstTabProps
> = (
  {
    //hasObjectChanged,
    //saveLoader,

    onNavigate,
    id,
    children,
  }: ConfigureBurstTabProps,
  ref
) => {
  const classes = useStyles()

  React.useImperativeHandle(ref, () => ({
    save(step: number) {
      onNavigate(step)
    },
  }))

  const {data: study} = useStudy(id)
  const {data: timeline, error, isLoading} = useTimeline(id)
  const {data: schedule} = useSchedule(id)
  const [hasBursts, setHasBursts] = React.useState(false)
  const [burstSessionGuids, setBurstSessionGuids] = React.useState<string[]>([])
  const [burstNumber, setBurstNumber] = React.useState<number | undefined>()
  const [burstFrequency, setBurstFrequency] = React.useState<
    number | undefined
  >()

  //setting new state
  const updateData = (schedule: Schedule) => {
    // setSchedule(schedule)
    //onUpdate(schedule)
  }

  const displayBurstInfoText =
    schedule && hasBursts && (burstNumber || 0) > 0 && (burstFrequency || 0) > 0
  return (
    <div className={classes.root}>
      <MTBHeadingH1 style={{marginBottom: '24px'}}>Burst Design</MTBHeadingH1>
      <p className={classes.paragraph}>
        A burst design involves repeating multiple study sessions that are
        spaced out over time at regular intervals with long breaks. This is
        intended to maximize longitudinal participation with minimal burden.
      </p>
      <Box className={classes.burstSummaryContainer}>
        <MTBHeadingH2 style={{marginBottom: '24px'}}>
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
            className={classes.buttons}>
            Yes
          </ToggleButton>
          <ToggleButton
            value={false}
            aria-label="no"
            className={classes.buttons}>
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
            <MTBHeadingH2 style={{maxWidth: '290px'}}>
              What scheduled session(s) in your study should be repeated as a
              burst?
            </MTBHeadingH2>
            {schedule && (
              <FormGroup className={classes.checkBoxStyling}>
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
            )}
          </div>
          <div className={classes.setBurstInfoContainer}>
            <MTBHeadingH2 style={{textAlign: 'left', maxWidth: '300px'}}>
              How often should this burst be scheduled to repeat?
            </MTBHeadingH2>
            <FormGroup className={classes.burstSchedule}>
              <FormControl className={classes.row}>
                <InputLabel
                  htmlFor="burst-freq"
                  className={classes.assignBurstText}>
                  Assign a new burst every:
                </InputLabel>
                <SmallTextBox
                  value={burstFrequency || ''}
                  isLessThanOneAllowed={false}
                  onChange={e => setBurstFrequency(Number(e.target.value))}
                />
                weeks
              </FormControl>
              <FormControl fullWidth className={classes.row}>
                <InputLabel htmlFor="burst-num" style={{marginRight: '24px'}}>
                  For:
                </InputLabel>
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
      {displayBurstInfoText && (
        <Box className={classes.burstsInfoText}>
          <Box className={classes.row}>
            <img className={classes.calendarIcon} src={CalendarIcon}></img>
            <Box className={classes.burstInfoTextContainer}>
              Your
              <strong style={{backgroundColor: '#FFF509'}}>
                {' '}
                {burstNumber} burst(s)
              </strong>{' '}
              will be scheduled <strong>{burstFrequency} week(s)</strong> apart.
              Bursts can be rescheduled in the Participant Manager to accomodate
              a participant’s availability.
            </Box>
          </Box>
        </Box>
      )}
      {schedule && hasBursts && (
        <BurstTimeline
          burstSessionGuids={burstSessionGuids}
          burstNumber={burstNumber || 0}
          burstFrequency={burstFrequency || 0}
          schedule={schedule}
          studyId={id}></BurstTimeline>
      )}
    </div>
  )
}

export default React.forwardRef(ConfigureBurstTab)
