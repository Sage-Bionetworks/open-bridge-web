import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'
import SessionsCreator from './session-creator/SessionsCreator'

type StudyManagerOwnProps = {
  title?: string
  paragraph?: string
}

type StudyManagerProps = StudyManagerOwnProps & RouteComponentProps

const StudyManager: FunctionComponent<StudyManagerProps> = () => {
  return (
    <aside>
      <h2>Study Manager</h2>
      <SessionsCreator></SessionsCreator>
    </aside>
  )
}

export default StudyManager
