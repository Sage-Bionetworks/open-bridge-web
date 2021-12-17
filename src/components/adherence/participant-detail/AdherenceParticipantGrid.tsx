import {useUserSessionDataState} from '@helpers/AuthContext'
import {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'

type AdherenceParticipantGridProps = {
  studyId?: string
}

const AdherenceParticipantGrid: FunctionComponent<AdherenceParticipantGridProps> =
  () => {
    let {id: studyId} = useParams<{
      id: string
    }>()

    const {token} = useUserSessionDataState()

    return <div>Adherence Grid</div>
  }

export default AdherenceParticipantGrid
