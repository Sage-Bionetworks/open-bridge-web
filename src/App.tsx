import {CssBaseline, ThemeProvider, Typography} from '@material-ui/core'
import React, {useEffect} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter as Router, Redirect} from 'react-router-dom'
import './App.css'
import AuthenticatedApp from './AuthenticatedApp'
import {ErrorFallback, ErrorHandler} from './components/widgets/ErrorHandler'
import Loader from './components/widgets/Loader'
import {
  useUserSessionDataDispatch,
  useUserSessionDataState,
} from './helpers/AuthContext'
import {StudyInfoDataProvider} from './helpers/StudyInfoContext'
import Utility from './helpers/utility'
import UserService from './services/user.service'
import {cssVariables, theme} from './style/theme'
import {ExtendedError, UserSessionData} from './types/types'
import UnauthenticatedApp from './UnauthenticatedApp'

//const defaultTheme = createMuiTheme()

/*function getRootURL() {
  const portString = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${window.location.hostname}${portString}/`
}*/

const getCode = (): string | null => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.
  let code: URL | null | string = new URL(window.location.href)
  // in test environment the searchParams isn't defined
  const {searchParams} = code
  return searchParams?.get('code')
}

const detectSSOCode = async (
  sessionUpdateFn: Function,
  sessionData: UserSessionData
) => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.
  const code = getCode()
  if (code && !sessionData.token) {
    try {
      const env = UserService.getOathEnvironment()
      const loggedIn = await UserService.loginOauth(
        code,
        env.redirect,
        env.vendor
      )

      sessionUpdateFn({
        type: 'LOGIN',
        payload: {
          ...sessionData,
          token: loggedIn.data.sessionToken,
          firstName: loggedIn.data.firstName,
          lastName: loggedIn.data.lastName,
          userName: loggedIn.data.username,
          orgMembership: loggedIn.data.orgMembership,
          dataGroups: loggedIn.data.dataGroups,
          roles: loggedIn.data.roles,
          id: loggedIn.data.id,
          appId: Utility.getAppId(),
          demoExternalId: loggedIn.data.clientData?.demoExternalId,
        },
      })
      return true
      // window.location.replace(`${window.location.origin}/studies`)
      // window.location.replace(env.redirect+'/study-editor')
    } catch (e) {
      alert((e as Error).message)
      return false
    }
  }
}

const queryClient = new QueryClient()

function App() {
  const sessionData = useUserSessionDataState()
  const sessionUpdateFn = useUserSessionDataDispatch()
  const [redirect, setRedirect] = React.useState<string | undefined>()
  const token = sessionData.token
  useEffect(() => {
    let isSubscribed = true
    //the whole point of this is to log out the user if their session ha expired on the servier
    async function getInfo(token: string | undefined) {
      if (token && isSubscribed) {
        try {
          await UserService.getUserInfo(token)
        } catch (e) {
          if ((e as ExtendedError).statusCode && e.statusCode >= 400) {
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
  }, [token, sessionUpdateFn])
  useEffect(() => {
    detectSSOCode(sessionUpdateFn, sessionData).then(result => {
      if (result !== undefined) {
        const savedLocation = sessionStorage.getItem('location')
        if (savedLocation) {
          sessionStorage.removeItem('location')
          setRedirect(savedLocation)
        } else {
          setRedirect('/studies')
        }
      }
    })
  }, [sessionData.token, sessionUpdateFn, sessionData])

  return (
    <ThemeProvider theme={{...theme, ...cssVariables}}>
      <Typography component={'div'}>
        <CssBaseline />
        <Router basename={process.env.PUBLIC_URL}>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onError={ErrorHandler}>
              {redirect && <Redirect to={redirect}></Redirect>}
              {sessionData.id ? (
                <StudyInfoDataProvider>
                  <AuthenticatedApp sessionData={sessionData} />
                </StudyInfoDataProvider>
              ) : (
                <Loader reqStatusLoading={getCode() !== null}>
                  <UnauthenticatedApp appId={Utility.getAppId()} />
                </Loader>
              )}
            </ErrorBoundary>
          </QueryClientProvider>
        </Router>
      </Typography>
    </ThemeProvider>
  )
}

export default App
