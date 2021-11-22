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
import {RedButton} from '../../widgets/StyledComponents'
import {useSchedule} from '../scheduleHooks'
import {useStudy, useUpdateStudyDetail} from '../studyHooks'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(0),
    },

    small: {
      fontFamily: latoFont,
      fontSize: '15px',
      fontStyle: 'italic',

      lineHeight: '18px',
    },

    columnContainer: {
      padding: theme.spacing(3),
      justifyContent: 'space-between',
      display: 'flex',
      textAlign: 'left',
    },
    leftCol: {
      textAlign: 'left',
      marginRight: theme.spacing(4),
      flexGrow: 1,
    },
    rightCol: {
      width: theme.spacing(35),
      flexShrink: 9,
    },

    eventText: {
      width: theme.spacing(16),
      marginRight: theme.spacing(0.5),
      padding: theme.spacing(0, 1.25),
    },

    newEventButton: {
      width: '100%',
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(0),
    },
    input: {
      width: '100%',
      height: theme.spacing(6),
      padding: theme.spacing(2),
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
        textAlign: 'left',

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

    draggableEvent: {
      alignItems: 'center',
      position: 'relative',

      border: '1px solid black',
      backgroundColor: '#f6f6f6',
      padding: theme.spacing(1.5, 1, 1.5, 3),

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
  hasCarret?: boolean
}> = ({evtName, hasCalendar, hasCarret = false}) => {
  const classes = useStyles()
  var x = <span>{evtName}</span>
  console.log(hasCalendar)
  return (
    <Box
      className={clsx(classes.fakeSelect, hasCalendar && classes.withCalendar)}>
      {hasCalendar && <CalendarIconControl />}
      <div>
        {evtName}
        {hasCarret && (
          <svg viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z"></path>
          </svg>
        )}
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
  }

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
  }

  return (
    <Box className={classes.root}>
      <LoadingComponent
        reqStatusLoading={saveLoader || isLoading}
        loaderSize="2rem"
        style={{marginTop: '-30px'}}
        variant={'small'}
      />

      <Box className={classes.columnContainer} bgcolor="#F8F8F8">
        <div className={classes.leftCol} style={{maxWidth: '300px'}}>
          <p>
            By default, sessions start once a participant logs into the study
            for the first time on their smart phone, known as{' '}
            <strong>Initial Login</strong>.
          </p>

          <p>
            To start a session on calendar date/appointment unique to each
            participant, create additional <strong>Events</strong> to this
            Dropdown menu.
          </p>
          <p>
            When you add participants to your study, you will be able to define
            these dates in the Participant Manager tab.
          </p>
        </div>
        <div className={classes.rightCol}>
          <p className={classes.small} style={{width: '170px'}}>
            Example: A clinical study might have 2 Events: a Baseline Visit and
            Final Visit.
          </p>
          <div>
            <FakeSelect
              evtName="Initial Login"
              hasCalendar={false}
              hasCarret={true}
            />
            <FakeSelect evtName="Baseline Visit" hasCalendar={true} />
            <FakeSelect evtName="Final Visit" hasCalendar={true} />
          </div>
        </div>
      </Box>

      <Box
        className={classes.columnContainer}
        bgcolor="#FFF"
        height={`${
          study.customEvents ? study.customEvents.length * 64 + 24 : 200
        }px`}>
        <Box
          className={classes.leftCol}
          display="flex"
          justifyContent="space-between">
          <div style={{width: '165px'}}>
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
            <RedButton
              variant="contained"
              onClick={addEvent}
              className={classes.newEventButton}>
              + Add New Event
            </RedButton>
          </div>
          {study.customEvents && study.customEvents.length > 1 && (
            <Box className={classes.small} ml={3} width={'130px'}>
              <strong>Drag</strong> to reorder which event will occur first.
            </Box>
          )}
        </Box>
        <div className={classes.rightCol} style={{marginRight: '19px'}}>
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
                                  className={classes.draggableEvent}
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
                                          <strong>rename or delete</strong> this
                                          Event, please unselect it from the
                                          Session Start that is currently mapped
                                          to it in the Create Scheduler step.
                                        </span>
                                      }
                                      variant="info"
                                    />
                                  )}
                                </FormGroup>
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
        </div>
      </Box>
    </Box>
  )
}

export default React.forwardRef(SessionStartTab)
