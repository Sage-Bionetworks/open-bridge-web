import {ReactComponent as StudyLive} from '@assets/launch/study_live.svg'

import {Button} from '@mui/material'
import {useStudy} from '@services/studyHooks'
import constants from '@typedefs/constants'
import React from 'react'
import {RouteComponentProps} from 'react-router'
import {useParams} from 'react-router-dom'
import StaticLayout1 from './StaticLayout1'

const Live: React.FunctionComponent<RouteComponentProps> = () => {
  let {id} = useParams<{
    id: string
  }>()

  const {data: study, error: studyError} = useStudy(id)
  if (!study) {
    return <></>
  }
  return (
    <>
      <StaticLayout1
        image={<StudyLive />}
        title={
          <>
            {' '}
            Congratulations, <i>{study.name}</i> is live!
          </>
        }
        subtitle={'You may now enroll Participants in your study.'}>
        <Button
          color="primary"
          variant="contained"
          href={constants.restrictedPaths.PARTICIPANT_MANAGER.replace(':id', study.identifier)}>
          Start Enrolling Participants
        </Button>
      </StaticLayout1>
    </>
  )
}

export default Live
