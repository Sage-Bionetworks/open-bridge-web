import {Box, Tooltip} from '@mui/material'
import {FunctionComponent} from 'react'

const RowLabel: FunctionComponent<{
  wkInStudy: number
  burstNum?: number
  sessionName: string
}> = ({wkInStudy, burstNum, sessionName}) => {
  const label = `Week ${wkInStudy}/${
    burstNum !== undefined ? `Burst ${burstNum}` : ''
  }/${sessionName}`

  return (
    <Tooltip title={label}>
      <Box
        sx={{
          width: '130px',
          display: 'block',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}>
        {label}
      </Box>
    </Tooltip>
  )
}

export default RowLabel
