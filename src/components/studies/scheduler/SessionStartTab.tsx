import {ReactComponent as EditEvent1} from '@assets/scheduler/edit_event_1.svg'
import {ReactComponent as EditEvent2} from '@assets/scheduler/edit_event_2.svg'
import {ReactComponent as EditEvent3} from '@assets/scheduler/edit_event_3.svg'
import ClearTwoToneIcon from '@mui/icons-material/ClearTwoTone'
import DragIndicatorTwoToneIcon from '@mui/icons-material/DragIndicatorTwoTone'
import KeyboardArrowDownTwoToneIcon from '@mui/icons-material/KeyboardArrowDownTwoTone'

import InfoCircleWithToolTip from '@components/widgets/InfoCircleWithToolTip'
import LoadingComponent from '@components/widgets/Loader'
import {SimpleTextInput, SimpleTextLabel} from '@components/widgets/StyledComponents'

import {Box, Button, FormControl, FormGroup, IconButton, styled, Typography} from '@mui/material'
import EventService from '@services/event.service'
import {useUpdateStudyDetail} from '@services/studyHooks'
import {theme} from '@style/theme'
import {SchedulingEvent} from '@typedefs/scheduling'
import {ExtendedError, Study} from '@typedefs/types'
import clsx from 'clsx'
import React from 'react'
import {DragDropContext, Draggable, DraggableLocation, Droppable, DropResult} from 'react-beautiful-dnd'

const StyledFakeSelect = styled(Box, {label: 'StyledFakeSelect'})(({theme}) => ({
  background: '#FFFFFF',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  width: '157px',
  height: '24px',
  marginBottom: theme.spacing(0.5),
  position: 'relative',
  fontSize: '7px',
  lineHeight: '8px',
  textAlign: 'left',
  padding: '8px 8px 0 20px',
  flexShrink: 0,
  '& > svg': {
    position: 'absolute',
    height: '12px',
  },
}))

const StyledDraggableEvent = styled(FormGroup, {label: 'StyledDraggableEvent'})(({theme}) => ({
  alignItems: 'center',

  position: 'relative',
  width: '317px',
  background: '#FFFFFF',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
  padding: theme.spacing(1.5, 1, 1.5, 4.5),

  '&.dragging': {
    border: '1px dashed #000',
    padding: '5px',
  },

  '&:hover': {
    border: '1px solid #000',
  },

  marginBottom: theme.spacing(2),
}))

type SessionStartTabProps = {
  onNavigate: Function
  study: Study
  eventIdsInSchedule: string[]
}

type SaveHandle = {
  save: () => void
}
const ERROR_MSG = {
  duplicate: 'Duplicate event identifier.',
  // word: 'Sorry, event labels cannot have any blank spaces.',
  special: 'The event name may not contain a colon (:)',
  empty: 'The name of the event cannot be blank',
}

const FakeSelect: React.FunctionComponent<{
  evtName: string
  hasCalendar: boolean
  hasCarret?: boolean
}> = ({evtName, hasCalendar, hasCarret = false}) => {
  return (
    <StyledFakeSelect>
      {hasCalendar && <DragIndicatorTwoToneIcon sx={{color: '#DFE2E6', fontSize: '12px', left: '5px', top: '6px'}} />}

      {evtName}
      {hasCarret ? (
        <KeyboardArrowDownTwoToneIcon sx={{color: '#4F527D', fontSize: '12px', right: '7px', top: '6px'}} />
      ) : (
        <ClearTwoToneIcon sx={{color: ' #DFE2E6', fontSize: '12px', right: '7px', top: '6px'}} />
      )}
    </StyledFakeSelect>
  )
}

