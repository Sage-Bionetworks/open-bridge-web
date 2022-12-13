import {MTBHeadingH1, MTBHeadingH2, MTBHeadingH3, MTBHeadingH4} from '@components/widgets/Headings'
import LoadingComponent from '@components/widgets/Loader'
import SessionIcon from '@components/widgets/SessionIcon'
import SmallTextBox from '@components/widgets/SmallTextBox'
import {
  Alert,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Paper,
  Switch,
  Theme,
  Typography,
} from '@mui/material'
import createStyles from '@mui/styles/createStyles'
import makeStyles from '@mui/styles/makeStyles'
import EventService from '@services/event.service'
import ScheduleService from '@services/schedule.service'
import {poppinsFont} from '@style/theme'
import {Schedule, StudyBurst, StudySession} from '@typedefs/scheduling'
import {ExtendedError} from '@typedefs/types'
import clsx from 'clsx'
import _ from 'lodash'
import React from 'react'
import {useUpdateSchedule} from '../../../services/scheduleHooks'
import {TooltipHoverDisplay} from './ScheduleTimelineDisplay'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(2, 12, 3, 11),
      textAlign: 'left',
      [theme.breakpoints.down('lg')]: {
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

      marginTop: theme.spacing(6),

      '& > div': {
        flex: '1 1 0px',
        textAlign: 'center',
        padding: theme.spacing(1, 0, 0, 8),
        '&:first-child': {
          textAlign: 'left',
          borderRight: '1px solid black',
          padding: theme.spacing(1, 8, 0, 0),
        },
      },
    },
    checked: {
      // color: '#FFF509',
      // '& .MuiSvgIcon-root': {
      // fill: '#FFF509',
      //   backgroundColor: 'black',
      //  clipPath: 'polygon(7% 6%, 95% 6%, 95% 95%, 7% 95%)',
      // },
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
      [theme.breakpoints.down('lg')]: {
        padding: theme.spacing(5, 0, 0, 0),
      },
    },

    checkBoxStyling: {
      alignItems: 'left',
      marginTop: theme.spacing(3),
      marginLeft: theme.spacing(3),
    },

    burstDesignHeading: {
      fontFamily: poppinsFont,
      fontSize: '18px',
      lineHeight: '27px',
    },
    setBurstInfoContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',

      '& input': {
        // backgroundColor: '#FFF509',
      },
    },
    assignBurstText: {
      fontFamily: poppinsFont,
      fontSize: '14px',
      lineHeight: '21px',
      whiteSpace: 'normal',
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
  schedule: Schedule
  onNavigate: Function
  hasBursts: boolean
  onSetHasBursts: (hasBursts: boolean) => void
}

type SaveHandle = {
  save: () => void
}

const HasBurstsSC: React.FunctionComponent<{
  hasBursts: boolean
  setHasBursts: (hasBursts: boolean) => void
}> = ({hasBursts, setHasBursts}) => {
  const classes = useStyles()
  return (
    <>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Switch checked={hasBursts} onChange={e => setHasBursts(e.target.checked)} color="primary" />{' '}
        <MTBHeadingH3>{hasBursts ? 'ON' : 'OFF'}</MTBHeadingH3>
      </Box>

      <MTBHeadingH1 style={{marginBottom: '16px'}}>Burst Design</MTBHeadingH1>
      <Typography component="p" variant="body1">
        A burst design involves repeating multiple study sessions tied to an Event that are spaced out over time at
        regular intervals with long breaks. This is intended to maximize longitudinal participation with minimal burden.
      </Typography>
    </>
  )
}

