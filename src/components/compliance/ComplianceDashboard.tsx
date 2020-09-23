import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type ComplianceDashboardOwnProps = {
  title?: string
  paragraph?: string
}

type ComplianceDashboardProps = ComplianceDashboardOwnProps &
  RouteComponentProps

const ComplianceDashboard: FunctionComponent<ComplianceDashboardProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>Compliance Dashboard</h2>
    <p>{paragraph}</p>
  </aside>
)

export default ComplianceDashboard
