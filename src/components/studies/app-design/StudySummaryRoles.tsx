import React from 'react'

import {Box, SxProps, Typography} from '@mui/material'
import {theme} from '@style/theme'

type StudySummaryRoleProps = {
  type: String
  name: String
  sx?: SxProps
}

const StudySummaryRoles: React.FunctionComponent<StudySummaryRoleProps> = ({type, name, sx}) => {
  return (
    <Box sx={{wordWrap: 'break-word', textAlign: 'left', ...sx}}>
      <Typography variant="h4" sx={{color: '#060606', fontWeight: 400}}>
        {name}
      </Typography>
      <Typography variant="h4" sx={{color: theme.palette.grey[700], fontStyle: 'italic', fontWeight: 400}}>
        {type}
      </Typography>
    </Box>
  )
}
export default StudySummaryRoles
