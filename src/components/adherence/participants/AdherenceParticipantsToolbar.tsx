import {useUserSessionDataState} from '@helpers/AuthContext'
import {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'

type AdherenceParticipantsToolbarProps = {
  studyId?: string
}

const AdherenceParticipantsToolbar: FunctionComponent<AdherenceParticipantsToolbarProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const {token} = useUserSessionDataState()

  return <div>Adherence Grid</div>
}

export default AdherenceParticipantsToolbar
