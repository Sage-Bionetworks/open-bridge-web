import {Schedule} from '@typedefs/scheduling'
import React, {Dispatch} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import ScheduleService from '../services/schedule.service'
import StudyService from '../services/study.service'
import {Study} from '../types/types'
import {useUserSessionDataState} from './AuthContext'
import {Action} from './StudyInfoContext'

export const KEYS = {
  study: 'study',
  schedule: 'schedule',
  studies: 'studies',
}

export const useStudy = (
  studyId: string | undefined
  // studyDataUpdateFn: Dispatch<Action>
) => {
  const {token} = useUserSessionDataState()

  return useQuery<Study | undefined, Error>(
    [KEYS.study, studyId, token],
    () => StudyService.getStudy(studyId!, token!),
    {
      enabled: !!studyId,
    }
  )
}

export const useStudies = () => {
  const {token} = useUserSessionDataState()

  return useQuery<Study[], Error>([KEYS.studies], () =>
    StudyService.getStudies(token!)
  )
}

export const useUpdateStudy = () => {
  const {token} = useUserSessionDataState()
  const queryClient = useQueryClient()

  const update = async (props: {
    study: Study
    action: 'UPDATE' | 'DELETE' | 'COPY' | 'CREATE'
  }) => {
    const {study, action} = props
    switch (action) {
      case 'DELETE':
        return await StudyService.removeStudy(study.identifier, token!)
      case 'UPDATE':
        return await StudyService.updateStudy(
          {...props.study /*, version: originalStudy!.version*/},
          token!
        )
      case 'COPY':
        return await StudyService.copyStudy(study.identifier!, token!)
      default:
        return await StudyService.createStudy(study, token!)
    }
  }

  const x = useMutation(update, {
    onMutate: async props => {
      queryClient.cancelQueries([KEYS.studies])
      queryClient.cancelQueries(KEYS.study)
      console.log('starting update')
      // Snapshot the previous value
      const {study, action} = props
      const previousStudies = queryClient.getQueryData<Study[]>([KEYS.studies])

      switch (action) {
        case 'UPDATE':
          if (previousStudies) {
            const updatedStudies = previousStudies.map(s =>
              s.identifier !== study.identifier
                ? s
                : {...study, version: study.version + 1}
            )
            console.log(updatedStudies)
            queryClient.setQueryData<Study[]>(
              [KEYS.studies],
              [...updatedStudies]
            )
          }
          break

        case 'DELETE':
          if (previousStudies) {
            const updatedStudies = previousStudies.filter(
              s => s.identifier !== study.identifier
            )
            console.log(updatedStudies)
            queryClient.setQueryData<Study[]>(
              [KEYS.studies],
              [...updatedStudies]
            )
          }
          break
        case 'COPY': {
          const updatedStudies = [...(previousStudies || [])]
          updatedStudies.unshift({
            ...study,
            identifier: '...',
            modifiedOn: new Date(),
            name: 'Copying ' + study.name + " and it's schedule...",
          })

          queryClient.setQueryData<Study[]>([KEYS.studies], [...updatedStudies])
          break
        }

        default: {
          const updatedStudies = [...(previousStudies || [])]
          updatedStudies.unshift({
            ...study,
          })

          queryClient.setQueryData<Study[]>([KEYS.studies], [...updatedStudies])
        }
      }

      return {previousStudies}
    },
    onError: (err, variables, context) => {
      alert('error')
      console.log(err, variables, context)
      /* if (context?.previousStudies) {
          queryClient.setQueryData<Study[]>(KEYS.studies, context.previousStudies)
        }*/
    },
    onSettled: async (data, error, newPost) => {
      queryClient.invalidateQueries([KEYS.studies])
    },
  })

  return x
}

export const useSchedule = (studyId: string | undefined) => {
  const {token} = useUserSessionDataState()

  return useQuery<Schedule | undefined, Error>(
    [KEYS.schedule, studyId, token],
    () => ScheduleService.getSchedule(studyId!, token!),
    {
      enabled: !!studyId,
      retry: false,
    }
  )
}

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
