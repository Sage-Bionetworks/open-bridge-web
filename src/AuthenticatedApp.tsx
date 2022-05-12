import { StudySection } from '@components/studies/sections'
import { useStudy } from '@components/studies/studyHooks'
import StudyTopNav from '@components/studies/StudyTopNav'
import SurveyTopNav from '@components/surveys/SurveyTopNav'
import TopNav from '@components/widgets/AppTopNav'
import { useUserSessionDataState } from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import { UserSessionData } from '@typedefs/types'
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
import PrivateRoutes from './routes_private'


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

const AuthenticatedApp: FunctionComponent<RouteComponentProps
> = ({ location, match }) => {
  const sessionData = useUserSessionDataState()


  if (!sessionData.token) {
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
