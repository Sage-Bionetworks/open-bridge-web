import React from 'react'
import StudyService from '../services/study.service'
import { StudyBuilderInfo } from '../types/types'
import { useAsync } from './AsyncHook'
import { useUserSessionDataState } from './AuthContext'

export const useStudyBuilderInfo = (id: string | undefined) => {
  const { token } = useUserSessionDataState()

  const { data, status, error, run, setData } = useAsync<
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
    let schedule
    if (study.scheduleGuid) {
      schedule = await StudyService.getStudySchedule(study.scheduleGuid, token!)
    }
    //after we are using a real back end if there is a guid there will be a schedule
    if (!study.scheduleGuid || !schedule) {
      //create new schedule for new study
      const scheduleGuid = await StudyService.createStudySchedule(
        `${study.name} schedule`,
        'P2W',
        token!,
      )
      await StudyService.updateStudy(
        { ...study, scheduleGuid },
        token!,
      )
      study.scheduleGuid = scheduleGuid
      schedule = await StudyService.getStudySchedule(study.scheduleGuid, token!)
    }

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
