import { useState, useEffect } from 'react'
import { Assessment, Study, StudySession } from '../types/types'
import AssessmentService from '../services/assessment.service'
import { useAsync } from './AsyncHook'
import React from 'react'
import StudyService from '../services/study.service'

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
