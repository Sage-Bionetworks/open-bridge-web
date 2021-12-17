import {useUserSessionDataState} from '@helpers/AuthContext'
import {FunctionComponent} from 'react'
import {Link, useParams} from 'react-router-dom'

type AdherenceParticipantsGridProps = {
  studyId?: string
}

const AdherenceParticipantsGrid: FunctionComponent<AdherenceParticipantsGridProps> =
  () => {
    let {id: studyId} = useParams<{
      id: string
    }>()

    const {token} = useUserSessionDataState()

    return (
      <div>
        <Link to={'adherence/12345'}>testParticipant</Link>
      </div>
    )
  }

export default AdherenceParticipantsGrid
