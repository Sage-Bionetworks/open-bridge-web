import {
  MTBHeadingH1,
  MTBHeadingH2,
  MTBHeadingH4,
} from '@components/widgets/Headings'
import SaveButton from '@components/widgets/SaveButton'
import SmallTextBox from '@components/widgets/SmallTextBox'
import {
  Box,
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  makeStyles,
  Paper,
  Theme,
} from '@material-ui/core'
import {ToggleButton, ToggleButtonGroup} from '@material-ui/lab'
import {latoFont, poppinsFont} from '@style/theme'
import {Schedule, StudyBurst, StudySession} from '@typedefs/scheduling'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import {useSchedule, useUpdateSchedule} from '../scheduleHooks'
import {TooltipHoverDisplay} from './ScheduleTimelineDisplay'
import TimelineBurstPlot from './timeline-plot/TimelineBurstPlot'

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
    eventSessionCard: {
      padding: theme.spacing(5, 5, 5, 5),
      marginBottom: theme.spacing(3),
      '&:hover': {
        border: '1px solid black',
      },
      '&.selected': {
        border: '1px solid black',
      },
    },
    burstBox: {
      display: 'flex',
      padding: theme.spacing(8, 0),
      border: '1px solid black',
      margin: theme.spacing(8, 3, 4, 3),

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

    burstDesignHeading: {
      fontFamily: poppinsFont,
      fontSize: '18px',
      lineHeight: '27px',
    },
    setBurstInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',

      '& input': {
        backgroundColor: '#FFF509',
      },
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
  })
)

type ConfigureBurstTabProps = {
  id: string
  onNavigate: Function
  children: React.ReactNode
}

type SaveHandle = {
  save: (a: number) => void
}

const HasBurstsSC: React.FunctionComponent<{
  hasBursts: boolean
  setHasBursts: (hasBursts: boolean) => void
}> = ({hasBursts, setHasBursts}) => {
  const classes = useStyles()
  return (
    <>
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
    </>
  )
}

const BurstSelectorSC: React.FunctionComponent<{
  schedule: Schedule
  burstSessionGuids: string[]
  triggerEventId: string | undefined
  onUpdateEvent: (eventId: string) => void
  onUpdateSessionSelection: (guids: string[]) => void
}> = ({
  schedule,
  burstSessionGuids,
  onUpdateSessionSelection,
  triggerEventId,
  onUpdateEvent,
}) => {
  const classes = useStyles()
  const burstEventId = schedule.studyBursts?.[0]?.originEventId
  const updatedSessions = schedule.sessions.map(s =>
    _.isEmpty(s.studyBurstIds) ? s : {...s, startEventIds: [burstEventId || '']}
  )
  const groups = _.groupBy(updatedSessions, 'startEventIds.0')

  const updateSelection = (guid: string, isSelected: boolean) => {
    if (isSelected) {
      onUpdateSessionSelection([...burstSessionGuids, guid!])
    } else {
      onUpdateSessionSelection(burstSessionGuids.filter(g => g !== guid))
    }
  }
  const isEventSelected = (key: string) => triggerEventId === key

  const selectEvent = (key: string) => {
    if (!isEventSelected(key)) {
      onUpdateEvent(key)
    }
    onUpdateSessionSelection([])
  }

  const eventKeys = Object.keys(groups) //.filter(group =>
  //group.includes(constants.constants.CUSTOM_EVENT_PREFIX)
  //)
  //debugger
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}>
      <MTBHeadingH2 style={{maxWidth: '290px', marginBottom: '40px'}}>
        What scheduled session(s) in your study should be repeated as a burst?
      </MTBHeadingH2>
      {eventKeys.map(key => (
        <Paper
          key={`event_${key}`}
          elevation={3}
          className={clsx(
            classes.eventSessionCard,
            isEventSelected(key) && 'selected'
          )}
          onClick={() => selectEvent(key)}>
          <MTBHeadingH4>Sessions associated with {key} </MTBHeadingH4>
          {groups[key].map(s => (
            <FormControlLabel
              key={s.guid}
              control={
                <Checkbox
                  color="secondary"
                  classes={{checked: classes.checked}}
                  checked={burstSessionGuids.includes(s.guid!)}
                  onChange={e => updateSelection(s.guid!, e.target.checked)}
                  name="isburst"
                  style={{
                    visibility: isEventSelected(key) ? 'visible' : 'hidden',
                  }}
                />
              }
              label={
                <TooltipHoverDisplay
                  session={s}
                  index={schedule.sessions.findIndex(
                    session => session.guid === s.guid
                  )}
                  getSession={() => {
                    return {label: s.name}
                  }}
                />
              }></FormControlLabel>
          ))}
        </Paper>
      ))}
    </div>
  )
}
const BurstScheduleSC: React.FunctionComponent<{
  burstFrequency?: number
  burstNumber?: number

  onChange: (type: 'F' | 'N', value: number) => void
}> = ({burstFrequency, burstNumber, onChange}) => {
  const classes = useStyles()
  return (
    <div className={classes.setBurstInfoContainer}>
      <MTBHeadingH2 style={{textAlign: 'left', maxWidth: '300px'}}>
        How often should this burst be scheduled to repeat?
      </MTBHeadingH2>
      <FormGroup className={classes.burstSchedule}>
        <FormControl fullWidth className={classes.row}>
          <InputLabel htmlFor="burst-freq" className={classes.assignBurstText}>
            Gap between bursts:
          </InputLabel>
          <SmallTextBox
            value={burstFrequency || ''}
            isLessThanOneAllowed={false}
            onChange={e => onChange('F', Number(e.target.value))}
          />
          weeks
        </FormControl>
        <FormControl fullWidth className={classes.row}>
          <InputLabel
            htmlFor="burst-num"
            style={{marginRight: '24px'}}
            className={classes.assignBurstText}>
            For:
          </InputLabel>
          <SmallTextBox
            isLessThanOneAllowed={false}
            value={burstNumber || ''}
            onChange={e => onChange('N', Number(e.target.value))}
          />
          bursts
        </FormControl>
      </FormGroup>
    </div>
  )
}

