import {ReactComponent as EditIcon} from '@assets/edit_pencil_red.svg'
import {ReactComponent as BurstIcon} from '@assets/scheduler/burst_icon.svg'
import ConfirmationDialog from '@components/widgets/ConfirmationDialog'
import ErrorDisplay from '@components/widgets/ErrorDisplay'
import {
  DialogButtonPrimary,
  DialogButtonSecondary,
} from '@components/widgets/StyledComponents'
import {
  Box,
  Button,
  CircularProgress,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  makeStyles,
  Theme,
} from '@material-ui/core'
import ScheduleService from '@services/schedule.service'
import {latoFont, poppinsFont, theme} from '@style/theme'
import {
  DWsEnum,
  PerformanceOrder,
  Schedule,
  SessionSchedule,
  StudySession,
} from '@typedefs/scheduling'
import {ExtendedError} from '@typedefs/types'
import _ from 'lodash'
import React from 'react'
import {useErrorHandler} from 'react-error-boundary'
import NavigationPrompt from 'react-router-navigation-prompt'
import {useSchedule, useUpdateSchedule} from '../scheduleHooks'
import {useStudy} from '../studyHooks'
import AssessmentList from './AssessmentList'
import ConfigureBurstTab from './ConfigureBurstTab'
import Duration from './Duration'
import SchedulableSingleSessionContainer from './SchedulableSingleSessionContainer'
import actionsReducer, {
  ActionTypes,
  SessionScheduleAction,
} from './scheduleActions'
import ScheduleTimelineDisplay from './ScheduleTimelineDisplay'
import SessionStartTab from './SessionStartTab'

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sessionContainer: {
      marginBottom: theme.spacing(2),
      display: 'flex',
      '&:last-child': {
        marginBottom: 0,
      },
    },
    labelDuration: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
    },
    burstButton: {
      fontFamily: poppinsFont,
      display: 'flex',
      float: 'right',

      fontSize: '14px',
      '& svg': {marginRight: theme.spacing(1)},
    },

    scheduleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: theme.spacing(2),
    },

    assessments: {
      width: '286px',
      flexGrow: 0,
      flexShrink: 0,
      padding: theme.spacing(1),
      backgroundColor: '#BCD5E4',
    },
    row: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  })
)

export type SchedulerErrorType = {
  errors: any
  entity: any
}
type ScheduleCreatorTabProps = {
  id: string
  onNavigate: Function
  children: React.ReactNode
  onShowFeedback: Function
}

type SaveHandle = {
  save: (a: number) => void
}

const ScheduleCreatorTab: React.ForwardRefRenderFunction<
  SaveHandle,
  ScheduleCreatorTabProps
