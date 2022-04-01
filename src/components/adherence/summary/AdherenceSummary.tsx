import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box} from '@mui/material'
import {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'
import AdherenceAlerts from './AdherenceAlerts'
import AdherencePlot from './AdherencePlot'

type AdherenceSummaryProps = {
  studyId?: string
}

const AdherenceSummary: FunctionComponent<AdherenceSummaryProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()

  const {token} = useUserSessionDataState()

  return (
    <Box>
      <AdherencePlot />
      <AdherenceAlerts />
    </Box>
  )
}

export default AdherenceSummary
