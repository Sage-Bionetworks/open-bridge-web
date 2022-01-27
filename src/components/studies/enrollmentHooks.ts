import {useUserSessionDataState} from '@helpers/AuthContext'
import ParticipantService from '@services/participants.service'
import {
  EnrolledAccountRecord,
  ExtendedError,
  ParticipantAccountSummary,
} from '@typedefs/types'
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

  return useQuery<
    (EnrolledAccountRecord & ParticipantAccountSummary) | null,
    ExtendedError
  >(
    ENROLLMENT_KEYS.detail(studyId, userId!),
    () => {
      const enrollment = ParticipantService.getUserEnrollmentInfo(
        studyId,
        userId!,
        token!
      )
      const participant = ParticipantService.getParticipant(
        studyId,
        userId!,
        token!
      )
      return Promise.all([enrollment, participant]).then(result => ({
        ...result[0],
        ...result[1],
      }))
    },
    {
      enabled: !!studyId && !!userId && !!token,
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
