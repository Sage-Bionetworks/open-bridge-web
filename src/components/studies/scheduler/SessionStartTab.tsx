import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import LoadingComponent from '@components/widgets/Loader'
import Utility from '@helpers/utility'
import {
  Box,
  createStyles,
  FormGroup,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import EventService from '@services/event.service'
import ScheduleService from '@services/schedule.service'
import {latoFont} from '@style/theme'
import clsx from 'clsx'
import _ from 'lodash'
import React, {useEffect} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import CalendarIcon from '../../../assets/scheduler/calendar_icon.svg'
import {SchedulingEvent} from '../../../types/scheduling'
import ErrorDisplay from '../../widgets/ErrorDisplay'
import {MTBHeadingH2} from '../../widgets/Headings'
import {BlueButton} from '../../widgets/StyledComponents'
import {useSchedule} from '../scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '../studyHooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#E5E5E5',
      padding: theme.spacing(6, 7, 3, 7),
    },
    intialLoginContainer: {
      backgroundColor: 'white',
      padding: theme.spacing(1.75, 1),
      maxWidth: '166px',
    },
    paragraphText: {
      fontFamily: latoFont,
      fontSize: '15px',
      lineHeight: '18px',
      '&:first-child': {
        marginBottom: theme.spacing(4),
      },
      '&:last-child': {
        fontStyle: 'italic',
      },
    },
    exampleText: {
      fontStyle: 'italic',
      fontFamily: latoFont,
      fontSize: '15px',
      lineHeight: '18px',
      maxWidth: '240px',
      marginTop: theme.spacing(-0.5),
    },
    input: {
      backgroundColor: 'white',
      marginRight: theme.spacing(0.5),
      padding: theme.spacing(2, 1.25),
      '&:focus': {
        outline: 'none',
      },
      '&:disabled': {
        border: 'none',
      },
      outline: 'none',
    },
    newEventButton: {
      marginTop: theme.spacing(4),
      marginLeft: theme.spacing(0),
    },
    errorText: {
      color: 'red',
      fontFamily: latoFont,
      fontSize: '14px',
      marginTop: theme.spacing(0.75),
    },
    eventInput: {
      alignItems: 'center',
      marginTop: '21px',
      '& $calendarIcon': {
        marginLeft: '-28px',
      },
    },

    calendarIcon: {
      marginRight: theme.spacing(1),
      width: '20px',
      height: '20px',
    },
    errorTextbox: {
      border: '1px solid red',
    },
  })
)

type SessionStartTabProps = {
  onNavigate: Function
  id: string
}

type LocalEventObject = SchedulingEvent & {
  hasError: 'duplicate' | 'word' | undefined
  key: string
}

type SaveHandle = {
  save: (a: number) => void
}

const CalendarIconControl: React.FunctionComponent<any> = React.memo(() => {
  const classes = useStyles()
  return <img src={CalendarIcon} className={classes.calendarIcon}></img>
})

const SessionStartTab: React.ForwardRefRenderFunction<
  SaveHandle,
  SessionStartTabProps
