import {FeatureToggleProvider, features} from '@helpers/FeatureToggle'
import {Container, CssBaseline, StyledEngineProvider, ThemeProvider, Typography} from '@mui/material'
import {createTheme, Theme} from '@mui/material/styles'
import {deepmerge} from '@mui/utils'
import {isDevelopment} from 'index'
import {useEffect} from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {QueryClient, QueryClientProvider} from 'react-query'
import {BrowserRouter as Router, Redirect} from 'react-router-dom'
import useLogin from 'useLogin'
import {useTracking} from 'useTracking'
import AuthenticatedApp from './AuthenticatedApp'
import {ErrorFallback, ErrorHandler} from './components/widgets/ErrorHandler'
import Loader from './components/widgets/Loader'
import Utility from './helpers/utility'
import {cssVariables, theme} from './style/theme'
import UnauthenticatedApp from './UnauthenticatedApp'

const theTheme = createTheme(deepmerge(theme, cssVariables))

// tslint:disable-next-line
declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

const queryClient = new QueryClient()

function App() {
  const {id, isLoadingLoginWithOauth, redirect, usernameAndPasswordLogin} = useLogin()
  useTracking('G-2FM7R03YJC')

  //dynamically set favicon and app depending on domain
  useEffect(() => {
    const branding = Utility.getAppBranding()

    const $manifest = document.createElement('link')
    document.head.appendChild($manifest)
    $manifest.rel = 'manifest'
    $manifest.href = process.env.PUBLIC_URL + '/' + branding.iconPrefix + 'manifest.json'
    
    const $icon = document.createElement('link')
    document.head.appendChild($icon)
    $icon.rel = 'icon'
    $icon.href = process.env.PUBLIC_URL + '/' + branding.iconPrefix + 'favicon.ico'

    document.title = branding.title
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={ErrorHandler}>
        {redirect && <Redirect to={redirect}></Redirect>}
        {/*  <React.StrictMode>*/}
        <FeatureToggleProvider
          featureToggles={{
            [features.SURVEY_BUILDER]: true, 
            [features.SURVEY_BRANCHING_LOGIC]: isDevelopment(),
            [features.USERNAME_PASSWORD_LOGIN]: isDevelopment(),
            }}>
          <Container
            id="outer"
            maxWidth="xl"
            sx={{borderLeft: '1px solid #DFE2E6', padding: {xs: 0}, borderRight: '1px solid #DFE2E6'}}>
            {id ? (
              <AuthenticatedApp />
            ) : (
              <Loader reqStatusLoading={isLoadingLoginWithOauth}>
                <UnauthenticatedApp appId={Utility.getAppId()} usernameAndPasswordLogin={usernameAndPasswordLogin} />
              </Loader>
            )}
          </Container>
        </FeatureToggleProvider>
        {/*  </React.StrictMode>*/}
      </ErrorBoundary>
    </QueryClientProvider>
  )
}

export default () => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theTheme}>
      <Typography component={'div'}>
        <CssBaseline />

        <Router basename={process.env.PUBLIC_URL}>
          <App />
        </Router>
      </Typography>
    </ThemeProvider>
  </StyledEngineProvider>
)
