import React from 'react'

import {ReactComponent as StudyComplete} from '@assets/participants/study_complete.svg'
import {ReactComponent as StudyNotReady} from '@assets/participants/study_not_live.svg'
import {Study, StudyPhase} from '@typedefs/types'
import StaticLayout1 from '../launch/StaticLayout1'

type TypeMap = {
  [K in StudyPhase]?: {
    img: React.ReactNode
    title?: string
    subtitle?: string
  }
}

const ParticipantManagerPlaceholder: React.FunctionComponent<{study: Study}> = ({study}) => {
  const config: TypeMap = {
    design: {
      img: <StudyNotReady />,
      title: 'Please check back after your study launches.',
      subtitle: 'This tab will be available once your study is officially live.',
    },
    completed: {
      img: <StudyComplete />,
      title: `${study.name} is complete.`,
      subtitle: 'Your study is now complete and this tab is now unavailable. ',
    },
    analysis: {
      img: <StudyComplete />,
      title: `${study.name} is complete.`,
      subtitle: 'Your study is now complete and this tab is now unavailable. ',
    },
    withdrawn: {
      img: <StudyComplete />,
      title: `${study.name} has been withdrawn.`,
      subtitle: 'This tab is now unavailable. ',
    },
  }
  const getItem = (phase: StudyPhase) => config[phase] || {...config.withdrawn, titie: ''}

  return (
    <StaticLayout1
      image={getItem(study.phase).img}
      title={getItem(study.phase).title}
      subtitle={getItem(study.phase).subtitle}></StaticLayout1>
  )
}

export default ParticipantManagerPlaceholder
