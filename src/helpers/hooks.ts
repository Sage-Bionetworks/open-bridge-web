import React, { useEffect, useState } from 'react'
import { StudySection } from '../components/studies/sections'
import AssessmentService from '../services/assessment.service'
import StudyService from '../services/study.service'
import { Schedule, StudySession } from '../types/scheduling'
import { Assessment, Study } from '../types/types'
import { useAsync } from './AsyncHook'
import { useUserSessionDataState } from './AuthContext'

const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    let isSubscribed = true
    const getInfo = async () => {
      if (isSubscribed) {
        try {
          //setIsLoading(true)

          const assessments = await AssessmentService.getAssessments()

          if (isSubscribed) {
            setAssessments(assessments)
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
  return assessments
}

export const useStudySessions = (id: string | undefined) => {
  const { data, status, error, run, setData, setError } = useAsync<
    StudySession[]
  >({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })
  const { token} = useUserSessionDataState()

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudySessions(id, token!).then(sessions => sessions))
  }, [id, run])

  return {
    setData,
    setError,
    error,
    status,
    data,
    run,
  }
}


export const useNavigate = (section: StudySection, nextSection: StudySection, savePromise: Function, parentCallback: Function) => {
  
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)

  async function save (nextSection?: StudySection)  {
    if (hasObjectChanged) {
    console.log(
      'hook save'
    )
    setSaveLoader(true)
    const done = await savePromise()// await StudyService.saveStudySessions(id, sessions || [])
    setHasObjectChanged(false)
    setSaveLoader(false)
    }
    if (nextSection) {
      parentCallback(nextSection)
    }
  }
  
  React.useEffect(() => {
    if (nextSection !== section) {
      save(nextSection)
    }
  }, [nextSection, section])

  return {hasObjectChanged, setHasObjectChanged, saveLoader, setSaveLoader, save}
}


export const useStudyBuilderInfo  = (id: string | undefined, section: StudySection) => {
  const { token} = useUserSessionDataState()
  
  const { data, status, error, run, setData } = useAsync<{
    schedule: Schedule  | null
    study: Study | null
  }>({
    status: id ? 'PENDING' : 'IDLE',
    data: {schedule: null, study: null},
  })

  const getData = async (id: string) => {
    const schedule = await StudyService.getStudySchedule(id, token!)
    const study = await StudyService.getStudy(id, token!)

    return { schedule, study }
  }


  React.useEffect(() => {
    if (!id || !token) {
      return
    }
    return run(getData(id))
  }, [id, run, token, section])

  return {
    setData,
 
    error,
    status,
    data,
    run,
  }
}



export const useStudy = (id: string | undefined) => {
  const { token} = useUserSessionDataState()
  const { data, status, error, run, setData, setError } = useAsync<Study>({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })

  React.useEffect(() => {
    if (!id || !token) {
      return
    }
    return run(StudyService.getStudy(id, token))
  }, [id, run, token])

  return {
    setData,
    setError,
    error,
    status,
    data,
    run,
  }
}

export default useAssessments
