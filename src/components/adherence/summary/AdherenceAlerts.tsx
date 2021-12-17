import {useUserSessionDataState} from '@helpers/AuthContext'
import {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'

type AdherenceAlertsProps = {
  studyId?: string
}

const AdherenceAlerts: FunctionComponent<AdherenceAlertsProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const {token} = useUserSessionDataState()

  return <div>Adherence Plot</div>
}

export default AdherenceAlerts
