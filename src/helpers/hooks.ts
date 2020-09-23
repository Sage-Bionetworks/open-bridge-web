import { useState, useEffect } from 'react'
import { Assessment } from '../types/types'
import AssessmentService from '../services/assessment.service'

const useAssessments = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    let isSubscribed = true
    const getInfo = async () => {
      console.log('jere')
      if (isSubscribed) {
        try {
          //setIsLoading(true)

          const assessments = await AssessmentService.getAssessments()
          console.log('a', assessments)

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
