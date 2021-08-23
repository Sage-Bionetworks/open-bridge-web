import {useStudyBuilderInfo} from '@helpers/hooks'
import React, {FunctionComponent} from 'react'
import {matchPath, Route, Switch, useHistory} from 'react-router-dom'
import './App.css'
import StudyTopNav from './components/studies/StudyTopNav'
import TopNav from './components/widgets/AppTopNav'
import {useStudyInfoDataDispatch} from './helpers/StudyInfoContext'
import Utility from './helpers/utility'
import PrivateRoutes from './routes_private'
import {UserSessionData} from './types/types'

const getParams = (pathname: string): {id?: string; section?: string} => {
  const path = `/studies/${
    pathname.includes('builder') ? 'builder/' : ''
  }:id/:section`
  const matchProfile = matchPath(pathname, {
    path,
  })

  return (matchProfile && matchProfile.params) || {}
}

const AuthenticatedApp: FunctionComponent<{
  sessionData: UserSessionData
}> = ({sessionData}) => {
  const [studyId, setStudyId] = React.useState<string | undefined>()
  const [studySection, setStudySection] = React.useState<string | undefined>()
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  const history = useHistory()
  const {studyError} = useStudyBuilderInfo(studyId, studyDataUpdateFn)

  //on routechange set body class
  React.useEffect(() => {
    return history.listen(location => {
      const {id, section} = getParams(window.location.pathname)
      Utility.setBodyClass(section)
    })
  }, [history])

  React.useEffect(() => {
    const {id, section} = getParams(window.location.pathname)

    Utility.setBodyClass(section)
    setStudyId(id)
    setStudySection(section)
  }, [studyDataUpdateFn])

  const {id, section} = getParams(window.location.pathname)
  Utility.setBodyClass(section)
  return (
    <>
      {!studyId && (
        <TopNav
          routes={PrivateRoutes}
          sessionData={sessionData}
          appId={sessionData.appId}
        />
      )}
      {studyId && (
        <StudyTopNav
          studyId={studyId!}
          error={studyError}
          currentSection={studySection}></StudyTopNav>
      )}
      <main>
        <Switch>
          {PrivateRoutes.map(({path, Component}, key) => (
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
