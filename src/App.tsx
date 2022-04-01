import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
  Typography,
} from '@mui/material'
import {createTheme, Theme} from '@mui/material/styles'
import {deepmerge} from '@mui/utils'
import React, {useEffect, useRef} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter as Router, Redirect} from 'react-router-dom'
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
import {ExtendedError, LoggedInUserData} from './types/types'
import UnauthenticatedApp from './UnauthenticatedApp'

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface (remove this line if you don't have the rule enabled)
  interface DefaultTheme extends Theme {}
}
const theme2 = createTheme(deepmerge(theme, cssVariables))
console.log('t2', theme2)

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

const attemptLogin = async (code: string): Promise<LoggedInUserData> => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.

  try {
    console.log('trying to log in')
    const env = UserService.getOathEnvironment()
    const loggedIn = await UserService.loginOauth(
      code,
      env.redirect,
      env.vendor
    )

    return loggedIn.data
    // window.location.replace(`${window.location.origin}/studies`)
    // window.location.replace(env.redirect+'/study-editor')
  } catch (e) {
    alert((e as Error).message)
    throw e
  }
}

const queryClient = new QueryClient()

function App() {
  console.log('loading app')
  const firstUpdate = useRef(true)
  const sessionData = useUserSessionDataState()
  const sessionUpdateFn = useUserSessionDataDispatch()
  const [redirect, setRedirect] = React.useState<string | undefined>()
  const [token, setToken] = React.useState(sessionData.token)
  const code = getCode()
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
    if (firstUpdate.current && code && !sessionData.token) {
      console.log('first')
      firstUpdate.current = false

      attemptLogin(code).then(
        result => {
          sessionUpdateFn({
            type: 'LOGIN',
            payload: {
              token: result.sessionToken,
              firstName: result.firstName,
              lastName: result.lastName,
              userName: result.username,
              orgMembership: result.orgMembership,
              dataGroups: result.dataGroups,
              roles: result.roles,
              id: result.id,
              appId: Utility.getAppId(),
              demoExternalId: result.clientData?.demoExternalId,
            },
          })
          setToken(result.sessionToken)
          const savedLocation = sessionStorage.getItem('location')
          console.log('redirecting', savedLocation)
          if (savedLocation) {
            sessionStorage.removeItem('location')
            setRedirect(savedLocation)
          } else {
            setRedirect('/studies')
          }
        },
        e => {
          alert(e.message)
        }
      )
    }
  }, [sessionData.token, code])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme2}>
        <Typography component={'div'}>
          <CssBaseline />

          <Router basename={process.env.PUBLIC_URL}>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={ErrorHandler}>
                {redirect && <Redirect to={redirect}></Redirect>}
                {/* <React.StrictMode>*/}
                {sessionData.id ? (
                  <StudyInfoDataProvider>
                    <AuthenticatedApp sessionData={sessionData} />
                  </StudyInfoDataProvider>
                ) : (
                  <Loader reqStatusLoading={getCode() !== null}>
                    <UnauthenticatedApp appId={Utility.getAppId()} />
                  </Loader>
                )}
                {/* </React.StrictMode>*/}
              </ErrorBoundary>
            </QueryClientProvider>
          </Router>
        </Typography>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
