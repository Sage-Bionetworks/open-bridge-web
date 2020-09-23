import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type TemplateOwnProps = {
  title: string
  paragraph: string
}

type TemplateProps = TemplateOwnProps & RouteComponentProps

const Template: FunctionComponent<TemplateProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}</h2>
    <p>{paragraph}</p>
  </aside>
)

export default Template
