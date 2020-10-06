import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'
//import { StudySessionsProvider } from '../../helpers/StudySessionsContext'
//import SessionsCreator from './session-creator/SessionsCreator'

type StudyManagerOwnProps = {
  title?: string
  paragraph?: string
}

type StudyManagerProps = StudyManagerOwnProps & RouteComponentProps

const StudyManager: FunctionComponent<StudyManagerProps> = () => {
  return (
<>
      <h2>Study Manager</h2>
     {/* <StudySessionsProvider>
      <SessionsCreator></SessionsCreator>
     </StudySessionsProvider>*/}
</>
  )
}

export default StudyManager
