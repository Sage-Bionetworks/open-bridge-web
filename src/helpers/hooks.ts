import {Schedule} from '@typedefs/scheduling'
import React, {Dispatch} from 'react'
import {useQuery} from 'react-query'
import ScheduleService from '../services/schedule.service'
import StudyService from '../services/study.service'
import {Study} from '../types/types'
import {useUserSessionDataState} from './AuthContext'
import {Action} from './StudyInfoContext'

export const useStudyBuilderInfo = (
  studyId: string | undefined,
  studyDataUpdateFn: Dispatch<Action>,
  shouldGetScheduleResources: boolean = true
) => {
  const {token} = useUserSessionDataState()

  const {
    data: studyData,
    error: studyError,
    status: studyStatus,
  } = useQuery<Study | undefined, Error>(
    ['getStudy', studyId, token],
    () => StudyService.getStudy(studyId!, token!),
    {
      enabled: !!studyId,
    }
  )

  const {
    data: scheduleData,
    error: scheduleError,
    status: scheduleStatus,
  } = useQuery<Schedule | undefined, Error>(
    ['getSchedule', studyId, token, shouldGetScheduleResources],
    () => {
      return ScheduleService.getSchedule(
        studyId!,
        token!,
        shouldGetScheduleResources
      )
    },
    {
      enabled: !!studyId,
      retry: false,
    }
  )

  React.useEffect(() => {
    if (
      studyStatus === 'success' &&
      (scheduleStatus === 'success' || scheduleStatus === 'error')
    ) {
      studyDataUpdateFn({
        type: 'SET_ALL',
        payload: {study: studyData!, schedule: scheduleData},
      })
    }
  }, [
    scheduleData,
    scheduleError,
    scheduleStatus,
    studyStatus,
    studyData,
    studyError,
    studyDataUpdateFn,
  ])
  const isLoading = studyStatus === 'loading' || scheduleStatus === 'loading'

  return {studyError, isLoading, study: studyData, schedule: scheduleData}
}
