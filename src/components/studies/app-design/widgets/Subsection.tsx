import {Typography} from '@mui/material'
import React from 'react'

const Subsection: React.FunctionComponent<{heading: string}> = ({heading, children}) => {
  return (
    <li>
      <div style={{width: '100%'}}>
        <Typography variant="h4" sx={{mb: 1}}>
          {heading}
        </Typography>
        {children}
      </div>
    </li>
  )
}

export default Subsection
