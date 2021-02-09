import React from 'react'
import StudyService from '../services/study.service'
import { StudyBuilderInfo } from '../types/types'
import { useAsync } from './AsyncHook'
import { useUserSessionDataState } from './AuthContext'


export const useStudyBuilderInfo = (id: string | undefined) => {
  const { token } = useUserSessionDataState()

  const { data, status, error, run, setData } = useAsync<StudyBuilderInfo | undefined>({
    status: id ? 'PENDING' : 'IDLE',
    data: undefined,
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
  }, [id, run, token])

  return {
    setData,

    error,
    status,
    data,
    run,
  }
}

