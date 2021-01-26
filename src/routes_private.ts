import AccessSettings from './components/access-settings/AccessSettings'
import AccountSetup from './components/account/AccountSetup'
import AssessmentDetail from './components/assessments/AssessmentDetail'
import AssessmentLibrary from './components/assessments/AssessmentLibrary'
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
  { path: '/studies/builder/:id', name: '', Component: StudyBuilder },
  { path: '/studies/builder/:id/:section', name: '', Component: StudyBuilder },
  {
    path: '/studies/:id/participant-manager',
    name: '',
    exact: false,
    Component: ParticipantManager,
  },
  {
    path: '/studies/:id/access-settings',
    name: '',
    exact: false,
    Component: AccessSettings,
  },

  {
    path: '/assessments',
    name: 'ASSESSMENTS LIBRARY',
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
    name: 'ACCOUNT',
    Component: AccountSetup,
    exact: true,
  },
  /* {
    path: '/sessionsLayout',
    name: 'SessionBuilderLayout',
    Component: SessionsLayout,
  },*/
]
