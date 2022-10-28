import {StudySection} from '@components/studies/sections'
import StudyTopNav from '@components/studies/StudyTopNav'
import SurveyTopNav from '@components/surveys/SurveyTopNav'
import TopNav from '@components/widgets/AppTopNav'
import {useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import {useSurveyAssessment} from '@services/assessmentHooks'
import {useStudy} from '@services/studyHooks'
import {UserSessionData} from '@typedefs/types'
import React, {FunctionComponent, ReactNode} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {
  Route,
  RouteComponentProps,
  Switch,
  useLocation,
  useParams,
  withRouter,
} from 'react-router-dom'
import PrivateRoutes from './routes_private'

const Wrapper: FunctionComponent<
  RouteComponentProps & {sessionData: UserSessionData; children: ReactNode}
> = ({children, sessionData}) => {
  let {id, section: studySection} = useParams<{
    id: string
    section: StudySection
  }>()

  const isAssessmentPath = useLocation().pathname.includes(`/assessments/${id}`)
  const isSurveyPath = useLocation().pathname.includes(`/surveys/${id}`)
  const notStudyId = isAssessmentPath || isSurveyPath
  const {data: study, error: studyError} = useStudy(notStudyId ? undefined : id)
  const {data: survey, error: surveyError} = useSurveyAssessment(
    true,
    isSurveyPath ? id : undefined
  )
  const handleError = useErrorHandler()

  if (studyError || surveyError) {
    handleError(studyError || surveyError)
  }

  React.useEffect(() => {
    Utility.setBodyClass(studySection)
  }, [studySection])

  return (
    <>
      {isSurveyPath ? (
        <SurveyTopNav survey={survey} error={surveyError}></SurveyTopNav>
      ) : !study ? (
        <TopNav
          routes={PrivateRoutes}
          sessionData={sessionData}
          appId={sessionData.appId}
        />
      ) : (
        <StudyTopNav
          study={study}
          error={studyError}
          currentSection={studySection}></StudyTopNav>
      )}
      <main>{children}</main>
    </>
  )
}

const AuthenticatedApp: FunctionComponent<RouteComponentProps> = ({
  location,
  match,
}) => {
  const sessionData = useUserSessionDataState()

  if (!sessionData.token) {
    //save location and redirect
    if (location.pathname !== '/') {
      sessionStorage.setItem(
        'location',
        `${location.pathname}${location.search}`
      )
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
