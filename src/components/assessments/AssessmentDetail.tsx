import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'
import { Assessment } from '../../types/types'

type AssessmentDetailOwnProps = {
  assessment: Assessment
}

type AssessmentDetailProps = AssessmentDetailOwnProps & RouteComponentProps

const AssessmentDetail: FunctionComponent<AssessmentDetailProps> = ({
  assessment,
}) => (
  <aside>
    <h2>{assessment.img}</h2>
    <p>{assessment.description}</p>
  </aside>
)

export default AssessmentDetail
