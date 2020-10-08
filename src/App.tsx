import React, { useEffect } from 'react'
import Header from './components/widgets/Header'
import UserService from './services/user.service'

import './App.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import routes from './routes'
import {
  ThemeProvider,
  Typography,
  CssBaseline,
  createMuiTheme,
  makeStyles,
  Container,
} from '@material-ui/core'
import { theme, globals, cssVariables } from './style/theme'
import { useSessionDataDispatch, useSessionDataState } from './helpers/AuthContext'
import { SessionData } from './types/types'

const defaultTheme = createMuiTheme()
/*const theme = createMuiTheme({
  spacing: 8,
  typography: {
    htmlFontSize: 10,
    button: {
      textTransform: 'none',
    },
  },

  palette: {
    text: {
      secondary: 'red',
    },
  },
})*/
const getRootURL = () => {
  const portString = window.location.port ? `:${window.location.port}` : ''
  return `${window.location.protocol}//${window.location.hostname}${portString}/`
}

export const detectSSOCode = async(sessionUpdateFn: Function, sessionData:SessionData) => {
  const redirectURL = getRootURL()
  // 'code' handling (from SSO) should be preformed on the root page, and then redirect to original route.
  let code: URL | null | string = new URL(window.location.href)
  // in test environment the searchParams isn't defined
  const { searchParams } = code
  if (!searchParams) {
    return
  }
  code = searchParams.get('code')
if (code) {
  try{
  const loggedIn= await UserService.loginOauth(code, 'http://127.0.0.1:3000')
  sessionUpdateFn({
    type: 'LOGIN',
    payload: {
      ...sessionData,
      token: loggedIn.data.sessionToken,
      name: loggedIn.data.firstName,
      // consented: loggedIn.data.consented,
      // userDataGroup: loggedIn.data.dataGroups,
    },
  })
  window.location.replace('http://127.0.0.1:3000/study-editor')
} catch(e)
{alert(e.message)}

}
}



function App() {

  const sessionData = useSessionDataState()
  const sessionUpdateFn = useSessionDataDispatch()
  useEffect(()=> {
  detectSSOCode(sessionUpdateFn, sessionData)
  })

  return (
    <ThemeProvider theme={{...theme, ...cssVariables}}>
      <Typography component={'div'}>
        <CssBaseline />
        <Container maxWidth="xl" style={{ height: '100vh' }}>
          <Header title="Some Title" sections={routes} />
          <main>
            <Router basename={process.env.PUBLIC_URL}>
              <Switch>
                {routes.map(({ path, Component }, key) => (
                  <Route
                    exact
                    path={path}
                    key={key}
                    render={props => <Component {...props}></Component>}
                  />
                ))}
              </Switch>
            </Router>
          </main>
        </Container>
      </Typography>
    </ThemeProvider>
  )
}

export default App
