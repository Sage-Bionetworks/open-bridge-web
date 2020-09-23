import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type DevelopmentTeamOwnProps = {
  title: string
  paragraph: string
}

type DevelopmentTeamProps = DevelopmentTeamOwnProps & RouteComponentProps

const DevelopmentTeam: FunctionComponent<DevelopmentTeamProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}DevelopmentTeam</h2>
    <p>{paragraph}</p>
  </aside>
)

export default DevelopmentTeam
