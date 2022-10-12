import React, {FunctionComponent} from 'react'

import {RouteComponentProps} from 'react-router-dom'

type AccountCreateOwnProps = {
  title?: string
  paragraph?: string
}

type AccountCreateProps = AccountCreateOwnProps & RouteComponentProps

const AccountCreate: FunctionComponent<AccountCreateProps> = ({title = 'something', paragraph}) => (
  <aside>
    <h2>{title}AccountCreate</h2>
    <p>{paragraph}</p>
  </aside>
)

export default AccountCreate
