import {StudySection} from '@components/studies/sections'
import {useStudy} from '@components/studies/studyHooks'
import {useUserSessionDataState} from '@helpers/AuthContext'
import {useStudyInfoDataDispatch} from '@helpers/StudyInfoContext'
import React, {FunctionComponent, ReactNode} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {
  Route,
  RouteComponentProps,
  Switch,
  useParams,
  withRouter,
} from 'react-router-dom'
import './App.css'
import StudyTopNav from './components/studies/StudyTopNav'
import TopNav from './components/widgets/AppTopNav'
import Utility from './helpers/utility'
import PrivateRoutes from './routes_private'
import {UserSessionData} from './types/types'

const Wrapper: FunctionComponent<
  RouteComponentProps & {sessionData: UserSessionData; children: ReactNode}
> = ({children, sessionData}) => {
  let {id: studyId, section: studySection} = useParams<{
    id: string
    section: StudySection
  }>()

  const {data: study, error} = useStudy(studyId)
  const handleError = useErrorHandler()
  const studyDataUpdateFn = useStudyInfoDataDispatch()
  if (error) {
    handleError(error)
  }

  React.useEffect(() => {
    Utility.setBodyClass(studySection)
  }, [studySection])
  React.useEffect(() => {
    if (study) {
      studyDataUpdateFn({type: 'SET_STUDY', payload: {study}})
    }
  }, [study, studyDataUpdateFn])

  return (
    <>
      {!study && (
        <TopNav
          routes={PrivateRoutes}
          sessionData={sessionData}
          appId={sessionData.appId}
        />
      )}
      {study && (
        <StudyTopNav
          study={study}
          error={error}
          currentSection={studySection}></StudyTopNav>
      )}
      <main>{children}</main>
    </>
  )
}

const AuthenticatedApp: FunctionComponent<
  {
    sessionData: UserSessionData
  } & RouteComponentProps
> = ({sessionData, location, match}) => {
  const {token} = useUserSessionDataState()

  if (!token) {
    //save location and redirect
    if (location.pathname !== '/') {
      sessionStorage.setItem('location', location.pathname)
    }
    Utility.redirectToSynapseLogin()
  }
  return (
    <>
      <Switch>
        {PrivateRoutes.map(({path, Component}, key) => (
          <Route
            exact
            path={path}
            key={key}
            render={props => (
              <Wrapper {...props} sessionData={sessionData}>
                <Component {...props}></Component>
              </Wrapper>
            )}
          />
        ))}
      </Switch>
    </>
  )
}

export default withRouter(AuthenticatedApp)
