import React, {FunctionComponent} from 'react'

import {RouteComponentProps} from 'react-router-dom'

type RelatedAssessmentsOwnProps = {
  title: string
  paragraph: string
}

type RelatedAssessmentsProps = RelatedAssessmentsOwnProps & RouteComponentProps

const RelatedAssessments: FunctionComponent<RelatedAssessmentsProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}</h2>
    <p>{paragraph}</p>
  </aside>
)

export default RelatedAssessments
