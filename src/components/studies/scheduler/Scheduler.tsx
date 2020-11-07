import React, {
  FunctionComponent,
  useEffect,
  useReducer,
  useState,
} from 'react'
import Link from '@material-ui/core/Link'
import { RouteComponentProps, useParams } from 'react-router-dom'
import StudyService from '../../../services/study.service'
import { RequestStatus } from '../../../types/types'
import TabsMtb from '../../widgets/TabsMtb'
import actionsReducer, { Types } from '../session-creator/sessionActions'
import TabPanel from '../../widgets/TabPanel'
import LoadingComponent from '../../widgets/Loader'
import { useErrorHandler } from 'react-error-boundary'
import SchedulableSingleSessionContainer from './SchedulableStudySessionContainer'
import ObjectDebug from '../../widgets/ObjectDebug'

type SchedulerOwnProps = {
  title?: string
  paragraph?: string
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = () => {
  const [sessions, groupsUpdateFn] = useReducer(actionsReducer, [])
  const [reqStatus, setRequestStatus] = React.useState<RequestStatus>('PENDING')

  let { id } = useParams<{ id: string }>()
  const handleError = useErrorHandler()

  useEffect(() => {
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
  }, [handleError, id])

  return (
    <>
      <div>Scheduler</div>
      <ObjectDebug label="groups" data={sessions}></ObjectDebug>

      <LoadingComponent reqStatusLoading={reqStatus}>
        <div>
          {sessions.map(session => (
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
      </LoadingComponent>
    </>
  )
}

export default Scheduler
