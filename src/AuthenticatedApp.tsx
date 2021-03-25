import React, { FunctionComponent } from 'react'
import { matchPath, Route, RouteComponentProps, Switch } from 'react-router-dom'
import './App.css'
import StudyTopNav from './components/studies/StudyTopNav'
import TopNav from './components/widgets/AppTopNav'
import { useStudyBuilderInfo } from './helpers/hooks'
import { useStudyInfoDataDispatch } from './helpers/StudyInfoContext'
import { setBodyClass } from './helpers/utility'
import PrivateRoutes from './routes_private'

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

const AuthenticatedApp: FunctionComponent<{ token: string }> = ({ token }) => {
  const [studyId, setStudyId] = React.useState<string | undefined>()
  const [studySection, setStudySection] = React.useState<string | undefined>()
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  const { data: builderInfo } = useStudyBuilderInfo(studyId)

  React.useEffect(() => {
    console.log('datachange', builderInfo?.study)
    if (builderInfo?.study) {
      studyDataUpdateFn({ type: 'SET_ALL', payload: builderInfo })
    }
  }, [builderInfo, studyDataUpdateFn])

  React.useEffect(() => {
    const { id, section } = getParams(window.location.pathname)

    setBodyClass(section)
    setStudyId(id)
    setStudySection(section)
  }, [studyDataUpdateFn])

  const { id, section } = getParams(window.location.pathname)
  setBodyClass(section)

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
