import AccessSettings from './components/access-settings/AccessSettings'
import AccountSetup from './components/account/AccountSetup'
import AssessmentDetail from './components/assessments/AssessmentDetail'
import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import StudyLive from './components/studies/launch/Live'
import ParticipantManager from './components/studies/participants/ParticipantManager'
import StudyBuilder from './components/studies/StudyBuilder'
import StudyList from './components/studies/StudyList'

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
  {path: '/studies/builder/:id', name: '', Component: StudyBuilder},
  {path: '/studies/builder/:id/:section', name: '', Component: StudyBuilder},
  {
    path: '/studies/:id/study-live',
    name: '',
    exact: false,
    Component: StudyLive,
  },
  {
    path: '/studies/:id/participant-manager',
    name: '',
    exact: false,
    Component: ParticipantManager,
  },
  {
    path: '/studies/:id/access-settings',
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
