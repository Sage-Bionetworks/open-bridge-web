import React from 'react'
import ScheduleService from '../services/schedule.service'
import StudyService from '../services/study.service'
import {StudyBuilderInfo} from '../types/types'
import {useAsync} from './AsyncHook'
import {useUserSessionDataState} from './AuthContext'

export const useStudyBuilderInfo = (id: string | undefined) => {
  const {token} = useUserSessionDataState()

  const {data, status, error, run, setData} = useAsync<
    StudyBuilderInfo | undefined
  >({
    status: id ? 'PENDING' : 'IDLE',
    data: undefined,
  })

  const getData = async (id: string) => {
    const study = await StudyService.getStudy(id, token!)
    if (!study) {
      throw Error(`Study with an identifier ${id} can not be found`)
    }
    let schedule = undefined
    try {
      schedule = await ScheduleService.getStudySchedule(
        study.identifier,
        token!
      )
    } catch (e) {
      console.log('no schedule')
    }

    return {schedule, study}
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
