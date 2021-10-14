import AssessmentDetail from './components/assessments/AssessmentDetail'
import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import DownloadAppLandingPage from './components/static/DownloadAppLandingPage'
import SignInPage from './SignInPage'

export default [
  {
    path: '/',
    name: '',
    Component: SignInPage,
    exact: true,
    noToolbar: false,
  },
  {
    path: '/app-store-download',
    name: '',
    Component: DownloadAppLandingPage,
    exact: true,
    noToolbar: true,
  },
  /*  {
    path: '/how-it-works',
    name: 'HOW IT WORKS',
    Component: DownloadAppLandingPage,
    exact: true,
  },*/
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
  /* {
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
  },*/
  {
    path: '/sign-in',
    name: 'SIGN IN',
    Component: SignInPage,
    isRhs: true,
  },
]
