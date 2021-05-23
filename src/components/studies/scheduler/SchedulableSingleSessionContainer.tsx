import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
} from '@material-ui/core'
import _ from 'lodash'
import React, { FunctionComponent } from 'react'
import { ThemeType } from '../../../style/theme'
import {
  AssessmentWindow as AssessmentWindowType,
  NotificationFreqEnum,
  //NotificationReminder,
  //Reoccurence as ReoccurenceType,
  SessionSchedule,
  StudySession,
} from '../../../types/scheduling'
import SaveButton from '../../widgets/SaveButton'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import AssessmentWindow from './AssessmentWindow'
import EndDate from './EndDate'
import ReminderNotification, {
  NotificationReminder,
} from './ReminderNotification'
import RepeatFrequency from './RepeatFrequency'
import SchedulingFormSection from './SchedulingFormSection'
import StartDate from './StartDate'

const useStyles = makeStyles((theme: ThemeType) => ({
  formSection: {
    // backgroundColor: '#acacac',
    padding: theme.spacing(2, 4, 0),
    textAlign: 'left',
    // marginBottom: theme.spacing(1),
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },

  smallRadio: {
    padding: '2px 9px',
    marginTop: '2px',
  },
  multilineBodyText: {
    backgroundColor: theme.palette.common.white,
    '& textarea': {
      backgroundColor: theme.palette.common.white,
    },
  },
}))

export const defaultSchedule: SessionSchedule = {
  performanceOrder: 'participant_choice',
}

type SchedulableSingleSessionContainerProps = {
  studySession: StudySession
  onUpdateSessionSchedule: Function
  onSaveSessionSchedule: Function
  sessionErrorState:
    | {
        generalErrorMessage: string
        sessionWindowErrors: Map<number, string>
      }
    | undefined
}

