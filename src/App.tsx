import React from 'react'
import Header from './components/widgets/Header'

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
import { theme, globals } from './style/theme'

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

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
  },
  '@global': globals,
}))

function App() {
  const classes = useStyles()
  return (
    <ThemeProvider theme={theme}>
      <Typography component={'div'}>
        <CssBaseline />
        <Container maxWidth="xl" style={{ height: '100vh' }}>
          <Header title="Blog" sections={routes} />
          <main>
            <Router>
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
