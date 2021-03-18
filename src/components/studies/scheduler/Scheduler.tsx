import {
  Box,
  Button,
  createStyles,
  FormControlLabel,
  makeStyles,
  Theme
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import _ from 'lodash'
import React, { FunctionComponent } from 'react'
import NavigationPrompt from 'react-router-navigation-prompt'
import { poppinsFont } from '../../../style/theme'
import {
  HDWMEnum,
  PerformanceOrder,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudySession
} from '../../../types/scheduling'
import { StudyBuilderComponentProps } from '../../../types/types'
import ConfirmationDialog from '../../widgets/ConfirmationDialog'
import AssessmentList from './AssessmentList'
import Duration from './Duration'
import IntroInfo from './IntroInfo'
import SchedulableSingleSessionContainer, {
  defaultSchedule
} from './SchedulableSingleSessionContainer'
import actionsReducer, {
  ActionTypes,
  SessionScheduleAction
} from './scheduleActions'
import StudyStartDate from './StudyStartDate'
import TimelinePlot from './TimelinePlot'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    labelDuration: {
      paddingTop: theme.spacing(1),
      paddingRight: theme.spacing(2),
      fontFamily: poppinsFont,
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
    },
    assessments: {
      width: '286px',
      flexGrow: 0,
      flexShrink: 0,
      backgroundColor: '#BCD5E4',
      padding: theme.spacing(1),
    },
    scheduleHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: theme.spacing(2),
    },
  }),
)

type SchedulerProps = {
  id: string
  schedule: Schedule
  onSave: Function
}

const Scheduler: FunctionComponent<
  SchedulerProps & StudyBuilderComponentProps
> = ({
  hasObjectChanged,
  saveLoader,
  onUpdate,
  schedule: _schedule,
  onSave,
  children,
}: SchedulerProps & StudyBuilderComponentProps) => {
  const classes = useStyles()

  const [schedule, setSchedule] = React.useState({ ..._schedule })

  const getStartEventIdFromSchedule = (
    schedule: Schedule,
  ): StartEventId | null => {
    if (_.isEmpty(schedule.sessions)) {
      return null
    }
    const eventIdArray = schedule.sessions.reduce(
      (acc, curr) => (curr.startEventId ? [...acc, curr.startEventId] : acc),
      [] as StartEventId[],
    )

    if (_.uniq(eventIdArray).length > 1) {
      throw Error('startEventIds should be the same for all sessions')
    } else {
      return eventIdArray[0]
    }
  }

  const saveSession = async (sessionId: string) => {
    onSave()
  }

  //setting new state
  const updateData = (schedule: Schedule) => {
    setSchedule(schedule)
    onUpdate(schedule)
  }

  //updating the schedule part
  const updateSessionsWithStartEventId = (
    sessions: StudySession[],
    startEventId: StartEventId,
  ) => {
    return sessions.map(s => ({ ...s, startEventId }))
  }

  //updating on the intro screen
  const setInitialInfo = async (duration: string, start: StartEventId) => {
    const _schedule = {
      ...schedule,
      duration,
      sessions: updateSessionsWithStartEventId(schedule.sessions, start),
    }
    updateData(_schedule)
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule.sessions, action)
    const newSchedule = { ...schedule, sessions }
    updateData(newSchedule)
  }

  const updateAssessments = (
    session: StudySession,
    {
      isRandomized,
      isGroupAssessments,
    }: { isRandomized?: boolean; isGroupAssessments?: boolean },
  ) => {
    const updatedSchedule = session || defaultSchedule
    if (isRandomized !== undefined) {
      const order: PerformanceOrder = isRandomized ? 'randomized' : 'sequential'
      updatedSchedule.performanceOrder = order
    }
    if (!isGroupAssessments) {
      updatedSchedule.performanceOrder = 'participant_choice'
    }

    scheduleUpdateFn({
      type: ActionTypes.UpdateSessionSchedule,
      payload: {
        sessionId: session.guid,
        schedule: updatedSchedule,
      },
    })
  }

  return (
    <>
      <NavigationPrompt when={hasObjectChanged}>
        {({ onConfirm, onCancel }) => (
          <ConfirmationDialog
            isOpen={hasObjectChanged}
            type={'NAVIGATE'}
            onCancel={onCancel}
            onConfirm={onConfirm}
          />
        )}
      </NavigationPrompt>

      {!getStartEventIdFromSchedule(schedule) && (
        <IntroInfo onContinue={setInitialInfo}></IntroInfo>
      )}

      {/**/}
      {getStartEventIdFromSchedule(schedule) && (
        <Box textAlign="left">
          <div className={classes.scheduleHeader}>
            <FormControlLabel
              classes={{ label: classes.labelDuration }}
              label="Study duration:"
              style={{ fontSize: '14px' }}
              labelPlacement="start"
              control={
                <Duration
                  onChange={e =>
                    updateData({ ...schedule, duration: e.toString() })
                  }
                  durationString={schedule.duration || ''}
                  unitLabel="study duration unit"
                  numberLabel="study duration number"
                  unitData={HDWMEnum}
                ></Duration>
              }
            />
            {hasObjectChanged && (
              <Button
                variant="contained"
                color="primary"
                onClick={() => onSave()}
                startIcon={<SaveIcon />}
              >
                Save changes
              </Button>
            )}
          </div>
          <Box bgcolor="#fff" p={2} mt={3}>
            <TimelinePlot something=""></TimelinePlot>
            <StudyStartDate
              style={{ marginTop: '16px' }}
              startEventId={
                getStartEventIdFromSchedule(schedule) as StartEventId
              }
              onChange={(startEventId: StartEventId) => {
                const sessions = updateSessionsWithStartEventId(
                  schedule.sessions,
                  startEventId,
                )
                updateData({ ...schedule, sessions })
              }}
            />

            {schedule.sessions.map((session, index) => (
              <Box mb={2} display="flex">
                <Box className={classes.assessments}>
                  <AssessmentList
                    studySessionIndex={index}
                    studySession={session}
                    onSetRandomized={(isRandomized: boolean) =>
                      updateAssessments(session, { isRandomized })
                    }
                    onChangeGrouping={(isGroupAssessments: boolean) =>
                      updateAssessments(session, { isGroupAssessments })
                    }
                    isGroupAssessments={
                      session.performanceOrder !== 'participant_choice'
                    }
                    performanceOrder={session.performanceOrder || 'sequential'}
                  />
                </Box>

                <SchedulableSingleSessionContainer
                  key={session.guid}
                  studySession={session}
                  onSaveSessionSchedule={() => saveSession(session.guid)}
                  onUpdateSessionSchedule={(schedule: SessionSchedule) => {
                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: { sessionId: session.guid, schedule },
                    })
                  }}
                ></SchedulableSingleSessionContainer>
              </Box>
            ))}
          </Box>

          {children}
        </Box>
      )}
    </>
  )
}

export default Scheduler