> = ({id, onNavigate}: SessionStartTabProps, ref) => {
  const classes = useStyles()

  React.useImperativeHandle(ref, () => ({
    save(step: number) {
      onNavigate(step)
    },
  }))

  const {data: study, error, isLoading} = useStudy(id)
  const {data: schedule} = useSchedule(id)

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateStudy,
    data,
  } = useUpdateStudyDetail()

  const handleError = useErrorHandler()
  const [saveLoader, setSaveLoader] = React.useState(false)
  const [eventIdsInSchedule, setEventIdsInSchedule] = React.useState<string[]>(
    []
  )

  const onUpdate = async (customEvents: SchedulingEvent[]) => {
    if (!study) {
      return
    }
    let updatedStudy = {
      ...study,
      customEvents,
    }

    await mutateStudy({study: updatedStudy})
  }

  const [localEventObjects, setLocalEventObjects] = React.useState<
    LocalEventObject[]
  >([])

  useEffect(() => {
    if (!study?.customEvents) return
    const localEvents = study?.customEvents!.map(element => {
      return {
        ...element,
        hasError: undefined,
        key: Utility.generateNonambiguousCode(8, 'NUMERIC'),
      }
    })
    checkForErrors(localEvents)
  }, [study?.customEvents])

  useEffect(() => {
    if (schedule) {
      setEventIdsInSchedule(
        ScheduleService.getEventIdsForSchedule(schedule).map(e =>
          EventService.formatCustomEventIdForDisplay(e)
        )
      )
    }
  }, [schedule?.sessions])

  if (!study) {
    return <>...loading</>
  }

  const addEmptyEvent = () => {
    const newEvent: SchedulingEvent = {
      eventId: 'untitled',
      updateType: 'mutable',
    }
    const newEvents = [...transformLocalEventObjects(), newEvent]
    onUpdate(newEvents)
  }

  const transformLocalEventObjects = () => {
    return localEventObjects.map(element => {
      return {
        eventId: element.eventId,
        updateType: element.updateType,
      }
    })
  }

  const updateEvent = () => {
    if (checkForErrors()) return

    onUpdate(transformLocalEventObjects())
  }

  const checkForErrors = (arr?: LocalEventObject[]): boolean => {
    if (!study.customEvents) return false
    const seenIdentifiers = new Map<string, LocalEventObject>()
    const currentLocalEventObjects = [...(arr || localEventObjects)]
    let foundError = false
    for (let i = 0; i < currentLocalEventObjects.length; i++) {
      const identifier = currentLocalEventObjects[i].eventId
      if (identifier !== identifier.replace(/ /gi, '')) {
        foundError = true
        currentLocalEventObjects[i].hasError = 'word'
      } else if (seenIdentifiers.has(identifier)) {
        foundError = true
        currentLocalEventObjects[i].hasError = 'duplicate'
        seenIdentifiers.get(identifier)!.hasError = 'duplicate'
        continue
      }
      seenIdentifiers.set(identifier, currentLocalEventObjects[i])
    }
    setLocalEventObjects(currentLocalEventObjects)
    return foundError
  }

  const deleteEvent = (index: number) => {
    const newEvents: LocalEventObject[] = [...localEventObjects]
    newEvents.splice(index, 1)
    if (checkForErrors(newEvents)) return
    onUpdate(
      newEvents.map(el => {
        return {
          eventId: el.eventId,
          updateType: el.updateType,
        }
      })
    )
  }

  if (_.isEmpty(schedule?.sessions)) {
    return (
      <Box textAlign="center" mx="auto">
        <ErrorDisplay>
          You need to create sessions before creating the schedule
        </ErrorDisplay>
      </Box>
    )
  }

  const isErrorPresent = () => {
    return localEventObjects.findIndex(el => el.hasError) >= 0
  }

  const canEdit = (eventId: string): boolean =>
    !eventIdsInSchedule.includes(eventId)

  return (
    <Box className={classes.root}>
      <LoadingComponent
        reqStatusLoading={saveLoader || isLoading}
        loaderSize="2rem"
        style={{marginTop: '-30px'}}
        variant={'small'}
      />
      <Box width="600px" mx="auto" textAlign="left">
        <p className={classes.paragraphText}>
          Sessions in a study can be scheduled to start{' '}
          <strong>after a participant logs into the study</strong> for the first
          time known as “Initial Log in” or by a <strong>calendar date</strong>{' '}
          known as “Event” that are unique to each participant. Once your study
          launches, you can specify these dates for each participant in the{' '}
          <strong>Participant Manager tab.</strong>
        </p>
        <MTBHeadingH2>How will your session(s) start? </MTBHeadingH2>
        <p className={classes.paragraphText}>
          You can add additional calendar Events and{' '}
          <strong>
            relabel <br />
            them to make it easier to reference later. Spaces are not allowed.
          </strong>
        </p>
        <Box display="flex" justifyContent="flex-start" mt={3}>
          <Box flexShrink={0} minWidth="200px" mr={2}>
            <>
              <Box className={classes.intialLoginContainer}>Initial_Login</Box>

              {localEventObjects.map((evt, index) => (
                <Box display="block" key={evt.key}>
                  <FormGroup
                    row={true}
                    key={evt.key}
                    className={classes.eventInput}
                    style={{alignItems: 'center', marginTop: '21px'}}>
                    <CalendarIconControl />
                    <input
                      key={evt.key}
                      value={evt.eventId}
                      disabled={!canEdit(evt.eventId)}
                      onChange={e => {
                        const newIdentifiers = [...localEventObjects]
                        newIdentifiers[index] = {
                          ...newIdentifiers[index],
                          eventId: e.target.value,
                        }
                        setLocalEventObjects(newIdentifiers)
                      }}
                      onBlur={updateEvent}
                      className={clsx(
                        classes.input,
                        evt.hasError && classes.errorTextbox
                      )}></input>
                    {canEdit(evt.eventId) ? (
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => deleteEvent(index)}>
                        <DeleteIcon
                          style={{
                            color: evt.hasError ? 'red' : 'black',
                          }}></DeleteIcon>
                      </IconButton>
                    ) : (
                      <InfoCircleWithToolTip
                        style={{marginLeft: '2px'}}
                        tooltipDescription={
                          <span>
                            &nbsp;To <strong>rename or delete</strong> this
                            Event, please unselect it from the Session Start
                            that is currently mapped to it in the Create
                            Scheduler step.
                          </span>
                        }
                        variant="info"
                      />
                    )}
                  </FormGroup>
                  {evt.hasError && (
                    <Box className={classes.errorText}>
                      {evt.hasError === 'duplicate'
                        ? 'Duplicate event identifier.'
                        : 'Sorry, event labels cannot have any blank spaces.'}
                    </Box>
                  )}
                </Box>
              ))}
            </>
            <BlueButton
              disabled={isErrorPresent()}
              variant="contained"
              onClick={addEmptyEvent}
              className={classes.newEventButton}>
              + New Custom Event
            </BlueButton>
          </Box>
          <Box className={classes.exampleText}>
            <Box mb={2}>
              An example Clinical Study might require 3 unique calendar events:
            </Box>
            <Box mb={1} display="flex" mr={0.5}>
              <CalendarIconControl />
              Event 1 = BaselineVisit
            </Box>
            <Box mb={1} display="flex" mr={0.5}>
              {' '}
              <CalendarIconControl />
              Event 2 = Follow-upVisit
            </Box>
            <Box display="flex">
              {' '}
              <CalendarIconControl />
              Event 3 = FinalVisit
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default React.forwardRef(SessionStartTab)
