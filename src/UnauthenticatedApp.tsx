import React, { useEffect } from 'react'
import TopNav from './components/widgets/AppTopNav'

import './App.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import PublicRoutes from './routes_public'

function UnauthenticatedApp() {
  return (
    <>
      <TopNav  routes={PublicRoutes} />
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
