import React, { FunctionComponent } from 'react'
import { matchPath, Route, Switch, useLocation } from 'react-router-dom'
import './App.css'
import StudyTopNav from './components/studies/StudyTopNav'
import TopNav from './components/widgets/AppTopNav'
import PrivateRoutes from './routes_private'

const AuthenticatedApp: FunctionComponent<{ token: string }> = ({
  token,
  ...props
}) => {
  const location = useLocation()
  const [studyId, setStudyId] = React.useState<string | undefined>()
  const [studySection, setStudySection] = React.useState<string | undefined>()

  /* const inStudy = (location: string) => {
    const regexPattern = '/studies/[A-Za-z0-9]+/'
    return location.search(regexPattern) > -1
  }*/

  const getParams = (pathname: string): { id?: string; section?: string } => {
    const path = `/studies/${
      pathname.includes('builder') ? 'builder/' : ''
    }:id/:section`

    console.log(pathname)
    const matchProfile = matchPath(pathname, {
      path,
    })

    return (matchProfile && matchProfile.params) || {}
  }
  React.useEffect(() => {
    console.log('pathchange')
    const { id, section } = getParams(window.location.pathname)
    setStudyId(id)
    setStudySection(section)
  }, [window.location.pathname])
  getParams(window.location.pathname)

  return (
    <>
      {!studyId && <TopNav routes={PrivateRoutes} token={token} />}
      {studyId && (
        <StudyTopNav
          studyId={studyId!}
          currentSection={studySection}
        ></StudyTopNav>
      )}

      <main>
        hello
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
