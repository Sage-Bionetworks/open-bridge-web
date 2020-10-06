import Template from './components/Template'
import AssessmentLibrary from './components/assessments/AssessmentLibrary'
import ComplianceDashboard from './components/compliance/ComplianceDashboard'
import StudyManager from './components/studies/StudyManager'
import ParticipantManager from './components/participants/ParticipantManager'
import AccountLogin from './components/account/AccountLogin'
import SessionsCreator from './components/studies/session-creator/SessionsCreator'

export default [

  {
    path: '/compliance-dashboard',
    name: 'COMPLIANCE DASHBOARD',
    Component: ComplianceDashboard,
  },
  { path: '/study-editor', name: 'MY STUDIES', Component: StudyManager },

  { path: '/study-editor/:id', name: 'MY STUDIES', Component: SessionsCreator },
 

  {
    path: '/1participant-manager',
    name: 'PARTICIPANT MANAGER',
    Component: ParticipantManager,
  },
  {
    path: '/assessment-library',
    name: 'ASSESSMENTS LIBRARY',
    Component: AssessmentLibrary,
  }
  /* { path: "/assessment/:assessmentId", name: "Edit Pizza", Component: Template },
    {
      path: "/pizza/:pizzaId/toppings",
      name: "Pizza Toppings",
      Component: Template
    }*/
]
