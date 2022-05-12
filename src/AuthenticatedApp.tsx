import { StudySection } from '@components/studies/sections'
import { useStudy } from '@components/studies/studyHooks'
import SurveyTopNav from '@components/surveys/SurveyTopNav'
import { useUserSessionDataState } from '@helpers/AuthContext'
import React, { FunctionComponent, ReactNode } from 'react'
import { useErrorHandler } from 'react-error-boundary'
import {
  Route,
  RouteComponentProps,
  Switch,
  useLocation,
  useParams,
  withRouter
} from 'react-router-dom'
import StudyTopNav from './components/studies/StudyTopNav'
import TopNav from './components/widgets/AppTopNav'
import Utility from './helpers/utility'
import PrivateRoutes from './routes_private'
import { UserSessionData } from './types/types'


const Wrapper: FunctionComponent<
  RouteComponentProps & { sessionData: UserSessionData; children: ReactNode }
> = ({ children, sessionData }) => {
  let { id: studyId, section: studySection } = useParams<{
    id: string
    section: StudySection
  }>()
  //only use studyId in study builder or
  const notStudyId = useLocation().pathname.includes(`/assessments/${studyId}`)
  const isSurveyPath = useLocation().pathname.includes(`/surveys`)
  console.log(isSurveyPath)
  const { data: study, error } = useStudy(notStudyId ? undefined : studyId)
  const handleError = useErrorHandler()

  if (error) {
    handleError(error)
  }

  React.useEffect(() => {
    Utility.setBodyClass(studySection)
  }, [studySection])


  return (
    <>
      {isSurveyPath ? <SurveyTopNav></SurveyTopNav> :

        (!study ? (
          <TopNav
            routes={PrivateRoutes}
            sessionData={sessionData}
            appId={sessionData.appId}
          />
        ) : (
          <StudyTopNav
            study={study}
            error={error}
            currentSection={studySection}></StudyTopNav>
        ))}
      <main>{children}</main>
    </>
  )
}

const AuthenticatedApp: FunctionComponent<
  {
    sessionData: UserSessionData
  } & RouteComponentProps
> = ({ sessionData, location, match }) => {
  const { token } = useUserSessionDataState()

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
        {PrivateRoutes.map(({ path, Component }, key) => (
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
