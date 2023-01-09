import {Box, Typography} from '@mui/material'
import {theme} from '@style/theme'

const ParticipantAdherenceContentShell: React.FunctionComponent<{title?: string; children: React.ReactNode}> = ({
  title,
  children,
}) => {
  return (
    <Box
      id="participantAdherenceContentShell"
      sx={{
        background: 'linear-gradient(360deg, #EDEEF2 0%, #FAFAFB 85.05%)',
        padding: theme.spacing(2, 7, 0, 7),
      }}>
      {title && (
        <Typography variant="h2" sx={{marginBottom: theme.spacing(4)}}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  )
}

export default ParticipantAdherenceContentShell
