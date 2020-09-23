import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type PlansOwnProps = {
  title: string
  paragraph: string
}

type PlansProps = PlansOwnProps & RouteComponentProps

const Plans: FunctionComponent<PlansProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}Plans</h2>
    <p>{paragraph}</p>
  </aside>
)

export default Plans
