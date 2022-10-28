import React from 'react'
import {MTBHeadingH4} from '../../widgets/Headings'
import {Box} from '@mui/material'

type StudySummaryRoleProps = {
  type: String
  name: String
  className?: string
}

const StudySummaryRoles: React.FunctionComponent<StudySummaryRoleProps> = ({
  type,
  name,
  className,
}) => {
  return (
    <Box
      className={className}
      style={{wordWrap: 'break-word', textAlign: 'left'}}>
      <MTBHeadingH4>{name}</MTBHeadingH4>
      {type}
    </Box>
  )
}
export default StudySummaryRoles