const ConfigureBurstTab: React.ForwardRefRenderFunction<
  SaveHandle,
  ConfigureBurstTabProps
> = ({onNavigate, id, children}: ConfigureBurstTabProps, ref) => {
  const classes = useStyles()

  React.useImperativeHandle(ref, () => ({
    save(step: number) {
      onNavigate(step)
    },
  }))

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateSchedule,
    data,
  } = useUpdateSchedule()
  const {data: schedule} = useSchedule(id)
  const [hasBursts, setHasBursts] = React.useState(false)
  const [originEventId, setOriginEventId] = React.useState<string | undefined>()
  const [burstSessionGuids, setBurstSessionGuids] = React.useState<string[]>([])
  const [burstNumber, setBurstNumber] = React.useState<number | undefined>()
  const [burstFrequency, setBurstFrequency] = React.useState<
    number | undefined
  >()

  React.useEffect(() => {
    if (!schedule) {
      return
    }

    const burst = schedule.studyBursts?.[0]
    if (!burst) {
      setHasBursts(false)
      setBurstFrequency(undefined)
      setBurstNumber(undefined)
      setOriginEventId(undefined)
      return
    }
    setHasBursts(true)
    setOriginEventId(burst.originEventId)
    setBurstNumber(burst.occurrences)
    setBurstSessionGuids([])
    setBurstFrequency(Number(burst.interval.replace(/[PW]/g, '')))
    const sessionGuids = schedule.sessions.reduce((prev, current) => {
      if (current.studyBurstIds?.[0]) {
        return [...prev, current.guid!]
      } else {
        return prev
      }
    }, [] as string[])
    console.log(sessionGuids)
    setBurstSessionGuids(sessionGuids.filter(g => !!g))
    console.log(burstSessionGuids)
  }, [schedule])

  function restoreSessionsFromBursts(schedule: Schedule): StudySession[] {
    var previousBurst = schedule?.studyBursts?.[0]
    if (previousBurst === undefined) {
      return [...schedule.sessions]
    } else {
      const sessions = schedule.sessions.map(s =>
        //if no bursts -- nothing needs to be done
        _.isEmpty(s.studyBurstIds)
          ? s
          : {
              ...s,
              studyBurstIds: [],
              startEventIds: [previousBurst!.originEventId],
            }
      )
      return sessions
    }
  }

  const save = async () => {
    if (!burstFrequency || !burstNumber || !schedule || !originEventId) {
      return
    }

    //1. restore all of the startEventId
    const sessions = restoreSessionsFromBursts(schedule)

    //create burst
    const burst: StudyBurst = {
      identifier: `${originEventId.replace(':', '_')}_burst`,
      originEventId: originEventId,
      interval: `P${burstFrequency}W`,
      occurrences: burstNumber,
      updateType: 'mutable',
    }

    //update sessions, remove startEventId
    const sessionsWithBurst = sessions.map(s =>
      burstSessionGuids.includes(s.guid!)
        ? {...s, studyBurstIds: [burst.identifier], startEventIds: []}
        : s
    )
    console.log('guids', burstSessionGuids)

    const updatedSchedule = {
      ...schedule,
      sessions: sessionsWithBurst,
      studyBursts: [burst],
    }
    try {
      await mutateSchedule({
        studyId: id,
        schedule: updatedSchedule,
        action: 'UPDATE',
      })
    } catch (e) {
      alert(e)
    }
  }

  const clearBursts = async () => {
    //update sessions

    if (!schedule) {
      return
    }
    const sessions = restoreSessionsFromBursts(schedule)

    const updatedSchedule = {...schedule, sessions, studyBursts: []}
    try {
      await mutateSchedule({
        studyId: id,
        schedule: updatedSchedule,
        action: 'UPDATE',
      })
    } catch (e) {
      alert(e)
    }
  }
  return (
    <div className={classes.root}>
      <HasBurstsSC
        hasBursts={hasBursts}
        setHasBursts={(hasBursts: boolean) => {
          if (!hasBursts) {
            clearBursts()
          }
          setHasBursts(hasBursts)
        }}
      />

      {hasBursts && schedule && (
        <Box textAlign="center" mb={4}>
          <div className={classes.burstBox}>
            <BurstSelectorSC
              schedule={schedule}
              burstSessionGuids={burstSessionGuids}
              triggerEventId={originEventId}
              onUpdateEvent={(eventId: string) => setOriginEventId(eventId)}
              onUpdateSessionSelection={(guids: string[]) =>
                setBurstSessionGuids(guids)
              }
            />

            <div className={classes.setBurstInfoContainer}>
              <BurstScheduleSC
                burstFrequency={burstFrequency}
                burstNumber={burstNumber}
                onChange={(type: 'N' | 'F', value: number) => {
                  if (type === 'F') {
                    setBurstFrequency(value)
                  } else {
                    setBurstNumber(value)
                  }
                }}
              />
            </div>
          </div>

          <SaveButton onClick={save} />
        </Box>
      )}

      {schedule && hasBursts && (
        <>
          <Box py={3} px={0}>
            <TimelineBurstPlot
              studyId={id}
              // schedulingItems={timeline?.schedule || []}
            ></TimelineBurstPlot>
          </Box>
        </>
      )}
    </div>
  )
}

export default React.forwardRef(ConfigureBurstTab)
