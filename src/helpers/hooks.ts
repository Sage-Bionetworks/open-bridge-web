import { useState, useEffect } from 'react'
import { Assessment } from '../types/types'
import AssessmentService from '../services/assessment.service'

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

export default useAssessments
