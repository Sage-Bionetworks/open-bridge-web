import React, { useEffect, useState } from 'react'
import AssessmentService from '../services/assessment.service'
import StudyService from '../services/study.service'
import { StudySession } from '../types/scheduling'
import { Assessment, Study } from '../types/types'
import { useAsync } from './AsyncHook'
import { navigateAndSave } from './utility'

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

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudySessions(id).then(sessions => sessions))
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


export const useNavigate = (id: string, section: string, nextSection: string, savePromise: Function) => {
  
  const [hasObjectChanged, setHasObjectChanged] = React.useState(false)
  const [saveLoader, setSaveLoader] = React.useState(false)

  async function save (url?: string)  {
    console.log(
      'hook save'
    )
    setSaveLoader(true)
    const done = await savePromise()// await StudyService.saveStudySessions(id, sessions || [])
    setHasObjectChanged(false)
    setSaveLoader(false)
    if (url) {
      window.location.replace(url)
    }
  }
  
  
  
  
  React.useEffect(() => {
    navigateAndSave(id, nextSection, section, hasObjectChanged, save)
  }, [id, nextSection, section])

  return {hasObjectChanged, setHasObjectChanged, saveLoader, setSaveLoader, save}
}

export const useStudy = (id: string | undefined) => {
  const { data, status, error, run, setData, setError } = useAsync<Study>({
    status: id ? 'PENDING' : 'IDLE',
    data: null,
  })

  React.useEffect(() => {
    if (!id) {
      return
    }
    return run(StudyService.getStudy(id))
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

export default useAssessments
