import AssessmentDetail from '@components/assessments/AssessmentDetail'
import AssessmentLibrary from '@components/assessments/AssessmentLibrary'
import DownloadAppLandingPage from './components/static/DownloadAppLandingPage'
import SignInPage from './SignInPage'

const routes = [
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
    path: '/sign-in',
    name: 'SIGN IN',
    Component: SignInPage,
    isRhs: true,
  },
]
export default routes
