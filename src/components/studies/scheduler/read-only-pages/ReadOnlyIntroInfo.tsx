import {BuilderWrapper} from '@components/studies/StudyBuilder'
import {Box, Typography} from '@mui/material'
import {getFormattedTimeDateFromPeriodString} from '../utility'

const ReadOnlyIntroInfo: React.FunctionComponent<{name: string; duration?: string}> = ({name, duration}) => {
  return (
    <BuilderWrapper sectionName="Study Details" isReadOnly>
      <Box sx={{textAlign: 'left'}}>
        <Typography variant="h2" sx={{mb: 3}}>
          Study Details
        </Typography>
        <Typography variant="h4" sx={{mb: 1}}>
          Study Name
        </Typography>
        <Typography> {name}</Typography>
        <Typography variant="h4" sx={{mb: 1, mt: 4.5}}>
          How long is your study?
        </Typography>
        <Typography sx={{textTransform: 'capitalize'}}>
          {' '}
          {duration ? getFormattedTimeDateFromPeriodString(duration) : 'n/a'}
        </Typography>
      </Box>
    </BuilderWrapper>
  )
}
export default ReadOnlyIntroInfo
