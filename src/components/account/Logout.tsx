import {useUserSessionDataDispatch} from '@helpers/AuthContext'
import React from 'react'

type LogoutProps = {
  element: JSX.Element
}

export const Logout: React.FunctionComponent<LogoutProps> = ({element}: LogoutProps) => {
  const sessionUpdateFn = useUserSessionDataDispatch()
  const logout = () => {
    window.open('https://signin.synapse.org/logout', '_blank', 'left=100,top=100,width=420,height=160')
    sessionUpdateFn({type: 'LOGOUT'})
  }

  const e = React.cloneElement(element, {onClick: logout})
  return e
}

export default Logout
