import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type HowItWorksOwnProps = {
  title?: string
  paragraph?: string
}

type HowItWorksProps = HowItWorksOwnProps & RouteComponentProps

const HowItWorks: FunctionComponent<HowItWorksProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}HowItWorks</h2>
    <p>{paragraph}</p>
  </aside>
)

export default HowItWorks