const BurstSelectorSC: React.FunctionComponent<{
  schedule: Schedule
  burstSessionGuids: string[]
  triggerEventId: string | undefined
  onUpdateEvent: (eventId: string) => void
  onUpdateSessionSelection: (guids: string[]) => void
}> = ({schedule, burstSessionGuids, onUpdateSessionSelection, triggerEventId, onUpdateEvent}) => {
  const classes = useStyles()
  const burstEventId = _.first(schedule.studyBursts)?.originEventId
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
          className={clsx(classes.eventSessionCard, isEventSelected(key) && 'selected')}
          onClick={() => selectEvent(key)}>
          <MTBHeadingH4>Sessions associated with {EventService.formatEventIdForDisplay(key)} </MTBHeadingH4>
          {groups[key].map((s, index) => (
            <FormControlLabel
              key={s.guid}
              control={
                <Checkbox
                  classes={{checked: classes.checked}}
                  checked={burstSessionGuids.includes(s.guid!)}
                  onChange={e => updateSelection(s.guid!, e.target.checked)}
                  name="isburst"
                  style={{
                    visibility: isEventSelected(key) || eventKeys.length === 1 ? 'visible' : 'hidden',
                  }}
                />
              }
              label={
                <TooltipHoverDisplay key={s.guid} session={s}>
                  <SessionIcon
                    index={schedule.sessions.findIndex(session => session.guid === s.guid)}
                    key={s.guid}
                    symbolKey={s.symbol}
                    onClick={() => {
                      console.log('selecting')
                    }}>
                    {s.name}
                  </SessionIcon>
                </TooltipHoverDisplay>
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
          <InputLabel htmlFor="burst-num" style={{marginRight: '24px'}} className={classes.assignBurstText}>
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

const ConfigureBurstTab: React.ForwardRefRenderFunction<SaveHandle, ConfigureBurstTabProps> = (
  {onNavigate, id, schedule, hasBursts, onSetHasBursts}: ConfigureBurstTabProps,
  ref
) => {
  const classes = useStyles()

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateSchedule,
    data,
  } = useUpdateSchedule()
  const [saveLoader, setSaveLoader] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>()
  const [originEventId, setOriginEventId] = React.useState<string | undefined>()
  const [burstSessionGuids, setBurstSessionGuids] = React.useState<string[]>([])
  const [burstNumber, setBurstNumber] = React.useState<number | undefined>()
  const [burstFrequency, setBurstFrequency] = React.useState<number | undefined>()

  React.useImperativeHandle(ref, () => ({
    async save() {
      setSaveLoader(true)
      try {
        setError(undefined)
        await onSave()
        onNavigate()
      } catch (error) {
        setError((error as ExtendedError).message)
      } finally {
        setSaveLoader(false)
      }
    },
  }))

  React.useEffect(() => {
    if (!schedule) {
      return
    }

    const burst = ScheduleService.getStudyBurst(schedule)
    if (!burst) {
      onSetHasBursts(false)
      setBurstFrequency(undefined)
      setBurstNumber(undefined)
      setOriginEventId(undefined)
      return
    }
    onSetHasBursts(true)
    setOriginEventId(burst.originEventId)
    setBurstNumber(burst.occurrences)
    setBurstSessionGuids([])
    setBurstFrequency(Number(burst.interval.replace(/[PW]/g, '')))
    const sessionGuids = schedule.sessions.reduce((prev, current) => {
      if (!_.isEmpty(current.studyBurstIds)) {
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
    var previousBurst = ScheduleService.getStudyBurst(schedule)
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

  const onSave = async () => {
    if (!hasBursts) {
      return clearBursts()
    }
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
      burstSessionGuids.includes(s.guid!) ? {...s, studyBurstIds: [burst.identifier], startEventIds: []} : s
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
      <LoadingComponent reqStatusLoading={saveLoader} loaderSize="2rem" variant={'small'} />
      {error && <Alert color="error">{error}</Alert>}
      <HasBurstsSC hasBursts={hasBursts} setHasBursts={onSetHasBursts} />

      {hasBursts && schedule && (
        <Box textAlign="center" mb={4}>
          <div className={classes.burstBox}>
            <BurstSelectorSC
              schedule={schedule}
              burstSessionGuids={burstSessionGuids}
              triggerEventId={originEventId}
              onUpdateEvent={(eventId: string) => setOriginEventId(eventId)}
              onUpdateSessionSelection={(guids: string[]) => setBurstSessionGuids(guids)}
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
        </Box>
      )}
    </div>
  )
}

export default React.forwardRef(ConfigureBurstTab)
