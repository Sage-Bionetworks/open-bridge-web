import StudyLive from '@components/studies/launch/Live'
import StudyList from '@components/studies/StudyList'
import AccessSettings from './components/access-settings/AccessSettings'
import AccountSetup from './components/account/AccountSetup'
import AssessmentDetail from './components/assessments/AssessmentDetail'
import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import ParticipantManager from './components/studies/participants/ParticipantManager'
import StudyBuilder from './components/studies/StudyBuilder'
import constants from './types/constants'

export default [
  /* {
    path: '/compliance-dashboard',
    name: 'COMPLIANCE DASHBOARD',
    Component: ComplianceDashboard,
    exact: true,
  },*/
  {
    path: '/studies',
    name: 'MY STUDIES',
    Component: StudyList,
    exact: true,
  },
  {
    path: constants.restrictedPaths.STUDY_BUILDER,
    name: '',
    Component: StudyBuilder,
    exact: true,
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
    exact: false,
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
