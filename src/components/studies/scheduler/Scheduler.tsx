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
import SchedulableStudySessionContainer from './SchedulableStudySessionContainer'
import ObjectDebug from '../../widgets/ObjectDebug'

type SchedulerOwnProps = {
  title?: string
  paragraph?: string
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = () => {
  const [groups, groupsUpdateFn] = useReducer(actionsReducer, [])
  const [reqStatus, setRequestStatus] = React.useState<RequestStatus>('PENDING')

  const [groupTabIndex, setGroupTabIndex] = useState(0)
  let { id } = useParams<{ id: string }>()
  const handleError = useErrorHandler()

  useEffect(() => {
    let activeIndex = groups.findIndex(item => item.active === true)
    if (activeIndex === -1) {
      activeIndex = 0
    }
    setGroupTabIndex(activeIndex)
  }, [groups])

  useEffect(() => {
    let isSubscribed = true

    StudyService.getStudy(id).then(
      study => {
        if (isSubscribed && study) {
          groupsUpdateFn({
            type: Types.SetGroups,
            payload: { groups: study.groups },
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
      <ObjectDebug label="groups" data={groups}></ObjectDebug>

      <LoadingComponent reqStatusLoading={reqStatus}>
        <TabsMtb
          value={groupTabIndex}
          handleChange={(groupIndex: number) => {
            const id = groups[groupIndex].id
            groupsUpdateFn({
              type: Types.SetActiveGroup,
              payload: { id: id },
            })
          }}
          tabDataObjects={groups.map(group => ({
            label: group.name,
            id: group.id,
          }))}
        ></TabsMtb>

        {groups.map((group, index) => (
          <TabPanel
            value={groups.findIndex(group => group.active)}
            index={index}
            key={group.id}
          >
            <div>
              {group.sessions.map(session => (
                <SchedulableStudySessionContainer
                  key={session.id}
                  studySession={session}
                  onSetActiveSession={() =>
                    groupsUpdateFn({
                      type: Types.SetActiveSession,
                      payload: { sessionId: session.id },
                    })
                  }
                ></SchedulableStudySessionContainer>
              ))}
            </div>
          </TabPanel>
        ))}
      </LoadingComponent>
    </>
  )
}

export default Scheduler
