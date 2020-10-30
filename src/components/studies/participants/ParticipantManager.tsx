import React, { FunctionComponent, useEffect } from 'react'
import Link from '@material-ui/core/Link'
import { RouteComponentProps, useParams } from 'react-router-dom'
import StudyHeader from '../StudyHeader'

//import { StudySessionsProvider } from '../../helpers/StudySessionsContext'
//import SessionsCreator from './session-creator/SessionsCreator'

type ParticipantManagerOwnProps = {
  title?: string
  paragraph?: string
}

type ParticipantManagerProps = ParticipantManagerOwnProps & RouteComponentProps

const ParticipantManager: FunctionComponent<ParticipantManagerProps> = () => {
  let { id } = useParams<{ id: string }>()
  /*const [studies, setStudies] = React.useState<Study[]>([])

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
  }, [])*/

  return (
    <>
      <StudyHeader studyId={id} />
      <h2>Participant Managerc</h2>
      studyId {id}
    </>
  )
}

export default ParticipantManager
