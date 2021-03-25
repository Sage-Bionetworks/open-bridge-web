import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import TopNav from './components/widgets/AppTopNav'
import { setBodyClass } from './helpers/utility'
import PublicRoutes from './routes_public'

function UnauthenticatedApp() {
  setBodyClass()
  return (
    <>
      <TopNav routes={PublicRoutes} />
      <main>
        <Switch>
          {PublicRoutes.map(({ path, Component }, key) => (
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
