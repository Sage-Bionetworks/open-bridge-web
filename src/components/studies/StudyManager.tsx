import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import {  RouteComponentProps } from 'react-router-dom'
import StudyService from '../../services/study.service'
import { Study } from '../../types/types'
import StudyCard from './StudyCard'
//import { StudySessionsProvider } from '../../helpers/StudySessionsContext'
//import SessionsCreator from './session-creator/SessionsCreator'

type StudyManagerOwnProps = {
  title?: string
  paragraph?: string
}

type StudyManagerProps = StudyManagerOwnProps & RouteComponentProps

const StudyManager: FunctionComponent<StudyManagerProps> = () => {
  const [studies, setStudies] = React.useState<Study[]>([])

  useEffect(() => {
    let isSubscribed = true
    const getInfo = async () => {
      if (isSubscribed) {
        try {
          //setIsLoading(true)

          const assessments = await StudyService.getStudies()

          if (isSubscribed) {
            setStudies(assessments)
          }
        } catch (e) {
          // isSubscribed && setError(e)
        } finally {
          // isSubscribed && setIsLoading(false)
        }
      }
    }

    getInfo()

    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <>
      <h2>Study Manager</h2>
      {/* <StudySessionsProvider>
      <SessionsCreator></SessionsCreator>
     </StudySessionsProvider>*/}
      {studies.map((a, index) => (
         <Link
       
    
         key={index}
         variant="body2"
         href={`/study-editor/${a.id}`}
        
       >
        <StudyCard study={a}></StudyCard>
        </Link>
      ))}
    </>
  )
}

export default StudyManager
