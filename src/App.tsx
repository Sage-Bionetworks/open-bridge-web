import {FeatureToggleProvider} from '@helpers/FeatureToggle'
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
import Utility from './helpers/utility'
import UserService from './services/user.service'
import {cssVariables, theme} from './style/theme'
import {ExtendedError, LoggedInUserData} from './types/types'
import UnauthenticatedApp from './UnauthenticatedApp'

const theTheme = createTheme(deepmerge(theme, cssVariables))

const getCode = (): string | null => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.
  let code: URL | null | string = new URL(window.location.href)
  // in test environment the searchParams isn't defined
  const {searchParams} = code
  return searchParams?.get('code')
}
// tslint:disable-next-line
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

const attemptLogin = async (code: string): Promise<LoggedInUserData> => {
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.

  try {
    console.log('trying to log in')
    const env = Utility.getOauthEnvironment()
    const loggedIn = await UserService.loginOauth(
      code,
      env.redirect,
      env.vendor
    )

    return loggedIn.data
  } catch (e) {
    alert((e as Error).message)
    throw e
  }
}

const queryClient = new QueryClient()

function App() {
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
  }, [sessionData.token, code, sessionUpdateFn])

  //dynamically set favicon and app depending on domain
  useEffect(() => {
    const env = Utility.getOauthEnvironment()
    const $manifest = document.createElement('link')
    document.head.appendChild($manifest)
    $manifest.rel = 'manifest'
    const $icon = document.createElement('link')
    document.head.appendChild($icon)
    $icon.rel = 'icon'
    if (env.vendor.includes('arc-')) {
      $manifest.href = process.env.PUBLIC_URL + '/arc_manifest.json'
      $icon.href = process.env.PUBLIC_URL + '/arc_favicon.ico'
    } else {
      $manifest.href = process.env.PUBLIC_URL + '/manifest.json'
      $icon.href = process.env.PUBLIC_URL + '/favicon.ico'
    }
  }, [])

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theTheme}>
        <Typography component={'div'}>
          <CssBaseline />

          <Router basename={process.env.PUBLIC_URL}>
            <QueryClientProvider client={queryClient}>
              <ErrorBoundary
                FallbackComponent={ErrorFallback}
                onError={ErrorHandler}>
                {redirect && <Redirect to={redirect}></Redirect>}
                {/*  <React.StrictMode>*/}
                <FeatureToggleProvider
                  featureToggles={{'SURVEY BUILDER': false}}>
                  {sessionData.id ? (
                    <AuthenticatedApp />
                  ) : (
                    <Loader reqStatusLoading={getCode() !== null}>
                      <UnauthenticatedApp appId={Utility.getAppId()} />
                    </Loader>
                  )}
                </FeatureToggleProvider>
                {/*  </React.StrictMode>*/}
              </ErrorBoundary>
            </QueryClientProvider>
          </Router>
        </Typography>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}

export default App
