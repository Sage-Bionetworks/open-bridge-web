import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
  TextField,
} from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import React, { FunctionComponent } from 'react'
import { ThemeType } from '../../../style/theme'
import {
  AssessmentWindow as AssessmentWindowType,
  EndDate as EndDateType,
  NotificationFreqEnum,
  NotificationReminder,
  Reoccurance as ReoccuranceType,
  SessionSchedule,
  StartDate as StartDateType,
  StudySession,
} from '../../../types/scheduling'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import AssessmentWindow from './AssessmentWindow'
import EndDate from './EndDate'
import ReminderNotification from './ReminderNotification'
import RepeatFrequency from './RepeatFrequency'
import SchedulingFormSection from './SchedulingFormSection'
import StartDate from './StartDate'

const useStyles = makeStyles((theme: ThemeType) => ({
  formSection: {
    // backgroundColor: '#acacac',
    padding: `${theme.spacing(3)}px  ${theme.spacing(4)}px 0px ${theme.spacing(
      4,
    )}px`,
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
}))

export const defaultSchedule: SessionSchedule = {
  startDate: {
    type: 'DAY1',
  },
  reoccurance: '', //'P1D', //{ unit: 'd', frequency: 1 },
  windows: [],
  endDate: {
    type: 'END_STUDY',
  },
  isGroupAssessments: false,
  order: 'SEQUENTIAL',
}

type SchedulableSingleSessionContainerProps = {
  studySession: StudySession
  onUpdateSessionSchedule: Function
  onSaveSessionSchedule: Function
}

const SchedulableSingleSessionContainer: FunctionComponent<SchedulableSingleSessionContainerProps> = ({
  studySession,
  onUpdateSessionSchedule,
  onSaveSessionSchedule,
}: // onSetActiveSession,
SchedulableSingleSessionContainerProps) => {
  const classes = useStyles()

  const [
    schedulableSession,
    setSchedulableSession,
  ] = React.useState<SessionSchedule>(
    studySession.sessionSchedule || defaultSchedule,
  )

  React.useEffect(() => {
    setSchedulableSession(studySession.sessionSchedule || defaultSchedule)
  }, [studySession.sessionSchedule])

  const updateSessionSchedule = (newSession: SessionSchedule) => {
    onUpdateSessionSchedule(newSession)
  }

  const addNewWindow = () => {
    const newState = { ...schedulableSession }
    newState.windows.push({
      startHour: 5,
      end: 'P17D',
    })

    console.log(newState, 'adding window')

    updateSessionSchedule(newState)
  }

  const deleteWindow = (index: number) => {
    const windows = [...schedulableSession.windows]
    windows.splice(index, 1)
    const newState = {
      ...schedulableSession,
      windows: [...windows],
    }
    updateSessionSchedule(newState)
  }

  const updateWindow = (window: AssessmentWindowType, index: number) => {
    const newState = {
      ...schedulableSession,
      windows: schedulableSession.windows.map((item, i) =>
        i === index ? window : item,
      ),
    }
    updateSessionSchedule(newState)
  }

  return (
    <form noValidate autoComplete="off">
      <Box bgcolor="#F8F8F8" flexGrow="1">
        <Box className={classes.formSection}>
          <StartDate
            startDate={schedulableSession.startDate}
            onChange={(startDate: StartDateType) => {
              updateSessionSchedule({ ...schedulableSession, startDate })
            }}
          ></StartDate>
        </Box>
        <Box className={classes.formSection}>
          <EndDate
            endDate={schedulableSession.endDate}
            onChange={(endDate: EndDateType) =>
              updateSessionSchedule({ ...schedulableSession, endDate })
            }
          ></EndDate>
        </Box>
        <Box className={classes.formSection}>
          <RepeatFrequency
            onChange={(repeatFrequency: ReoccuranceType) => {
              updateSessionSchedule({
                ...schedulableSession,
                reoccurance: repeatFrequency,
              })
            }}
            repeatFrequency={schedulableSession.reoccurance}
          ></RepeatFrequency>
        </Box>

        <Box className={classes.formSection}>
          <SchedulingFormSection label={'Session Window:'}>
            <Box>
              {schedulableSession.windows.map((window, index) => (
                <AssessmentWindow
                  index={index}
                  key={`${index}${window.startHour}${window.end}`}
                  onDelete={() => {
                    console.log('deleting1', index)
                    deleteWindow(index)
                  }}
                  onChange={(window: AssessmentWindowType) =>
                    updateWindow(window, index)
                  }
                  window={window}
                ></AssessmentWindow>
              ))}
              <Button onClick={addNewWindow} variant="contained">
                +Add new window
              </Button>
            </Box>
          </SchedulingFormSection>
          <SchedulingFormSection label={'Session Notifications'}>
            <Box>
              <SchedulingFormSection
                label={'Notify Participant'}
                variant="small"
                border={false}
              >
                <SelectWithEnum
                  value={schedulableSession.notification || 'RANDOM'}
                  style={{ marginLeft: 0 }}
                  sourceData={NotificationFreqEnum}
                  id="notificationfreq"
                  onChange={e => {
                    const n = e.target
                      .value! as keyof typeof NotificationFreqEnum
                    updateSessionSchedule({
                      ...schedulableSession,
                      notification: n,
                    })
                  }}
                ></SelectWithEnum>
              </SchedulingFormSection>
              <ReminderNotification
                reminder={schedulableSession.reminder}
                onChange={(reminder: NotificationReminder) =>
                  updateSessionSchedule({
                    ...schedulableSession,
                    reminder,
                  })
                }
              ></ReminderNotification>
              <SchedulingFormSection label={''} variant="small" border={false}>
                <FormControlLabel
                  style={{ display: 'block' }}
                  control={
                    <Checkbox
                      value={schedulableSession.isAllowSnooze}
                      onChange={e =>
                        updateSessionSchedule({
                          ...schedulableSession,
                          isAllowSnooze: e.target.checked,
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
                  onChange={event => {
                    const { value } = event.target
                    updateSessionSchedule({
                      ...schedulableSession,
                      subjectLine: value,
                    })
                  }}
                ></TextField>
              </SchedulingFormSection>

              <SchedulingFormSection
                label={'Body text(40 character limit)'}
                variant="small"
                border={false}
              >
                <TextField
                  color="secondary"
                  multiline={true}
                  fullWidth={true}
                  variant="outlined"
                  onChange={event => {
                    const { value } = event.target
                    updateSessionSchedule({
                      ...schedulableSession,
                      bodyText: value,
                    })
                  }}
                ></TextField>
              </SchedulingFormSection>
            </Box>
          </SchedulingFormSection>
          <Button
            variant="contained"
            color="primary"
            size="small"
            style={{ marginBottom: '16px' }}
            onClick={() => onSaveSessionSchedule()}
            startIcon={<SaveIcon />}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </form>
  )
}

export default SchedulableSingleSessionContainer
