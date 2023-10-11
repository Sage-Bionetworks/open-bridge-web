import { Box } from '@mui/material'
import { theme } from '@style/theme'
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone'
import React, {FunctionComponent} from 'react'

const ReadOnlyBanner: React.FunctionComponent<{label: String}> = ({
  label,
}) => <Box
  sx={{
    backgroundColor: 'rgba(255, 168, 37, 0.15)',
    textAlign: 'left',
    fontSize: '16px',

    display: 'flex',
    padding: theme.spacing(1, 8),
  }}>
  <ErrorTwoToneIcon sx={{ color: '#FFA825' }}></ErrorTwoToneIcon>&nbsp;&nbsp;This {label} is in read-only mode and
  can not be edited.
</Box>

export default ReadOnlyBanner