import React, { FunctionComponent } from 'react'
import { Route, Switch, useLocation } from 'react-router-dom'
import './App.css'
import TopNav from './components/widgets/AppTopNav'
import PrivateRoutes from './routes_private'

const AuthenticatedApp: FunctionComponent<{ token: string }> = ({ token }) => {
  const location = useLocation()
  const inStudy = (location: string) => {
    const regexPattern = '/studies/[A-Za-z0-9]+/'
    return location.search(regexPattern) > -1
  }

  return (
    <>
      {!inStudy(location.pathname) && (
        <TopNav routes={PrivateRoutes} token={token} />
      )}
      <main>
        <Switch>
          {PrivateRoutes.map(({ path, Component }, key) => (
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

export default AuthenticatedApp
