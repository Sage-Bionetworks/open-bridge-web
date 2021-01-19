import {
  Box,
  createStyles,
  Fab,
  FormControlLabel,
  makeStyles,
  Theme
} from '@material-ui/core'
import React, { FunctionComponent, useState } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import { RouteComponentProps } from 'react-router-dom'
import { useAsync } from '../../../helpers/AsyncHook'
import StudyService from '../../../services/study.service'
import { poppinsFont } from '../../../style/theme'
import {
  HDWMEnum,
  Schedule,
  SessionSchedule,
  StartEventId,
  StudyDuration
} from '../../../types/scheduling'
import ObjectDebug from '../../widgets/ObjectDebug'
import NavButtons from '../NavButtons'
import { StudySection } from '../sections'
import Duration from './Duration'
import IntroInfo from './IntroInfo'
import SchedulableSingleSessionContainer from './SchedulableSingleSessionContainer'
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
  }),
)

type SchedulerOwnProps = {
  id: string
  section: StudySection
  nextSection?: StudySection
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = ({
  id,
  section,
  nextSection,
}: SchedulerOwnProps) => {
  const [hasObjectChanged, setHasObjectChanged] = useState(false)
  const [saveLoader, setSaveLoader] = useState(false)
  const handleError = useErrorHandler()
  const classes = useStyles()
  const {
    data: schedule,
    status,
    error,
    run: getStudySchedule,
    setData: setSchedule,
  } = useAsync<Schedule>({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })

  const {
    data: studyDuration,
    status: studyStatus,
    error: studyError,
    run: getStudy,
    setData: setStudyDuration,
  } = useAsync<StudyDuration>({
    status: id ? 'PENDING' : 'IDLE',
    data: {} as StudyDuration,
  })

  //the intro screen is done
  const setInitialInfo = (duration: string, start: StartEventId) => {
    setStudyDuration(duration)
    setSchedule({ ...schedule, startEventId: start })
  }

  const save = async (url?: string) => {
    console.log(url)
    setSaveLoader(true)
    const done = await StudyService.saveStudySessions(
      id,
      schedule?.sessions || [],
    )
    setHasObjectChanged(false)
    setSaveLoader(false)
    if (url) {
      window.location.replace(url)
    }
  }

  React.useEffect(() => {
    console.log(
      `nextSection: ${nextSection}, section: ${section}, ${
        nextSection === section
      }`,
    )
    if (nextSection !== section) {
      if (hasObjectChanged) {
        save(`/studies/builder/${id}/${nextSection}`)
      } else {
        window.location.replace(`/studies/builder/${id}/${nextSection}`)
      }
    }
  }, [nextSection, section])

  React.useEffect(() => {
    if (!id) {
      return
    }
    return getStudySchedule(StudyService.getStudySchedule(id).then(s => s))
  }, [id, getStudySchedule])

  React.useEffect(() => {
    if (!id) {
      return
    }
    return getStudy(
      StudyService.getStudy(id).then(study => {
        console.log('duration', study?.studyDuration)
        return study?.studyDuration
      }),
    )
  }, [id, getStudy])

  if (status === 'REJECTED') {
    handleError(error!)
  }
  if (studyStatus === 'REJECTED') {
    handleError(studyError!)
  } else if (status === 'PENDING' || studyStatus === 'PENDING') {
    return <>...loading</>
  }

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const sessions = actionsReducer(schedule!.sessions, action)
    setHasObjectChanged(true)
    console.log('new state  updated --> ' + sessions)
    setSchedule({ ...schedule, sessions })
  }

  if (!schedule) {
    return <h1>Please add some sessions to this study</h1>
  }

  return (
    <div>
      <Fab
        color="primary"
        onClick={() => setHasObjectChanged(false)}
        aria-label="add"
        style={{
          position: 'fixed',
          right: '30px',
          zIndex: 100,
          display: hasObjectChanged ? 'block' : 'none',
        }}
      >
        Save
      </Fab>

      {!studyDuration && <IntroInfo onContinue={setInitialInfo}></IntroInfo>}

      {/**/}
      {studyDuration && (
        <>
          <ObjectDebug
            label="groups"
            data={schedule?.sessions.map(s => s.sessionSchedule) || {}}
          ></ObjectDebug>
          <FormControlLabel
            classes={{ label: classes.labelDuration }}
            label="Study duration:"
            style={{ fontSize: '14px' }}
            labelPlacement="start"
            control={
              <Duration
                onChange={e => setStudyDuration(e)}
                durationString={studyDuration || ''}
                unitLabel="study duration unit"
                numberLabel="study duration number"
                unitData={HDWMEnum}
              ></Duration>
            }
          />
          <Box bgcolor="#fff" padding="16px" marginTop="24px">
            <TimelinePlot></TimelinePlot>
            <StudyStartDate
              style={{ marginTop: '16px' }}
              startEventId={schedule.startEventId as StartEventId}
              onChange={(startEventId: StartEventId) =>
                setSchedule({ ...schedule, startEventId })
              }
            />

            {schedule?.sessions.map((session, index) => (
              <Box key={session.id}>
                <SchedulableSingleSessionContainer
                  key={session.id}
                  studySession={session}
                  onSaveSessionSchedule={save}
                  onUpdateSessionSchedule={(schedule: SessionSchedule) => {
                    console.log('updating schedule')
                    scheduleUpdateFn({
                      type: ActionTypes.UpdateSessionSchedule,
                      payload: { sessionId: session.id, schedule },
                    })
                  }}
                ></SchedulableSingleSessionContainer>
              </Box>
            ))}
          </Box>

          <NavButtons
            id={id}
            currentSection={section}
            onNavigate={(href: string) => console.log(href)}
          ></NavButtons>
        </>
      )}
    </div>
  )
}

export default Scheduler
