import {Box, Grid} from '@mui/material'
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
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <AdherenceAlerts studyId={studyId} />
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdherenceSummary
