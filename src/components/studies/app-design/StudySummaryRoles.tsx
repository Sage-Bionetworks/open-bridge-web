import React from 'react'
import { MTBHeadingH4 } from '../../widgets/Headings'

type StudySummaryRoleProps = {
  type: String
  name: String
}

const StudySummaryRoles: React.FunctionComponent<StudySummaryRoleProps> = ({
  type,
  name,
}) => {
  return (
    <div style={{ wordWrap: 'break-word', textAlign: 'left' }}>
      <MTBHeadingH4>{name}</MTBHeadingH4>
      {type}
    </div>
  )
}
export default StudySummaryRoles
