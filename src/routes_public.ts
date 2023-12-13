import AssessmentDetail from '@components/assessments/AssessmentDetail'
import AssessmentLibrary from '@components/assessments/AssessmentLibrary'
import constants from '@typedefs/constants'
import SignInPage from './SignInPage'
import DownloadAppLandingPage from './components/static/DownloadAppLandingPage'

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
    name: 'Assessment Library',
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
    path: constants.publicPaths.SIGN_IN,
    name: 'SIGN IN',
    Component: SignInPage,
    isRhs: true,
  },
  {
    path: constants.publicPaths.RESET_PASSWORD,
    name: '',
    Component: SignInPage,
    exact: true,
  },
]
export default routes
