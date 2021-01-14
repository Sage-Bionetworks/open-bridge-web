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
  SessionSchedule,
  StudyDuration,
  StudyStartPseudonym
} from '../../../types/scheduling'
import { StudyArm } from '../../../types/types'
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
  //studySessions: StudySession[]
  id: string
  section: StudySection
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = ({
  id,
  section,
}: //studySessions,
SchedulerOwnProps) => {
  /*const studyArm: StudyArm = {
    studyId: id,
    name: 'Untitled',
    pseudonym: '',
    active: true,
    schedule: {
      name: 'Undefined',
      eventStartId: '123',
      sessions: [],
    },
  }*/
  const [hasObjectChanged, setHasObjectChanged] = useState(false)
  const handleError = useErrorHandler()
  const classes = useStyles()
  const {
    data: studyArms,
    status,
    error,
    run: getStudyArms,
    setData,
  } = useAsync<StudyArm[]>({
    status: id ? 'PENDING' : 'IDLE',
    data: [],
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
  const setInitialInfo = (duration: string, start: StudyStartPseudonym) => {
    setStudyDuration(duration)
    updateStudyArm(studyArms!, 0, {
      ...studyArms![0],
      pseudonym: start,
    })
  }

  React.useEffect(() => {
    if (!id) {
      return
    }
    return getStudyArms(
      StudyService.getStudyArms(id).then(arms => {
        console.log('arms', arms)
        return arms
      }),
    )
  }, [id, getStudyArms])

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
  /*const groupsUpdateFn = (action: SessionAction) => {
    //setData(actionsReducer(groups!, action))
  }*/

  // const [studyArms, setData] = React.useState<StudyArm[]>([studyArm])
  /*  const [reqStatus, setRequestStatus] = React.useState<RequestStatus>(
    'RESOLVED',
  )*/

  // let { id } = useParams<{ id: string }>()

  /*const sessionsUpdateFn = (action: SessionAction) => {
    const newState = actionsReducer(sessions!, action)
    setHasObjectChanged(true)
    setData(newState)
  }*/

  const scheduleUpdateFn = (action: SessionScheduleAction) => {
    const newState = actionsReducer(studyArms![0].schedule!.sessions, action)
    setHasObjectChanged(true)
    console.log('new state --> ' + newState)
    //debugger
    const newStudyArmSchedule = {
      ...studyArms![0].schedule!,
      sessions: newState,
    }
    const newStudyArm: StudyArm = {
      ...studyArms![0],
      schedule: newStudyArmSchedule,
    }
    updateStudyArm(studyArms, 0, newStudyArm)
    // setData({... studyArms![0].schedule, sessions: newState})
    setHasObjectChanged(true)
    /* const newState = actionsReducer(studyArms[0].schedule.sessions!, action)
    console.log('setting data  to ', newState)
    const rx= studyArms.map((arm, index) => index > 0? arm : {...arm, schedule: {...arm.schedule, sessions: newState}})
    setData(prev => rx)*/
  }

  const updateStudyArm = (
    oldState: StudyArm[] | null,
    index: number,
    arm: StudyArm,
  ) => {
    let x: StudyArm[]
    if (!oldState) {
      x = [arm]
    } else {
      x = [...oldState]

      x.splice(index, 1, arm)
    }

    setData(x)
  }

  if (!studyArms) {
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
            data={
              studyArms[0].schedule?.sessions.map(s => s.sessionSchedule) || {}
            }
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

          {studyArms.map((studyArm, index) => (
            <Box bgcolor="#fff" padding="16px" marginTop="24px" key={index}>
              <TimelinePlot></TimelinePlot>
              <StudyStartDate
                style={{ marginTop: '16px' }}
                pseudonym={studyArm.pseudonym}
                onChange={(pseudonym: StudyStartPseudonym) =>
                  updateStudyArm(studyArms, index, {
                    ...studyArms[index],
                    pseudonym,
                  })
                }
              />

              {studyArm.schedule?.sessions.map((session, index) => (
                <Box key={session.id}>
                  <SchedulableSingleSessionContainer
                    key={session.id}
                    studySession={session}
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
          ))}

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
