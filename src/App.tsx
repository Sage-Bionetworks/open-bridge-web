import {
  Container,
  CssBaseline,
  ThemeProvider,
  Typography
} from '@material-ui/core'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import AuthenticatedApp from './AuthenticatedApp'
import { ErrorFallback, ErrorHandler } from './components/widgets/ErrorHandler'
import {
  useSessionDataDispatch,
  useSessionDataState
} from './helpers/AuthContext'
import UserService from './services/user.service'
import { cssVariables, theme } from './style/theme'
import { SessionData } from './types/types'
import UnauthenticatedApp from './UnauthenticatedApp'

//const defaultTheme = createMuiTheme()

/*function getRootURL() {
  const portString = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${window.location.hostname}${portString}/`
}*/

export const detectSSOCode = async (
  sessionUpdateFn: Function,
  sessionData: SessionData,
) => {
  //const redirectURL = getRootURL()
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.
  let code: URL | null | string = new URL(window.location.href)
  // in test environment the searchParams isn't defined
  const { searchParams } = code
  if (!searchParams) {
    return
  }
  code = searchParams.get('code')
  if (code && !sessionData.token) {
    try {
      console.log('trying to log in')
      const env = UserService.getOathEnvironment()
      const loggedIn = await UserService.loginOauth(
        code,
        env.redirect,
        env.vendor,
      )

      sessionUpdateFn({
        type: 'LOGIN',
        payload: {
          ...sessionData,
          token: loggedIn.data.sessionToken,
          name: loggedIn.data.firstName,
          orgMembership: loggedIn.data.orgMembership,
          dataGroups: loggedIn.data.dataGroups,
        },
      })

      window.location.replace(`${window.location.origin}/studies`)
      // window.location.replace(env.redirect+'/study-editor')
    } catch (e) {
      alert(e.message)
    }
  }
}

function App() {
  const sessionData = useSessionDataState()
  const sessionUpdateFn = useSessionDataDispatch()
  const token = sessionData.token
  useEffect(() => {
    let isSubscribed = true
    //the whole point of this is to log out the user if their session ha expired on the servier
    async function getInfo(token: string | undefined) {
      if (token && isSubscribed) {
        try {
          await UserService.getUserInfo(token)
        } catch (e) {
          if (e.statusCode && e.statusCode >= 400) {
            sessionUpdateFn({
              type: 'LOGOUT',
            })
            alert('Authentication Error')
          }
        }
      }
    }
    getInfo(token)
    return () => {
      isSubscribed = false
    }
  }, [token])
  useEffect(() => {
    detectSSOCode(sessionUpdateFn, sessionData)
  }, [sessionData.token])

  return (
    <ThemeProvider theme={{ ...theme, ...cssVariables }}>
      <Typography component={'div'}>
        <CssBaseline />
        <Container maxWidth="xl" style={{ height: '100vh', padding: '0' }}>
          <Router basename={process.env.PUBLIC_URL}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}
            >
              {sessionData.token ? (
                <AuthenticatedApp token={sessionData.token} />
              ) : (
                <UnauthenticatedApp />
              )}
            </ErrorBoundary>
          </Router>
        </Container>
      </Typography>
    </ThemeProvider>
  )
}

export default App
