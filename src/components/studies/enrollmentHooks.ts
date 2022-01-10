import {useUserSessionDataState} from '@helpers/AuthContext'
import ParticipantService from '@services/participants.service'
import {ExtendedError, ParticipantAccountSummary} from '@typedefs/types'
import {useQuery} from 'react-query'

const ENROLLMENT_KEYS = {
  all: ['enrollment'] as const,
  list: (studyId: string) => [...ENROLLMENT_KEYS.all, 'list', studyId] as const,

  detail: (studyId: string, userId: string) =>
    [...ENROLLMENT_KEYS.list(studyId), userId] as const,
}

export const useEnrollmentForParticipant = (
  studyId: string,
  userId: string | undefined
) => {
  const {token} = useUserSessionDataState()
  if (!userId) {
    console.log('NEED TO DO')
  }

  return useQuery<ParticipantAccountSummary | null, ExtendedError>(
    ENROLLMENT_KEYS.detail(studyId, userId!),
    () => ParticipantService.getActiveParticipantById(studyId, token!, userId!),
    {
      enabled: !!studyId && !!userId && !!token,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
