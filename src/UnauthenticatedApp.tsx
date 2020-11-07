import React, { useEffect } from 'react'
import Header from './components/widgets/Header'

import './App.css'

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import PublicRoutes from './routes_public'

function UnauthenticatedApp() {
  return (
    <>
      <Header title="Some Title" sections={PublicRoutes} />
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
