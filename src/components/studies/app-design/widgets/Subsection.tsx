import {Typography} from '@mui/material'
import React from 'react'

const Subsection: React.FunctionComponent<{heading: string; variant?: 'h4' | 'h5'}> = ({
  heading,
  children,
  variant = 'h4',
}) => {
  return (
    <li>
      <div style={{width: '100%'}}>
        <Typography variant={variant} sx={{mb: 1}}>
          {heading}
        </Typography>
        {children}
      </div>
    </li>
  )
}

export default Subsection
