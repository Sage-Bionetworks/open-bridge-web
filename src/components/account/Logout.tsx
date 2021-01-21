import { makeStyles } from '@material-ui/core'
import React, { useState } from 'react'
import { Redirect } from 'react-router'
import { useSessionDataDispatch } from '../../helpers/AuthContext'

const useStyles = makeStyles(theme => ({}))
type LogoutProps = {
  element: JSX.Element
}

export const Logout: React.FunctionComponent<LogoutProps> = ({
  element,
}: LogoutProps) => {
  const [navigate, setNavigate] = useState(false)

  const sessionUpdateFn = useSessionDataDispatch()
  const logout = () => {
    sessionUpdateFn({ type: 'LOGOUT' })
    setNavigate(true)
  }
  if (navigate) {
    return <Redirect to={'/'} push={true} />
  } else {
    const e = React.cloneElement(element, { onClick: logout })
    return e
  }
}

export default Logout
