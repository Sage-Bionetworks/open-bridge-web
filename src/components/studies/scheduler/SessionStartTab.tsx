import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import LoadingComponent from '@components/widgets/Loader'
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
import React from 'react'
import {
  DragDropContext,
  Draggable,
  DraggableLocation,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd'
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
      backgroundColor: '#fff', //'#E5E5E5',
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
    eventText: {
      minWidth: theme.spacing(20),
      marginRight: theme.spacing(0.5),
      padding: theme.spacing(0, 1.25),
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
    eventBox: {
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(-4),
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },

    fakeSelect: {
      '&$withCalendar': {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        marginLeft: '-28px',
      },
      '& >div': {
        width: '162px',

        border: `1px solid ${theme.palette.divider}`,
        borderBottom: 'none',
        padding: theme.spacing(2),
        lineHeight: 1,
        backgroundColor: theme.palette.primary.dark,
        position: 'relative',

        '&> svg': {
          position: 'absolute',
          top: '10px',
          right: '5px',
          width: '20px',
          height: '20px',
        },
      },
      '&:last-child>div ': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },

    eventInput: {
      alignItems: 'center',
      position: 'relative',

      border: '1px solid black',
      backgroundColor: '#f6f6f6',
      padding: theme.spacing(2, 2, 2, 3),

      '&.dragging': {
        border: '1px dashed #000',
        padding: '5px',
      },
      '&:hover': {
        border: '2px solid #000',

        '& $hoverImage': {
          display: 'block',
          position: 'absolute',
          left: '5px',
          width: '20px',
          height: '20px',
          top: '0',
          bottom: '0',
          margin: 'auto',
        },
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
    droppable: {},
    hoverImage: {display: 'none'},
    withCalendar: {},
  })
)

type SessionStartTabProps = {
  onNavigate: Function
  id: string
}

type SaveHandle = {
  save: (a: number) => void
}

const CalendarIconControl: React.FunctionComponent<any> = React.memo(() => {
  const classes = useStyles()
  return <img src={CalendarIcon} className={classes.calendarIcon}></img>
})

const FakeSelect: React.FunctionComponent<{
  evtName: string
  hasCalendar: boolean
}> = ({evtName, hasCalendar}) => {
  const classes = useStyles()
  var x = <span>{evtName}</span>
  console.log(hasCalendar)
  return (
    <Box
      className={clsx(classes.fakeSelect, hasCalendar && classes.withCalendar)}>
      {hasCalendar && <CalendarIconControl />}
      <div>
        {evtName}
        <svg viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z"></path>
        </svg>
      </div>
    </Box>
  )
}

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

  const {data: study, error: studyError, isLoading} = useStudy(id)
  const {data: schedule} = useSchedule(id)

  const {
    isSuccess: scheduleUpdateSuccess,
    isError: scheduleUpdateError,
    mutateAsync: mutateStudy,
    data,
  } = useUpdateStudyDetail()

  const handleError = useErrorHandler()
  const [saveLoader, setSaveLoader] = React.useState(false)
  const [error, setError] = React.useState<'word' | 'duplicate' | undefined>(
    undefined
  )
  const [eventIdsInSchedule, setEventIdsInSchedule] = React.useState<string[]>(
    []
  )

  React.useEffect(() => {
    if (schedule) {
      setEventIdsInSchedule(
        ScheduleService.getEventIdsForSchedule(schedule).map(e =>
          EventService.formatEventIdForDisplay(e)
        )
      )
    }
  }, [schedule?.sessions])

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

  const [newEvent, setNewEvent] = React.useState('')

  if (!study) {
    return <>...loading</>
  }

  const addEvent = () => {
    const _newEvent: SchedulingEvent = {
      eventId: newEvent,
      updateType: 'mutable',
    }
    const evtError = checkForErrors(newEvent)
    setError(evtError)
    if (!evtError) {
      const newEvents = [...(study.customEvents || []), _newEvent]
      setNewEvent('')
      onUpdate(newEvents)
    }
    //  if (!checkForErrors(newEvent))
    // const newEvents = [...transformLocalEventObjects(), newEvent]
    //onUpdate(newEvents)
  }

  /* const transformLocalEventObjects = () => {
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
  }*/

  const checkForErrors = (
    eventId: string
  ): 'word' | 'duplicate' | undefined => {
    if (eventId !== eventId.replace(/ /gi, '')) {
      return 'word'
    }
    if (study.customEvents?.find(e => e.eventId === eventId)) {
      return 'duplicate'
    }
    return undefined
  }

  const deleteEvent = (index: number) => {
    if (!study.customEvents) {
      return
    }
    const newEvents = [...study.customEvents]
    /*  const newEvents: LocalEventObject[] = [...localEventObjects]*/
    newEvents.splice(index, 1)
    onUpdate(newEvents)
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
    // return localEventObjects.findIndex(el => el.hasError) >= 0
    return false
  }

  const canEdit = (eventId: string): boolean => {
    return !eventIdsInSchedule.includes(eventId)
  }

  const rearrangeList = (
    list: any[],
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const startIndex = source.index

    const endIndex = destination.index

    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const reorderEvents = (
    events: SchedulingEvent[] | undefined,
    dropResult: DropResult
  ) => {
    if (!dropResult.destination || !events) {
      return
    }
    const updatedEvents = rearrangeList(
      events,
      dropResult.source,
      dropResult.destination
    )
    onUpdate(updatedEvents)
    // setLocalEventObjects(updatedEvents)
  }

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
        <div>
          <FakeSelect evtName="Initial Login" hasCalendar={false} />
          <FakeSelect evtName="Baseline Visit" hasCalendar={true} />
        </div>

        <Box display="flex" justifyContent="flex-start" mt={3}>
          <Box flexShrink={0} minWidth="200px" mr={2}>
            <>
              <Box className={classes.intialLoginContainer}>Initial_Login</Box>

              <DragDropContext
                onDragEnd={(dropResult: DropResult) => {
                  reorderEvents(study.customEvents, dropResult)
                }}>
                <div className={classes.droppable}>
                  <Droppable droppableId={'eventList'} type="ASSESSMENT">
                    {(provided, snapshot) => (
                      <div
                        className={clsx({
                          dragging: snapshot.isDraggingOver,
                        })}
                        ref={provided.innerRef}
                        {...provided.droppableProps}>
                        {study.customEvents &&
                          study.customEvents.map((evt, index) => (
                            <Draggable
                              draggableId={evt.eventId + index}
                              index={index}
                              key={evt.eventId + index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}>
                                  <Box
                                    display="block"
                                    key={evt.eventId}
                                    className={classes.eventBox}>
                                    <CalendarIconControl />
                                    <FormGroup
                                      row={true}
                                      className={classes.eventInput}
                                      style={{
                                        alignItems: 'center',
                                      }}>
                                      <div className={classes.hoverImage}>
                                        {' '}
                                        &#9776;
                                      </div>
                                      <div className={classes.eventText}>
                                        {evt.eventId}
                                      </div>

                                      {canEdit(evt.eventId) ? (
                                        <IconButton
                                          edge="end"
                                          size="small"
                                          style={{padding: 0}}
                                          onClick={() => deleteEvent(index)}>
                                          <DeleteIcon></DeleteIcon>
                                        </IconButton>
                                      ) : (
                                        <InfoCircleWithToolTip
                                          tooltipDescription={
                                            <span>
                                              &nbsp;To{' '}
                                              <strong>rename or delete</strong>{' '}
                                              this Event, please unselect it
                                              from the Session Start that is
                                              currently mapped to it in the
                                              Create Scheduler step.
                                            </span>
                                          }
                                          variant="info"
                                        />
                                      )}
                                    </FormGroup>
                                    {false && (
                                      <Box className={classes.errorText}>
                                        {/*evt.hasError === 'duplicate'
                                        ? 'Duplicate event identifier.'
                                  : 'Sorry, event labels cannot have any blank spaces.'*/}
                                      </Box>
                                    )}
                                  </Box>
                                </div>
                              )}
                            </Draggable>
                          ))}
                      </div>
                    )}
                  </Droppable>
                </div>
              </DragDropContext>
            </>

            {error && (
              <Box className={classes.errorText}>
                {error === 'duplicate'
                  ? 'Duplicate event identifier.'
                  : 'Sorry, event labels cannot have any blank spaces.'}
              </Box>
            )}
            <input
              key="new_event"
              value={newEvent}
              onChange={e => setNewEvent(e.target.value)}
              className={clsx(
                classes.input,
                error && classes.errorTextbox
              )}></input>
            <BlueButton
              variant="contained"
              onClick={addEvent}
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
function setEventIdsInSchedule(arg0: any[]) {
  throw new Error('Function not implemented.')
}
