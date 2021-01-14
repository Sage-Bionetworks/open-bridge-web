import React from 'react'
import { Route, Switch } from 'react-router-dom'
import './App.css'
import TopNav from './components/widgets/AppTopNav'
import PublicRoutes from './routes_public'

function UnauthenticatedApp() {
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
