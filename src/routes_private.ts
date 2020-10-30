import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import ComplianceDashboard from './components/compliance/ComplianceDashboard'
import StudyManager from './components/studies/StudyManager'
import ParticipantManager from './components/studies/participants/ParticipantManager'

import StudyEditor from './components/studies/StudyEditor'
import AssessmentDetail from './components/assessments/AssessmentDetail'
import SessionsLayout from './components/layouts/sessions'

export default [
  {
    path: '/compliance-dashboard',
    name: 'COMPLIANCE DASHBOARD',
    Component: ComplianceDashboard,
    exact: true,
  },
  {
    path: '/studies',
    name: 'MY STUDIES',
    Component: StudyManager,
    exact: true,
  },
  { path: '/studies/builder/:id', name: '', Component: StudyEditor },
  { path: '/studies/builder/:id/:section', name: '', Component: StudyEditor },
  {
    path: '/studies/:id/participant-manager',
    name: '',
    exact: false,
    Component: ParticipantManager,
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
    path: '/sessionsLayout',
    name: 'SessionBuilderLayout',
    Component: SessionsLayout,
  },
]
