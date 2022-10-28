import {FunctionComponent} from 'react'
import {
  Route,
  RouteComponentProps,
  Switch,
  useLocation,
  withRouter,
} from 'react-router-dom'
import TopNav from './components/widgets/AppTopNav'
import Utility from './helpers/utility'
import PublicRoutes from './routes_public'
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

  if (
    [
      constants.constants.ARC_APP_ID,
      constants.constants.INV_ARC_APP_ID,
    ].includes(appId)
  ) {
    return <SignInPage isARCApp={true} />
  }
  return (
    <>
      {!route?.noToolbar && <TopNav routes={PublicRoutes} appId={appId} />}
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

export default withRouter(UnauthenticatedApp)
