import React, {FunctionComponent} from 'react'
import {
  Route,
  RouteComponentProps,
  Switch,
  useLocation,
  withRouter,
} from 'react-router-dom'
import StaticTopNav from 'static/nav/TopNav'
import TopNav from './components/widgets/AppTopNav'
import Utility from './helpers/utility'
import PublicRoutes, {routes as newStaticPublicRoutes} from './routes_public'
import SignInPage from './SignInPage'
import constants from './types/constants'

const UnauthenticatedApp: FunctionComponent<
  RouteComponentProps & {
    appId: string
  }
> = ({appId}) => {
  Utility.setBodyClass()
  const loc = useLocation()
  const route = PublicRoutes.find(r => r.path === loc.pathname)
  const isFromNewStaticPages = !!new URLSearchParams(useLocation().search)?.get(
    'isStatic'
  )

  if (appId === constants.constants.ARC_APP_ID) {
    return <SignInPage isARCApp={true} />
  }
  return (
    <>
      {!route?.noToolbar &&
        (isFromNewStaticPages ? (
          <StaticTopNav routes={newStaticPublicRoutes} appId={appId} />
        ) : (
          <TopNav routes={PublicRoutes} appId={appId} />
        ))}
      <main style={{overflowX: 'hidden'}}>
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

export default withRouter(UnauthenticatedApp)
