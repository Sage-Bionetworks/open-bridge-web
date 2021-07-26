import React, {FunctionComponent} from 'react'
import {Route, Switch} from 'react-router-dom'
import './App.css'
import TopNav from './components/widgets/AppTopNav'
import {setBodyClass} from './helpers/utility'
import PublicRoutes from './routes_public'
import constants from './types/constants'
import SignInPage from './SignInPage'

const UnauthenticatedApp: FunctionComponent<{
  appId: string
}> = ({appId}) => {
  setBodyClass()
  if (appId === constants.constants.ARC_APP_ID) {
    return <SignInPage isARCApp={true} />
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
