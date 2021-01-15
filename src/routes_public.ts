import AssessmentLibrary from './components/assessments/AssessmentLibrary'

import StudyBuilder from './components/studies/StudyBuilder'
import AssessmentDetail from './components/assessments/AssessmentDetail'
import SessionsLayout from './components/layouts/sessions'
import HowItWorks from './components/static/HowItWorks'
import Plans from './components/static/Plans'
import DevelopmentTeam from './components/static/DevelopmentTeam'
import AccountCreate from './components/account/AccountCreate'

export default [
  {
    path: '/how-it-works',
    name: 'HOW IT WORKS',
    Component: HowItWorks,
    exact: true,
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
    path: '/plans',
    name: 'PLANS',
    Component: Plans,
    exact: true,
  },
  {
    path: '/layouts',
    name: '',
    Component: SessionsLayout,
    exact: true,
  },

  {
    path: '/development-team',
    name: 'DEVELOPMENT TEAM',
    Component: DevelopmentTeam,
  },
  {
    path: '/create-account',
    name: 'CREATE ACCOUNT',
    Component: AccountCreate,
    isRhs: true,
  },
]
