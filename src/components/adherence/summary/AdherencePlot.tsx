import {useUserSessionDataState} from '@helpers/AuthContext'
import {FunctionComponent} from 'react'

type AdherencePlotProps = {
  studyId?: string
}

const AdherencePlot: FunctionComponent<AdherencePlotProps> = () => {
  const {token} = useUserSessionDataState()

  return <div>Adherence Plot</div>
}

export default AdherencePlot