> = (
  {id, onNavigate, children, onShowFeedback}: ScheduleCreatorTabProps,
  ref
) => {
  const classes = useStyles()

  const {data: study, error, isLoading} = useStudy(id)
  const {data: _schedule} = useSchedule(id)

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateSchedule,
    data,
  } = useUpdateSchedule()

  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [schedulerErrors, setScheduleErrors] = React.useState<
    SchedulerErrorType[]
  >([]) //ALINA TODO

  const handleError = useErrorHandler()
  const [saveLoader, setSaveLoader] = React.useState(false)

  const [schedule, setSchedule] = React.useState<Schedule | undefined>()
  // console.log('%c ---scheduler update--' + study?.version, 'color: red')

  const [schedulerErrorState, setSchedulerErrorState] = React.useState(
    new Map<
      string,
      {
        generalErrorMessage: string[]
        sessionWindowErrors: Map<number, string>
        notificationErrors: Map<number, string>
      }
    >()
  )

  const [openModal, setOpenModal] = React.useState<
    'EVENTS' | 'BURSTS' | undefined
  >(undefined)
  const [openStudySession, setOpenStudySession] = React.useState<
    StudySession | undefined
  >()

  type SessionStartHandle = React.ElementRef<typeof SessionStartTab>
  const ref1 = React.useRef<SessionStartHandle>(null) // assign null makes it compatible with elements.

  type ConfigureBurstHandle = React.ElementRef<typeof ConfigureBurstTab>
  const ref2 = React.useRef<ConfigureBurstHandle>(null)

  React.useImperativeHandle(ref, () => ({
    save(step: number) {
      onSave().then(x => onNavigate(step))
    },
  }))
  React.useEffect(() => {
    const newErrorState = parseErrors(schedulerErrors)
    setSchedulerErrorState(newErrorState)
  }, [schedulerErrors])

  React.useEffect(() => {
    if (_schedule) {
      console.log('----setting schedule----')

      setSchedule(_schedule)
    }
  }, [_schedule])

  if (!schedule?.sessions) {
    return <>...loading</>
  }

  const getOpenStudySession = () => {
    return schedule.sessions.find(s => s.guid === openStudySession!.guid)!
  }

  const onCancelSessionUpdate = () => {
    setSchedule(_schedule)
    setHasObjectChanged(false)
  }

  const onSave = async (isButtonPressed?: boolean) => {
    console.log('starting save')
    setScheduleErrors([])
    setSaveLoader(true)
    let error: Error | undefined = undefined
    console.log('sacing', schedule.duration)
    try {
      const result = await mutateSchedule({
        studyId: id,
        schedule,
        action: 'UPDATE',
      })
      setHasObjectChanged(false)
    } catch (e) {
      console.log('ERROR IN SCHEDULER', e)

      if ((e as ExtendedError).statusCode === 401) {
        handleError(e)
      }

      const entity = (e as ExtendedError).entity
      const errors = (e as ExtendedError).errors
      // This can occur when a request fails due to reasons besides bad user input.
      if (!errors || !entity) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        // alina todo
        console.log('todo')
        // setError(prev => [...prev, e.message])
        error = e as ExtendedError
      } else {
        const errorObject = {
          entity: entity,
          errors: errors,
        }
        error = new Error('!')
        setScheduleErrors(prev => [...prev, errorObject])
      }
    } finally {
      setSaveLoader(false)
      if (isButtonPressed) {
        onShowFeedback(error)
      }
    }
  }

  function parseErrors(_schedulerErrors: SchedulerErrorType[]) {
    const newErrorState = new Map()
    for (const error of _schedulerErrors) {
      const {entity, errors} = error
      const ks = Object.keys(errors)
      ks.forEach((key, index) => {
        const keyArr = key.split('.')
        //first session, timewindow, message
        var numberPattern = /\d+/g
        let windowIndex
        let notificationIndex
        const sessionIndex = _.first(keyArr[0]?.match(numberPattern))
        // This should not happen
        if (!sessionIndex) return
        // if 3 levels - assume window
        if (keyArr.length > 2) {
          if (keyArr[1].startsWith('notifications')) {
            // notfication error
            notificationIndex = _.first(keyArr[1]?.match(numberPattern))
          } else {
            // assume window error
            windowIndex = _.first(keyArr[1]?.match(numberPattern))
          }
        }
        const errorType = keyArr[keyArr.length - 1]
        const currentError = errors[key]
        const errorMessage = currentError
          .map((error: string) => error.replace(key, ''))
          .join(',')

        const sessionName = entity.sessions[sessionIndex[0]].name
        const wholeErrorMessage = errorType + errorMessage

        const windowNumber = windowIndex ? parseInt(windowIndex) + 1 : undefined
        const notificationNumber = notificationIndex
          ? parseInt(notificationIndex) + 1
          : undefined
        const sessionKey = `${sessionName}-${parseInt(sessionIndex) + 1}`

        let currentErrorState: any
        if (newErrorState.has(sessionKey)) {
          currentErrorState = newErrorState.get(sessionKey)
        } else {
          currentErrorState = {
            generalErrorMessage: [],
            sessionWindowErrors: new Map<number, string>(),
            notificationErrors: new Map<number, string>(),
          }
        }

        if (windowNumber) {
          currentErrorState?.sessionWindowErrors.set(
            windowNumber,
            wholeErrorMessage
          )
        } else if (notificationNumber) {
          currentErrorState?.notificationErrors.set(
            notificationNumber,
            wholeErrorMessage
          )
        } else {
          currentErrorState!.generalErrorMessage.push(wholeErrorMessage)
        }
        newErrorState.set(sessionKey, currentErrorState)
      })
    }
    return newErrorState
  }

  //setting new state
  const updateScheduleData = (schedule: Schedule) => {
    setSchedule(schedule)
    console.log('updated')
    setHasObjectChanged(true)
    //ALINA TODO onUpdate(schedule)
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions!, action)
    const newSchedule = {...schedule, sessions}
    updateScheduleData(newSchedule)
  }

  if (_.isEmpty(schedule.sessions)) {
    return (
      <Box textAlign="center" mx="auto">
        <ErrorDisplay>
          You need to create sessions before creating the schedule
        </ErrorDisplay>
      </Box>
    )
  }
  if (!study) {
    return <span>...loading</span>
  }

  return (
    <>
      <Box>
        <NavigationPrompt when={hasObjectChanged} key="prompt">
          {({onConfirm, onCancel}) => (
            <ConfirmationDialog
              isOpen={hasObjectChanged}
              type={'NAVIGATE'}
              onCancel={onCancel}
              onConfirm={onConfirm}
            />
          )}
        </NavigationPrompt>
        <div>{saveLoader && <CircularProgress />}</div>

        <Box textAlign="left" key="content">
          {/* <ObjectDebug data={timeline} label=""></ObjectDebug> */}
          <div className={classes.scheduleHeader} key="intro">
            <Box>
              <FormControlLabel
                classes={{label: classes.labelDuration}}
                label="Study duration:"
                style={{fontSize: '14px', marginRight: '4px'}}
                labelPlacement="start"
                control={
                  <Duration
                    maxDurationDays={1825}
                    isShowClear={false}
                    onChange={e => {
                      updateScheduleData({
                        ...schedule,
                        duration: e.target.value,
                      })
                    }}
                    durationString={schedule.duration || ''}
                    unitLabel="study duration unit"
                    numberLabel="study duration number"
                    unitData={DWsEnum}></Duration>
                }
              />
              <Button variant="outlined" onClick={() => onSave(true)}>
                {' '}
                Save
              </Button>
              <Box
                fontSize="12px"
                ml={2}
                fontFamily={latoFont}
                fontWeight="bold">
                The study duration must be shorter than 5 years.
              </Box>
            </Box>

            {hasObjectChanged && (
              <div
                style={{
                  position: 'fixed',
                  zIndex: 2000,
                  right: '10px',
                  top: '5px',
                  fontSize: '40px',
                  fontWeight: 'bold',
                  color: 'blue',
                }}>
                *
              </div>
            )}
          </div>
          <Box bgcolor="#fff" p={2} pb={0} mt={3} key="scheduler">
            <Button
              className={classes.burstButton}
              onClick={() => setOpenModal('BURSTS')}>
              <BurstIcon /> Configure Study Bursts
            </Button>

            <ScheduleTimelineDisplay
              studyId={id}
              onSelectSession={(session: StudySession) => {
                setOpenStudySession(session)
              }}
              schedule={schedule}></ScheduleTimelineDisplay>
          </Box>
        </Box>
      </Box>
      <Dialog open={openModal === 'EVENTS'} maxWidth="md">
        <DialogTitle>
          <EditIcon />
          &nbsp;&nbsp; Edit Session Start Drop Down
        </DialogTitle>
        <DialogContent style={{padding: 0}}>
          <SessionStartTab
            ref={ref1}
            study={study!}
            eventIdsInSchedule={ScheduleService.getEventIdsForSchedule(
              schedule
            )}
            onNavigate={() => setOpenModal(undefined)}
          />
        </DialogContent>
        <DialogActions>
          <DialogButtonSecondary onClick={() => setOpenModal(undefined)}>
            Cancel
          </DialogButtonSecondary>

          <DialogButtonPrimary
            onClick={() => {
              console.log('about to save')
              console.log(ref1.current)
              ref1.current?.save()
            }}>
            Save Changes
          </DialogButtonPrimary>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openStudySession !== undefined}
        maxWidth="lg"
        scroll={'paper' /*body"*/}>
        <DialogContent style={{padding: 0}}>
          {openStudySession && (
            <Box
              className={classes.sessionContainer}
              key={getOpenStudySession().guid}
              border={
                schedulerErrorState.get(
                  `${openStudySession.name}-${
                    schedule.sessions.findIndex(
                      s => s.guid === openStudySession.guid
                    ) + 1
                  }`
                )
                  ? `1px solid ${theme.palette.error.main}`
                  : ''
              }>
              <Box className={classes.assessments}>
                <AssessmentList
                  studySessionIndex={schedule.sessions.findIndex(
                    s => s.guid === openStudySession.guid
                  )}
                  studySession={getOpenStudySession()}
                  onChangePerformanceOrder={(
                    performanceOrder: PerformanceOrder
                  ) => {
                    const schedule = {
                      ...getOpenStudySession(),
                      performanceOrder,
                    }

                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: {
                        sessionId: getOpenStudySession().guid!,
                        schedule,
                      },
                    })
                  }}
                  performanceOrder={
                    getOpenStudySession().performanceOrder || 'sequential'
                  }
                />
              </Box>
              {/* This is what is being displayed as the card */}
              <SchedulableSingleSessionContainer
                onOpenEventsEditor={() => setOpenModal('EVENTS')}
                key={getOpenStudySession().guid}
                customEvents={study?.customEvents}
                studySession={getOpenStudySession()}
                burstOriginEventId={
                  _.first(schedule.studyBursts)?.originEventId
                }
                onUpdateSessionSchedule={(
                  schedule: SessionSchedule,
                  shouldInvalidateBurst: boolean
                ) => {
                  scheduleUpdateFn({
                    type: ActionTypes.UpdateSessionSchedule,
                    payload: {
                      sessionId: getOpenStudySession().guid!,
                      schedule,
                      shouldInvalidateBurst,
                    },
                  })
                }}
                sessionErrorState={schedulerErrorState.get(
                  `${getOpenStudySession().name}-${
                    schedule.sessions.findIndex(
                      s => s.guid === openStudySession.guid
                    ) + 1
                  }`
                )}></SchedulableSingleSessionContainer>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <DialogButtonSecondary
            onClick={() => {
              onCancelSessionUpdate()
              setOpenStudySession(undefined)
            }}>
            Cancel
          </DialogButtonSecondary>

          <DialogButtonPrimary
            onClick={() => {
              onSave(true).then(() => setOpenStudySession(undefined))
              // console.log(ref1.current)
              // ref1.current?.save()

              //setIsOpenEventsEditor(false)
            }}>
            {saveLoader ? <CircularProgress /> : <span>Save Changes</span>}
          </DialogButtonPrimary>
        </DialogActions>
      </Dialog>
      <Dialog open={openModal === 'BURSTS'} maxWidth="md">
        <DialogTitle>
          <BurstIcon />
          &nbsp;&nbsp; Configure Study bursts
        </DialogTitle>
        <DialogContent style={{padding: 0}}>
          <ConfigureBurstTab
            schedule={schedule}
            ref={ref2}
            id={study!.identifier}
            onNavigate={() => setOpenModal(undefined)}
          />
        </DialogContent>
        <DialogActions>
          <DialogButtonSecondary onClick={() => setOpenModal(undefined)}>
            Cancel
          </DialogButtonSecondary>

          <DialogButtonPrimary
            onClick={() => {
              console.log('about to save')
              console.log(ref2.current)
              ref2.current?.save()

              //setIsOpenEventsEditor(false)
            }}>
            Update burst to Schedule
          </DialogButtonPrimary>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default React.forwardRef(ScheduleCreatorTab)