const SchedulableSingleSessionContainer: FunctionComponent<SchedulableSingleSessionContainerProps> = ({
  studySession,
  onUpdateSessionSchedule,
  onSaveSessionSchedule,
  sessionErrorState,
}: SchedulableSingleSessionContainerProps) => {
  const classes = useStyles()

  const [
    schedulableSession,
    setSchedulableSession,
  ] = React.useState<SessionSchedule>(studySession || defaultSchedule)

  React.useEffect(() => {
    setSchedulableSession(studySession || defaultSchedule)
  }, [studySession])

  const updateSessionSchedule = (newSession: SessionSchedule) => {
    console.log(newSession)
    onUpdateSessionSchedule(newSession)
  }

  const addNewWindow = () => {
    const newState = { ...schedulableSession }
    let aWindow = {
      startTime: '08:00',
    }
    newState.timeWindows
      ? newState.timeWindows.push(aWindow)
      : (newState.timeWindows = [aWindow])

    updateSessionSchedule(newState)
  }

  const deleteWindow = (index: number) => {
    const timeWindows = [...(schedulableSession.timeWindows || [])]
    timeWindows.splice(index, 1)
    const newState = {
      ...schedulableSession,
      timeWindows: [...timeWindows],
    }
    updateSessionSchedule(newState)
  }

  const updateWindow = (window: AssessmentWindowType, index: number) => {
    if (!schedulableSession.timeWindows) {
      return
    }
    const newState = {
      ...schedulableSession,
      timeWindows: schedulableSession.timeWindows.map((item, i) =>
        i === index ? window : item,
      ),
    }
    updateSessionSchedule(newState)
  }

  const updateMessage = (options: { subject?: string; message?: string }) => {
    const messages = schedulableSession.messages || []
    // ALINA we only have one message right now
    let message = messages[0] || { lang: 'en', subject: '', message: '' }
    message = { ...message, ...options }
    updateSessionSchedule({
      ...schedulableSession,
      messages: [message],
    })
  }

  return (
    <Box bgcolor="#F8F8F8" flexGrow="1" pb={2.5} pl={4}>
      {sessionErrorState && (
        <Box mt={4}>
          {studySession.name} Session error message should go here
        </Box>
      )}
      <form noValidate autoComplete="off">
        <Box className={classes.formSection}>
          <StartDate
            delay={schedulableSession.delay}
            sessionName={studySession.name}
            onChange={(delay: string | undefined) => {
              updateSessionSchedule({ ...schedulableSession, delay })
            }}
          ></StartDate>
        </Box>
        <Box className={classes.formSection}>
          <EndDate
            occurrences={schedulableSession.occurrences}
            onChange={(occurrences: number | undefined) =>
              updateSessionSchedule({ ...schedulableSession, occurrences })
            }
          ></EndDate>
        </Box>
        <Box className={classes.formSection}>
          <RepeatFrequency
            onChange={(interval: string | undefined) => {
              updateSessionSchedule({
                ...schedulableSession,
                interval,
              })
            }}
            interval={schedulableSession.interval}
          ></RepeatFrequency>
        </Box>

        <Box className={classes.formSection}>
          {sessionErrorState &&
            sessionErrorState.sessionWindowErrors.size > 0 && (
              <Box mb={3}>
                Session {studySession.name} Error message should go here
              </Box>
            )}
          <SchedulingFormSection label="Session Window:">
            <Box flexGrow={1}>
              {schedulableSession.timeWindows?.map((window, index) => (
                <AssessmentWindow
                  index={index}
                  key={`${index}${window.startTime}${window.expiration}`}
                  onDelete={() => {
                    console.log('deleting1', index)
                    deleteWindow(index)
                  }}
                  onChange={(window: AssessmentWindowType) =>
                    updateWindow(window, index)
                  }
                  window={window}
                  errorText={
                    sessionErrorState?.sessionWindowErrors.get(index + 1) || ''
                  }
                ></AssessmentWindow>
              ))}
              <Button onClick={addNewWindow} variant="contained">
                +Add new window
              </Button>
            </Box>
          </SchedulingFormSection>
          <SchedulingFormSection label="Session Notifications:">
            <Box>
              <SchedulingFormSection
                label={'Notify participant:'}
                variant="small"
                border={false}
              >
                <SelectWithEnum
                  value={schedulableSession.notifyAt || 'random'}
                  style={{ marginLeft: 0 }}
                  sourceData={NotificationFreqEnum}
                  id="notificationfreq"
                  onChange={e => {
                    const n = e.target
                      .value! as keyof typeof NotificationFreqEnum
                    alert(n)
                    const newS = {
                      ...schedulableSession,
                      notifyAt: n,
                    }
                    console.log(newS.notifyAt)
                    updateSessionSchedule(newS)
                  }}
                ></SelectWithEnum>
              </SchedulingFormSection>
              <ReminderNotification
                reminder={{
                  interval: schedulableSession.reminderPeriod,
                  type: schedulableSession.remindAt,
                }}
                onChange={(remind: NotificationReminder) =>
                  updateSessionSchedule({
                    ...schedulableSession,
                    reminderPeriod: remind.interval,
                    remindAt: remind.type,
                  })
                }
              ></ReminderNotification>
              <SchedulingFormSection
                label="Allow to snooze"
                isHideLabel={true}
                variant="small"
                border={false}
              >
                <FormControlLabel
                  style={{ display: 'block' }}
                  control={
                    <Checkbox
                      value={schedulableSession.allowSnooze}
                      checked={schedulableSession.allowSnooze}
                      onChange={e =>
                        updateSessionSchedule({
                          ...schedulableSession,
                          allowSnooze: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Allow participant to snooze"
                />
              </SchedulingFormSection>
              <SchedulingFormSection
                label={'Subject line:'}
                variant="small"
                border={false}
              >
                <TextField
                  color="secondary"
                  multiline={false}
                  fullWidth={true}
                  variant="outlined"
                  defaultValue={
                    _.first(schedulableSession.messages)?.subject || ''
                  }
                  onBlur={e => updateMessage({ subject: e.target.value })}
                ></TextField>
              </SchedulingFormSection>

              <SchedulingFormSection
                label={'Body text (40 character limit)'}
                variant="small"
                border={false}
              >
                <TextField
                  color="secondary"
                  multiline={true}
                  fullWidth={true}
                  variant="outlined"
                  rows="3"
                  classes={{ root: classes.multilineBodyText }}
                  defaultValue={
                    _.first(schedulableSession.messages)?.message || ''
                  }
                  onBlur={e => updateMessage({ message: e.target.value })}
                ></TextField>
              </SchedulingFormSection>
            </Box>
          </SchedulingFormSection>
        </Box>
        <SaveButton onClick={() => onSaveSessionSchedule()}></SaveButton>
      </form>
    </Box>
  )
}

export default SchedulableSingleSessionContainer
