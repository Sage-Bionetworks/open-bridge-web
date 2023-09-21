import {FunctionComponent} from 'react'
import {Route, RouteComponentProps, Switch, useLocation, withRouter} from 'react-router-dom'
import {UseLoginReturn} from 'useLogin'
import TopNav from './components/widgets/AppTopNav'
import {default as Utility, default as UtilityObject} from './helpers/utility'
import PublicRoutes from './routes_public'
import SignInPage from './SignInPage'

const UnauthenticatedApp: FunctionComponent<
  RouteComponentProps & {
    appId: string
    isLoadingLoginWithUsernameAndPassword: UseLoginReturn['isLoadingLoginWithUsernameAndPassword']
    submitUsernameAndPassword: UseLoginReturn['submitUsernameAndPassword']
    errorMessageLoginWithUsernameAndPassword: UseLoginReturn['errorMessageLoginWithUsernameAndPassword']
  }
> = ({
  appId,
  isLoadingLoginWithUsernameAndPassword,
  submitUsernameAndPassword,
  errorMessageLoginWithUsernameAndPassword,
}) => {
  Utility.setBodyClass()
  const loc = useLocation()
  const route = PublicRoutes.find(r => r.path === loc.pathname)

  if (UtilityObject.isArcApp(appId)) {
    return (
      <SignInPage
        isARCApp={true}
        isLoadingLoginWithUsernameAndPassword={isLoadingLoginWithUsernameAndPassword}
        submitUsernameAndPassword={submitUsernameAndPassword}
        errorMessageLoginWithUsernameAndPassword={errorMessageLoginWithUsernameAndPassword}
      />
    )
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
              render={props => (
                <Component
                  isLoadingLoginWithUsernameAndPassword={isLoadingLoginWithUsernameAndPassword}
                  submitUsernameAndPassword={submitUsernameAndPassword}
                  errorMessageLoginWithUsernameAndPassword={errorMessageLoginWithUsernameAndPassword}
                  {...props}></Component>
              )}
            />
          ))}
        </Switch>
      </main>
    </>
  )
}

export default withRouter(UnauthenticatedApp)
