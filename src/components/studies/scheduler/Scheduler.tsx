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

type SchedulerOwnProps = {
  studySessions: StudySession[]
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = ({
  studySessions,
}: SchedulerOwnProps) => {
  const studyArm: StudyArm = {
    name: 'Untitled',
    pseudonym: '',
    active: true,
    schedule: {
      name: 'Undefined',
      eventStartId: '123',
      sessions: studySessions,
    },
  }
  const [studyArms, setData] = React.useState<StudyArm[]>([studyArm])
  const [reqStatus, setRequestStatus] = React.useState<RequestStatus>(
    'RESOLVED',
  )

  // let { id } = useParams<{ id: string }>()
  const handleError = useErrorHandler()
  const groupsUpdateFn = (action: SessionAction) => {
    const newState = actionsReducer(studyArms[0].schedule.sessions!, action)
    console.log('setting data  to ', newState)
    const rx= studyArms.map((arm, index) => index > 0? arm : {...arm, schedule: {...arm.schedule, sessions: newState}})
    setData(prev => rx)
  }

  /* useEffect(() => {
    let isSubscribed = true

    StudyService.getStudySessions(id).then(
      sessions => {
        if (isSubscribed && sessions) {
          groupsUpdateFn({
            type: Types.SetSessions,
            payload: { sessions },
          })
          setRequestStatus('RESOLVED')
        }
      },
      e => handleError(e),
    )

    return () => {
      isSubscribed = false
    }
  }, [handleError, id])*/

  return (
    <>
      <div>Scheduler</div>
      <ObjectDebug label="groups" data={studyArms}></ObjectDebug>

      <LoadingComponent reqStatusLoading={reqStatus}>
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
              <div >
                {studyArm.schedule.sessions.map(session => (
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
                ))}
              </div>
            </TabPanel>
          ))}
        </GroupsEditor>
      </LoadingComponent>
    </>
  )
}

export default Scheduler
