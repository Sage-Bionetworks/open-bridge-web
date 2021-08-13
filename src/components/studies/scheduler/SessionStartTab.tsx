import {
  Box,
  createStyles,
  FormGroup,
  IconButton,
  makeStyles,
  Theme,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Close'
import _ from 'lodash'
import React, {FunctionComponent} from 'react'
import UtilityObject from '../../../helpers/utility'
import {Schedule, SchedulingEvent} from '../../../types/scheduling'
import {Study} from '../../../types/types'
import EditableTextbox from '../../widgets/EditableTextbox'
import ErrorDisplay from '../../widgets/ErrorDisplay'
import {MTBHeadingH1, MTBHeadingH2} from '../../widgets/Headings'
import {BlueButton} from '../../widgets/StyledComponents'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: '#fff',
      padding: theme.spacing(13, 7, 3, 7),

      /* paddingRight: theme.spacing(2),
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,*/
    },
  })
)

type SessionStartTabProps = {
  schedule: Schedule
  onUpdate: Function
  onSave: Function
  study: Study
  // hasObjectChanged: boolean
  //saveLoader: boolean
}

const SessionStartTab: FunctionComponent<SessionStartTabProps> = ({
  //hasObjectChanged,
  //saveLoader,
  onUpdate,
  schedule,
  onSave,
  study,
}: SessionStartTabProps) => {
  const classes = useStyles()
  /* const [schedulingEvents, setSchedulingEvents] =
    React.useState<SchedulingEvent[]>(events)*/
  /*
  const saveSession = async (sessionId: string) => {
    onSave()
  }

  //setting new state
  const updateData = (schedule: Schedule) => {
    // setSchedule(schedule)
    onUpdate(schedule)
  }

  //updating the schedule part
  const updateSessionsWithStartEventId = (
    sessions: StudySession[],
    startEventId: StartEventId
  ) => {
    return sessions.map(s => ({...s, startEventId}))
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions, action)
    const newSchedule = {...schedule, sessions}
    updateData(newSchedule)
  }*/

  const addEmptyEvent = () => {
    const newEvent: SchedulingEvent = {
      label: 'Untitled',
      identifier: UtilityObject.generateNonambiguousCode(9, 'NUMERIC'),
      updateType: 'mutable',
    }

    //  setSchedulingEvents(events => [...events, newEvent])
    const newEvents = [...(study.clientData.events || []), newEvent]
    onUpdate(undefined, newEvents)
  }

  const updateEvent = (event: SchedulingEvent, newLabel: string) => {
    const newEvents = (study.clientData.events || []).map(e =>
      e.identifier !== event.identifier ? e : {...e, label: newLabel}
    )
    onUpdate(undefined, newEvents)
  }

  const deleteEvent = (eventIdentifier: string) => {
    const newEvents = (study.clientData.events || []).filter(
      e => e.identifier !== eventIdentifier
    )
    onUpdate(undefined, newEvents)
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

  return (
    <Box className={classes.root}>
      <Box width="600px" mx="auto" textAlign="left">
        <MTBHeadingH1>Session Start Dates</MTBHeadingH1>
        <p>
          Sessions in a study can be scheduled to start after a participant logs
          into the study for the first time known as “Initial Log in” or by a
          calendar date known as “Event” that are unique to each participant.
          Once your study launches, you can specify these dates for each
          participant in the Participant Manager tab.
        </p>

        <MTBHeadingH2>How will your session(s) start? </MTBHeadingH2>
        <p>
          You can add additional calendar Events and relabel <br />
          them to make it easier to reference later.
        </p>
        <Box display="flex">
          <Box flexShrink={0} flexBasis={400} pl={8}>
            <>
              Initial_Login
              {(study.clientData.events || []).map(evt => (
                <FormGroup
                  row={true}
                  style={{alignItems: 'center', marginTop: '21px'}}>
                  {/*  <Checkbox checked={true} onChange={() => {}} name="checkedA" />*/}

                  <EditableTextbox
                    initValue={evt.label}
                    onTriggerUpdate={(newLabel: string) =>
                      updateEvent(evt, newLabel)
                    }></EditableTextbox>

                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => deleteEvent(evt.identifier)}>
                    <DeleteIcon></DeleteIcon>
                  </IconButton>
                </FormGroup>
              ))}
            </>
            <BlueButton
              variant="contained"
              onClick={addEmptyEvent}
              style={{marginTop: '32px'}}>
              + New Custom Event
            </BlueButton>
          </Box>
          <Box>
            An example Clinical Study might require 3 unique calendar events:
            Event 1 = Baseline Visit
            <br />
            Event 2 = Follow-up Visit
            <br />
            Event 3 = Final Visit
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default SessionStartTab
