import {StudySection} from '@components/studies/sections'
import StudyTopNav from '@components/studies/StudyTopNav'
import SurveyTopNav from '@components/surveys/SurveyTopNav'
import TopNav from '@components/widgets/AppTopNav'
import {useUserSessionDataDispatch, useUserSessionDataState} from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import {useSurveyAssessment} from '@services/assessmentHooks'
import {useStudy} from '@services/studyHooks'
import {UserSessionData} from '@typedefs/types'
import React, {FunctionComponent, ReactNode} from 'react'
import {useErrorHandler} from 'react-error-boundary'
import {Route, RouteComponentProps, Switch, useLocation, useParams, withRouter} from 'react-router-dom'
import PrivateRoutes from './routes_private'

const Wrapper: FunctionComponent<RouteComponentProps & {sessionData: UserSessionData; children: ReactNode}> = ({
  children,
  sessionData,
}) => {
  let {id, section: studySection} = useParams<{
    id: string
    section: StudySection
  }>()
  const pathName = useLocation().pathname
  const isAssessmentPath = pathName.includes(`/assessments/${id}`)
  const isSurveyPath = pathName.includes(`/surveys/${id}`)

  const notStudyId = isAssessmentPath || isSurveyPath
  const {data: study, error: studyError} = useStudy(notStudyId ? undefined : id)
  const {data: survey, error: surveyError} = useSurveyAssessment(true, isSurveyPath ? id : undefined)
  const handleError = useErrorHandler()

  if (studyError || surveyError) {
    handleError(studyError || surveyError)
  }

  React.useEffect(() => {
    Utility.setBodyClass(studySection)
  }, [studySection])

  return (
    <>
      <TopNav
        routes={PrivateRoutes}
        sessionData={sessionData}
        appId={sessionData.appId}
        hasSubNav={pathName.includes('/surveys') || pathName.includes('/studies')}>
        {isSurveyPath ? (
          <SurveyTopNav survey={survey} error={surveyError}></SurveyTopNav>
        ) : study ? (
          <StudyTopNav study={study} error={studyError} currentSection={studySection}></StudyTopNav>
        ) : (
          <></>
        )}
      </TopNav>
      <main>{children}</main>
    </>
  )
}

const AuthenticatedApp: FunctionComponent<RouteComponentProps> = ({location, match}) => {
  const sessionData = useUserSessionDataState()
  const sessionUpdateFn = useUserSessionDataDispatch()

  if (!sessionData.token) {
    // TODO (Hallie Swan, Sep 22 2023): re-authenticate users that didn't use Synapse OAuth
    // https://sagebionetworks.jira.com/browse/DHP-1057
    if (sessionData.lastLoginMethod === 'OAUTH_SYNAPSE') {
      //save location and redirect
      if (location.pathname !== '/') {
        sessionStorage.setItem('location', `${location.pathname}${location.search}`)
      }
      Utility.redirectToSynapseLogin()
    } else {
      sessionUpdateFn({type: 'LOGOUT'})
    }
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
