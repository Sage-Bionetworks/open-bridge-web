import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>Participant Manager</h2>
    <p>{paragraph}</p>
  </aside>
)

export default ParticipantManager
