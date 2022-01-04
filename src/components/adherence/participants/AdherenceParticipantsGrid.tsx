import Loader from '@components/widgets/Loader'
import {useAsync} from '@helpers/AsyncHook'
import ParticipantService from '@services/participants.service'
import {EnrolledAccountRecord} from '@typedefs/types'
import React, {FunctionComponent} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Link} from 'react-router-dom'

type AdherenceParticipantsGridProps = {
  studyId: string
  token: string
}

const AdherenceParticipantsGrid: FunctionComponent<AdherenceParticipantsGridProps> =
  ({studyId, token}) => {
    const {data, status, error, run, setData} = useAsync<{
      items: EnrolledAccountRecord[]
      total: number
    }>({
      status: 'PENDING',
      data: {
        items: [],
        total: 0,
      },
    })
    const handleError = useErrorHandler()

    React.useEffect(() => {
      return run(
        ParticipantService.getEnrollmentByEnrollmentType(
          studyId,
          token,
          'enrolled',
          true
        )
      )
    }, [run])
    if (status === 'PENDING') {
      return <Loader reqStatusLoading={'PENDING'}></Loader>
    }
    if (status === 'REJECTED') {
      handleError(error!)
    }

    return (
      <div>
        {data?.items.length}
        {data?.items.map(i => (
          <div>
            <Link to={`adherence/${i.participant.identifier}`}>
              testParticipant: {i.participant.identifier}
            </Link>
          </div>
        ))}
      </div>
    )
  }

export default AdherenceParticipantsGrid
