import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type AccountLoginOwnProps = {
  title: string
  paragraph: string
}

type AccountLoginProps = AccountLoginOwnProps & RouteComponentProps

const AccountLogin: FunctionComponent<AccountLoginProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}AccountLogin</h2>
    <p>{paragraph}</p>
  </aside>
)

export default AccountLogin
