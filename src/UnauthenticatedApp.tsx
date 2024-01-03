import {FunctionComponent} from 'react'
import {Route, RouteComponentProps, Switch, useLocation, withRouter} from 'react-router-dom'
import {UseLoginReturn} from 'useLogin'
import TopNav from './components/widgets/AppTopNav'
import {default as Utility, default as UtilityObject} from './helpers/utility'
import PublicRoutes from './routes_public'

const UnauthenticatedApp: FunctionComponent<
  RouteComponentProps & {
    appId: string
    usernameAndPasswordLogin: UseLoginReturn['usernameAndPasswordLogin']
  }
> = ({appId, usernameAndPasswordLogin}) => {
  Utility.setBodyClass()
  const loc = useLocation()
  const route = PublicRoutes.find(r => r.path === loc.pathname)

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
              render={props => <Component usernameAndPasswordLogin={usernameAndPasswordLogin} {...props}></Component>}
            />
          ))}
        </Switch>
      </main>
    </>
  )
}

export default withRouter(UnauthenticatedApp)
