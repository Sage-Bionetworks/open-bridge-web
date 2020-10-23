import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import ComplianceDashboard from './components/compliance/ComplianceDashboard'
import StudyManager from './components/studies/StudyManager'
import ParticipantManager from './components/participants/ParticipantManager'

import StudyEditor from './components/studies/StudyEditor'
import AssessmentDetail from './components/assessments/AssessmentDetail'

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

  { path: '/studies/:id/:section', name: '', Component: StudyEditor },

  {
    path: '/1participant-manager',
    name: 'PARTICIPANT MANAGER',
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
  /* {
      path: "/pizza/:pizzaId/toppings",
      name: "Pizza Toppings",
      Component: Template
    }*/
]
