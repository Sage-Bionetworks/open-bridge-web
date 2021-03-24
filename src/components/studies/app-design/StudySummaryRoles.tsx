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
    <div style={{ marginTop: '20px' }}>
      <MTBHeadingH4>{name}</MTBHeadingH4>
      {type}
    </div>
  )
}
export default StudySummaryRoles
