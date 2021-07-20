import {Box, makeStyles} from '@material-ui/core'
import React, {FunctionComponent} from 'react'
import {Route, Switch} from 'react-router-dom'
import './App.css'
import AccountLogin from './components/account/AccountLogin'
import TopNav from './components/widgets/AppTopNav'
import {setBodyClass} from './helpers/utility'
import PublicRoutes from './routes_public'
import constants from './types/constants'
import ArcLogo from './assets/arc/arc_main_logo.svg'

const useStyles = makeStyles(theme => ({
  container: {
    height: '100vh',
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  leftContainer: {
    height: '100%',
    width: '50%',
    backgroundColor: '#8FCDE2',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    height: '100%',
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
}))

const UnauthenticatedApp: FunctionComponent<{
  appId: string
}> = ({appId}) => {
  const classes = useStyles()
  setBodyClass()
  if (appId === constants.constants.ARC_APP_ID) {
    return (
      <Box className={classes.container}>
        <Box className={classes.leftContainer}>
          <img style={{height: '211px', width: '211px'}} src={ArcLogo}></img>
        </Box>
        <Box className={classes.rightContainer}>
          <AccountLogin callbackFn={() => {}} isArcSignIn={true}></AccountLogin>
        </Box>
      </Box>
    )
  }
  return (
    <>
      <TopNav routes={PublicRoutes} appId={appId} />
      <main>
        <Switch>
          {PublicRoutes.map(({path, Component}, key) => (
            <Route
              exact
              path={path}
              key={key}
              render={props => <Component {...props}></Component>}
            />
          ))}
        </Switch>
      </main>
    </>
  )
}

export default UnauthenticatedApp
