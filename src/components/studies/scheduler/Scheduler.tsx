import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import {  RouteComponentProps } from 'react-router-dom'
import StudyService from '../../../services/study.service'
import { Study } from '../../../types/types'

//import { StudySessionsProvider } from '../../helpers/StudySessionsContext'
//import SessionsCreator from './session-creator/SessionsCreator'

type SchedulerOwnProps = {
  title?: string
  paragraph?: string
}

type SchedulerProps = SchedulerOwnProps & RouteComponentProps

const Scheduler: FunctionComponent<SchedulerProps> = () => {
  const [studies, setStudies] = React.useState<Study[]>([])


  return (
    <>
    <div>Scheduler</div>
    </>
  )
}

export default Scheduler
