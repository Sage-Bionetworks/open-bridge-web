import React, { useState} from 'react'
import { Redirect } from 'react-router'
import { useSessionDataDispatch } from '../../helpers/AuthContext'
import { makeStyles, Button } from '@material-ui/core'

const useStyles = makeStyles(theme => ({}))
type LogoutProps = {}

export const Logout: React.FunctionComponent<LogoutProps> = ({}: LogoutProps) => {
  const classes = useStyles()

  const [navigate, setNavigate] = useState(false)

  const sessionUpdateFn = useSessionDataDispatch()
  const logout = () => {
    sessionUpdateFn({ type: 'LOGOUT' })
    setNavigate(true)
  }
  if (navigate) {
    return <Redirect to={'/'} push={true} />
  } else {
    return (
      <Button color="primary" variant="outlined" onClick={logout}>
        Log Out
      </Button>
    )
  }
}

export default Logout
