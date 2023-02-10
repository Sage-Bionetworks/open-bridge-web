import {Box} from '@mui/material'
import {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'
import AdherenceAlerts from './AdherenceAlerts'

type AdherenceSummaryProps = {
  studyId?: string
}

const AdherenceSummary: FunctionComponent<AdherenceSummaryProps> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()
  return (
    <Box>
      {/*<AdherencePlot />*/}
      <AdherenceAlerts studyId={studyId} />
    </Box>
  )
}

export default AdherenceSummary
