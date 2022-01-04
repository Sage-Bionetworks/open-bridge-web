import {useUserSessionDataState} from '@helpers/AuthContext'
import React, {FunctionComponent} from 'react'
import {useParams} from 'react-router-dom'
import AdherenceParticipantsGrid from './AdherenceParticipantsGrid'

type AdherenceParticipantsProps = {
  studyId?: string
}

const AdherenceParticipants: FunctionComponent<AdherenceParticipantsProps> =
  () => {
    let {id: studyId} = useParams<{
      id: string
    }>()
    const {token} = useUserSessionDataState()

    return (
      <div>
        Adherence Participants2
        <AdherenceParticipantsGrid studyId={studyId} token={token!} />
      </div>
    )
  }

export default AdherenceParticipants
