import {useUserSessionDataState} from '@helpers/AuthContext'
import {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'

type AdherencePlotProps = {
  studyId?: string
}

const AdherencePlot: FunctionComponent<AdherencePlotProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const {token} = useUserSessionDataState()

  return <div>Adherence Plot</div>
}

export default AdherencePlot
