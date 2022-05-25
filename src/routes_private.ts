import AccessSettings from '@components/access-settings/AccessSettings'
import AccountSetup from '@components/account/AccountSetup'
import Adherence from '@components/adherence/Adherence'
import AdherenceParticipant from '@components/adherence/participant-detail/AdherenceParticipant'
import AssessmentDetail from '@components/assessments/AssessmentDetail'
import AssessmentLibrary from '@components/assessments/AssessmentLibrary'
import AssessmentsPreview from '@components/assessments/AssessmentsPreview'
import StudyLive from '@components/studies/launch/Live'
import ParticipantManager from '@components/studies/participants/ParticipantManager'
import StudyBuilder from '@components/studies/StudyBuilder'
import StudyList from '@components/studies/StudyList'
import SurveyDesign from '@components/surveys/survey-design/SurveyDesign'
import SurveyList from '@components/surveys/SurveyList'
import constants from '@typedefs/constants'

export default [
  {
    path: constants.restrictedPaths.ADHERENCE_DATA,
    name: '',
    Component: Adherence,
    exact: true,
  },
  {
    path: `${constants.restrictedPaths.ADHERENCE_DATA}/:userId`,
    name: '',
    Component: AdherenceParticipant,
    exact: true,
  },

  {
    path: '/studies',
    name: 'MY STUDIES',
    Component: StudyList,
    exact: true,
  },
  {
    path: '/surveys',
    name: '',
    Component: SurveyList,
  },
  {
    path: `${constants.restrictedPaths.SURVEY_BUILDER}/:section`,
    name: '',
    Component: SurveyDesign,
  },

  {
    path: constants.restrictedPaths.STUDY_BUILDER,
    name: '',
    Component: StudyBuilder,
    //exact: true,
  },
  {
    path: `${constants.restrictedPaths.STUDY_BUILDER}/:section`,
    name: '',
    Component: StudyBuilder,
  },
  {
    path: '/studies/:id/study-live',
    name: '',
    exact: false,
    Component: StudyLive,
  },
  {
    path: constants.restrictedPaths.PARTICIPANT_MANAGER,
    name: '',
    exact: false,
    Component: ParticipantManager,
  },
  {
    path: constants.restrictedPaths.ACCESS_SETTINGS,
    name: '',
    Component: AccessSettings,
  },

  {
    path: '/assessments',
    name: 'ASSESSMENT LIBRARY',
    Component: AssessmentLibrary,
    exact: true,
  },
  {
    path: '/assessments/preview',
    name: '',
    Component: AssessmentsPreview,
    exact: true,
  },
  {
    path: '/assessments/:id',
    name: '',
    Component: AssessmentDetail,
    exact: true,
  },
  {
    path: '/my-account',
    name: 'Edit Profile',
    Component: AccountSetup,
    isRhs: true,
    exact: true,
  },
  {
    path: '/settings',
    name: 'Settings',
    isRhs: true,
    Component: AccountSetup,
    exact: true,
  },
  /* {
    path: '/sessionsLayout',
    name: 'SessionBuilderLayout',
    Component: SessionsLayout,
  },*/
]
