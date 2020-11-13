import React, { FunctionComponent } from 'react'

import { RouteComponentProps } from 'react-router-dom'

type AccountSetupOwnProps = {
  title?: string
  paragraph?: string
}

type AccountSetupProps = AccountSetupOwnProps & RouteComponentProps

const AccountSetup: FunctionComponent<AccountSetupProps> = ({
  title = 'something',
  paragraph,
}) => (
  <aside>
    <h2>{title}AccountSetup</h2>
    <p>{paragraph}</p>
  </aside>
)

export default AccountSetup
