import React from 'react'

import {ReactComponent as StudyNotReady} from '@assets/participants/study_not_live.svg'
import StaticLayout1 from '../launch/StaticLayout1'

const ParticipantManagerPlaceholder: React.FunctionComponent = () => {
  return (
    <StaticLayout1
      image={<StudyNotReady />}
      title="Please check back after your study launches."
      subtitle="This tab will be available once your study is officially live.">
      &nbsp;
    </StaticLayout1>
  )
}

export default ParticipantManagerPlaceholder
