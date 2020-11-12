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
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from '@material-ui/core'
import SchedulingFormSection from './SchedulingFormSection'

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
  const studyArm: StudyArm = {
    studyId: id,
    name: 'Untitled',
    pseudonym: '',
    active: true,
    schedule: {
      name: 'Undefined',
      eventStartId: '123',
      sessions: [],
    },
  }
  const handleError = useErrorHandler()
  console.log('section', section)
  const { data: studyArms, status, error, run, setData } = useAsync<StudyArm[]>(
    {
      status: id ? 'PENDING' : 'IDLE',
      data: [studyArm],
    },
  )

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(
      StudyService.getStudyArms(id).then(arms => {
        console.log('arms', arms)
        return arms
      }),
    )
  }, [id, run])

  if (status === 'REJECTED') {
    handleError(error!)
  } else if (status === 'PENDING') {
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
    console.log(x)
    setData(x)
  }

  if (!studyArms) {
    return <>NOTHING</>
  }

  return (
    <div>
      <div>Scheduler</div>
      {/*<ObjectDebug label="groups" data={studyArms}></ObjectDebug>*/}

      <LoadingComponent reqStatusLoading={status}>
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
              <SchedulingFormSection label="Define Day 1:" style={{marginLeft: '325px'}}>
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
              
           

              {studyArm.schedule.sessions.map(session => (
                <Box>
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
      </LoadingComponent>
    </div>
  )
}

export default Scheduler
