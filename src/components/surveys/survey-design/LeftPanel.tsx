import {Box} from '@mui/material'
import React from 'react'

const LeftPanel: React.FunctionComponent<{children: React.ReactNode}> = ({
  children,
}) => {
  return (
    <Box>
      Survey Name /Preview Link
      {children}
    </Box>
  )
}
export default LeftPanel
