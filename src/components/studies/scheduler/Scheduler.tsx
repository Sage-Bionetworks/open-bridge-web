import React, {
  FunctionComponent,
  useEffect,
  useReducer,
  useState,
} from 'react'
import Link from '@material-ui/core/Link'
import { RouteComponentProps, useParams } from 'react-router-dom'
import StudyService from '../../../services/study.service'
import { RequestStatus, StudyArm, StudySession } from '../../../types/types'
import TabsMtb from '../../widgets/TabsMtb'
import actionsReducer, {
  SessionAction,
  Types,
} from '../session-creator/sessionActions'
import TabPanel from '../../widgets/TabPanel'
import LoadingComponent from '../../widgets/Loader'
import { useErrorHandler } from 'react-error-boundary'
import SchedulableSingleSessionContainer from './SchedulableStudySessionContainer'
import ObjectDebug from '../../widgets/ObjectDebug'
import GroupsEditor from './GoupsEditor'
import { AcUnitOutlined } from '@material-ui/icons'
import { StudySection } from '../sections'
import NavButtons from '../NavButtons'
import { useAsync } from '../../../helpers/AsyncHook'
import {
  Box,
  Button,
  createStyles,
  Fab,
  FormControl,
  FormControlLabel,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
} from '@material-ui/core'
import SchedulingFormSection from './SchedulingFormSection'
import { DWMYsEnum, StudyDuration, HDWMEnum } from '../../../types/scheduling'
import SmallTextBox from './SmallTextBox'
import SelectWithEnum from '../../widgets/SelectWithEnum'
import { poppinsFont } from '../../../style/theme'
import Duration from './Duration'

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
        return study?.studyDuration || {}
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

  const groupsUpdateFn = (action: SessionAction) => {
    setHasObjectChanged(true)
    /* const newState = actionsReducer(studyArms[0].schedule.sessions!, action)
    console.log('setting data  to ', newState)
    const rx= studyArms.map((arm, index) => index > 0? arm : {...arm, schedule: {...arm.schedule, sessions: newState}})
    setData(prev => rx)*/
  }

  const updateStudyArm = (
    oldState: StudyArm[],
    index: number,
    arm: StudyArm,
  ) => {
    const x = [...oldState]

    x.splice(index, 1, arm)

    setData(x)
  }


  if (!studyArms) {
    return <h1>Please add some sessions to this study</h1>
  }

  return (
    <div>
       <Fab color="primary" onClick={()=>setHasObjectChanged(false)} aria-label="add" style={{position: 'fixed', right: '30px', zIndex: 100, display: hasObjectChanged? 'block': 'none' }}>
        Save
      </Fab>
      <FormControlLabel
        classes={{ label: classes.labelDuration }}
        label="Study Duration"
        style={{ fontSize: '16px' }}
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

      {/*<ObjectDebug label="groups" data={studyArms}></ObjectDebug>*/}
      {studyDuration && (
        <>
          <GroupsEditor
            studyArms={studyArms}
            onAddStudyArm={
              () => {}
              /*groupsUpdateFn({
              type: Types.AddStudyArm,
              payload: { isMakeActive: false },
            })*/
            }
            onRemoveStudyArm={(id: string) => {
              /* groupsUpdateFn({
              type: Types.RemoveStudyArm,
              payload: { id },
            })*/
            }}
            onSetActiveStudyArm={(id: string) => {
              /* groupsUpdateFn({
              type: Types.SetActiveStudyArm,
              payload: { id },
            })*/
            }}
            onRenameStudyArm={(id: string, name: string) => {
              /* groupsUpdateFn({
              type: Types.RenameStudyArm,
              payload: { id, name },
            })*/
            }}
            onCopyStudyArm={() => {
              /*groupsUpdateFn({
              type: Types.AddStudyArm,
              payload: {
                group: groups[groups!.length - 1],
                isMakeActive: false,
              },
            })*/
            }}
          >
            {studyArms.map((studyArm, index) => (
              <TabPanel
                value={studyArms.findIndex(studyArm => studyArm.active)}
                index={index}
                key={studyArm.name}
              >
                <SchedulingFormSection
                  label="Define Day 1:"
                  style={{ marginLeft: '325px' }}
                >
                  <RadioGroup
                    aria-label="Day 1"
                    name="day1"
                    value={studyArm.pseudonym}
                    onChange={e =>
                      updateStudyArm(studyArms, index, {
                        ...studyArms[index],
                        pseudonym: e.target.value,
                      })
                    }
                  >
                    <FormControlLabel
                      value={'ONBOARDING'}
                      control={<Radio />}
                      label="Right after completion of onboarding session"
                    />

                    <FormControlLabel
                      value={'START_DATE'}
                      control={<Radio />}
                      label="Start Date (usually clinic visit) to be defined in Participant Manager"
                    />
                  </RadioGroup>
                </SchedulingFormSection>

                {studyArm.schedule.sessions.map((session, index) => (
                  <Box key={session.id}>
                    <SchedulableSingleSessionContainer
                      key={session.id}
                      studySession={session}
                      onSetActiveSession={() =>
                        groupsUpdateFn({
                          type: Types.SetActiveSession,
                          payload: { sessionId: session.id },
                        })
                      }
                    ></SchedulableSingleSessionContainer>
                  </Box>
                ))}
              </TabPanel>
            ))}
          </GroupsEditor>
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