const SessionStartTab: React.ForwardRefRenderFunction<SaveHandle, SessionStartTabProps> = (
  {study, onNavigate, eventIdsInSchedule}: SessionStartTabProps,
  ref
) => {
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

  const {mutateAsync: mutateStudy} = useUpdateStudyDetail()

  const [saveLoader, setSaveLoader] = React.useState(false)
  const [error, setError] = React.useState<string | undefined>(undefined)
  const [customEvents, setCustomEvents] = React.useState<SchedulingEvent[]>(study.customEvents || [])

  const onSave = async () => {
    if (!study) {
      return
    }
    let updatedStudy = {
      ...study,
      customEvents,
    }
    try {
      await mutateStudy({study: updatedStudy})
    } catch (e) {
      console.log(e)
    }
  }

  const [newEvent, setNewEvent] = React.useState(`Event ${customEvents.length + 1}`)

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
      const eventName = `Event ${customEvents.length + 2}`
      setCustomEvents(prev => [...(prev || []), _newEvent])
      setNewEvent(eventName)
    }
  }

  const checkForErrors = (eventId: string): string | undefined => {
    //const specialChars = /[!,@,#,$,%,^,?,&,*,+,/,\,;,:]/
    const specialChars = /[;,:]/
    if (specialChars.test(eventId)) {
      return ERROR_MSG.special
    }
    if (eventId.trim() === '') {
      return ERROR_MSG.empty
    }

    /* if (eventId !== eventId.replace(/ /gi, '')) {
      return ERROR_MSG.word
    }*/
    if (customEvents?.find(e => e.eventId === eventId)) {
      return ERROR_MSG.duplicate
    }
    return undefined
  }

  const deleteEvent = (index: number) => {
    if (!customEvents) {
      return
    }
    const newEvents = [...customEvents]

    newEvents.splice(index, 1)
    setCustomEvents(newEvents)
    //onUpdate(newEvents)
  }

  const canEdit = (eventId: string): boolean => {
    return !eventIdsInSchedule.map(e => EventService.formatEventIdForDisplay(e)).includes(eventId)
  }

  const rearrangeList = (list: any[], source: DraggableLocation, destination: DraggableLocation) => {
    const startIndex = source.index
    const endIndex = destination.index
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const reorderEvents = (events: SchedulingEvent[] | undefined, dropResult: DropResult) => {
    if (!dropResult.destination || !events) {
      return
    }
    const updatedEvents = rearrangeList(events, dropResult.source, dropResult.destination)
    setCustomEvents(updatedEvents)
    // onUpdate(updatedEvents)
  }

  return (
    <Box>
      {' '}
      <LoadingComponent reqStatusLoading={saveLoader} loaderSize="2rem" variant={'small'} />
      <Box
        sx={{
          backgroundColor: '#fbfbfc',
          marginLeft: theme.spacing(-5),
          marginRight: theme.spacing(-5),
          padding: theme.spacing(4, 10, 3, 6),

          justifyContent: 'space-between',
          display: 'flex',
          textAlign: 'left',
          '& > div': {
            maxWidth: '160px',
            flexShrink: 0,
            fontSize: '16px',
            lineHeight: '20px',
          },
          '&  svg': {
            height: '170px',
          },
        }}>
        <div>
          <EditEvent1 />
          By default, sessions start once a participant logs into the study for the first time on their smart phone,
          known as{' '}
          <strong>
            <i>Initial Login</i>
          </strong>
          .
        </div>

        <div>
          <EditEvent2 />
          To start a session on calendar date/appointment unique to each participant, create additional{' '}
          <strong>
            <i>Events</i>
          </strong>{' '}
          to this Dropdown menu.
        </div>
        <div>
          <EditEvent3 />
          When you add participants to your study, you will be able to define these dates in the{' '}
          <strong>
            <i>Participant Manager tab.</i>
          </strong>
        </div>

        <div>
          <Box sx={{height: '120px', marginTop: '40px'}}>
            <FakeSelect evtName="Initial Login" hasCalendar={false} hasCarret={true} />
            <FakeSelect evtName="Baseline Visit" hasCalendar={true} />
            <FakeSelect evtName="Final Visit" hasCalendar={true} />
          </Box>
          <p>Example: A clinical study might have 2 Events: a Baseline Visit and Final Visit.</p>
        </div>
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          minHeight: `${customEvents ? customEvents.length * 64 + 24 : 200}px`,
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: theme.spacing(5),
        }}>
        <Box>
          <FormControl fullWidth error={!!error}>
            <SimpleTextLabel htmlFor="new_event">Event Name*</SimpleTextLabel>
            <SimpleTextInput
              key="new_event"
              id="new_event"
              value={newEvent}
              onChange={e => {
                setNewEvent(e.target.value)
                setError(undefined)
              }}
            />
            {error && <Typography color="error">{error}</Typography>}
          </FormControl>
          <Button variant="outlined" onClick={addEvent} sx={{marginTop: theme.spacing(3)}}>
            Add New Event
          </Button>
        </Box>

        <Box style={{width: '325px'}}>
          {customEvents && customEvents.length > 1 && <strong>Drag to reorder which event will occur first.</strong>}
          <DragDropContext
            onDragEnd={(dropResult: DropResult) => {
              reorderEvents(customEvents, dropResult)
            }}>
            <Box sx={{marginTop: theme.spacing(2)}}>
              <Droppable droppableId={'eventList'} type="custom_events">
                {(provided, snapshot) => (
                  <div
                    className={clsx({
                      dragging: snapshot.isDraggingOver,
                    })}
                    ref={provided.innerRef}
                    {...provided.droppableProps}>
                    {customEvents &&
                      customEvents.map((evt, index) => (
                        <Draggable
                          draggableId={evt.eventId + index}
                          index={index}
                          key={evt.eventId + index}
                          isDragDisabled={customEvents?.length < 2}>
                          {(provided, snapshot) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <StyledDraggableEvent row={true}>
                                {customEvents?.length > 1 && (
                                  <DragIndicatorTwoToneIcon
                                    sx={{position: 'absolute', color: '#DFE2E6', left: '12px'}}
                                  />
                                )}

                                <div>{evt.eventId}</div>

                                {canEdit(evt.eventId) ? (
                                  <IconButton
                                    edge="end"
                                    size="small"
                                    sx={{padding: 0, position: 'absolute', right: '16px'}}
                                    onClick={() => deleteEvent(index)}>
                                    <ClearTwoToneIcon />
                                  </IconButton>
                                ) : (
                                  <InfoCircleWithToolTip
                                    sx={{position: 'absolute', right: '16px'}}
                                    tooltipDescription={
                                      <span>
                                        This event is being used in one/more session(s) as a Session Start event. To{' '}
                                        <strong>rename or delete</strong> this Event, please unselect it from all
                                        Session Start events.
                                      </span>
                                    }
                                    variant="info"
                                  />
                                )}
                              </StyledDraggableEvent>
                            </div>
                          )}
                        </Draggable>
                      ))}
                  </div>
                )}
              </Droppable>
            </Box>
          </DragDropContext>
        </Box>
      </Box>
    </Box>
  )
}

export default React.forwardRef(SessionStartTab)
