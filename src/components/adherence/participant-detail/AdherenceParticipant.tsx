import {useStudy} from '@components/studies/studyHooks'
import BreadCrumb from '@components/widgets/BreadCrumb'
import NonDraftHeaderFunctionComponent from '@components/widgets/StudyIdWithPhaseImage'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {Box} from '@material-ui/core'
import constants from '@typedefs/constants'
import {FunctionComponent} from 'react'
import {RouteComponentProps, useParams} from 'react-router-dom'
import AdherenceParticipantGrid from './AdherenceParticipantGrid'

type AdherenceParticipantProps = {
  studyId?: string
}

const AdherenceParticipant: FunctionComponent<
  AdherenceParticipantProps & RouteComponentProps
> = () => {
  let {id: studyId} = useParams<{
    id: string
  }>()
  const {token} = useUserSessionDataState()

  const {
    data: study,
    error: studyError,
    isLoading: isStudyLoading,
  } = useStudy(studyId)

  return (
    <Box bgcolor="#F8F8F8" px={5}>
      <Box px={3} py={2} display="flex" alignItems="center">
        <NonDraftHeaderFunctionComponent study={study} />
      </Box>
      {`${constants.restrictedPaths.ADHERENCE_DATA.replace(
        ':id',
        studyId
      )}?tab=ENROLLED`}
      <BreadCrumb
        links={[
          {
            url: `${constants.restrictedPaths.ADHERENCE_DATA.replace(
              ':id',
              studyId
            )}?tab=ENROLLED`,

            text: 'Enrolled Participants',
          },
        ]}></BreadCrumb>
      <AdherenceParticipantGrid />
    </Box>
  )
}

export default AdherenceParticipant
