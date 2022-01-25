export default {
  constants: {
    MTB_APP_ID: 'mobile-toolbox',
    ARC_APP_ID: 'dian-validation',
    SESSION_NAME: 'bridge-session-mtb-user-testing',
    ENDPOINT: 'https://webservices.sagebridge.org',
    SYNAPSE_ENDPOINT: 'https://repo-prod.prod.sagebase.org',
    NEW_STUDY_NAME: 'Untitled Study',
    DEFAULT_PLACEHOLDER: '*UNDEFINED*',
    IS_TEST_MODE: false,
    CUSTOM_EVENT_PREFIX: 'custom:',
    ASSESSMENT_DEMO_STUDY_ID: 'demo',
  },

  restrictedPaths: {
    ACCESS_SETTINGS: '/studies/:id/access-settings',
    STUDY_BUILDER: '/studies/builder/:id',
    PARTICIPANT_MANAGER: '/studies/:id/participant-manager',
    ADHERENCE_DATA: '/studies/:id/adherence',
    STUDY_DATA: '/studies/:id/study-data',
  },

  environments: [
    {value: 'local', label: 'Local'},
    {value: 'develop', label: 'Development'},
    {value: 'staging', label: 'Staging'},
    {value: 'production', label: 'Production'},
  ],
  org_roles: ['org_admin', 'study_designer', 'study_coordinator'] as const,
  /*host: {
    local: 'http://localhost:9000',
    develop: 'https://ws-develop.sagebridge.org',
    staging: 'https://ws-staging.sagebridge.org',
    production: 'https://ws.sagebridge.org',
  },*/

  oauth: {
    local_mtb: {
      client: '100062',
      vendor: 'mtb',
      redirect: 'http://127.0.0.1:3000',
    },
    staging_mtb: {
      client: '100069',
      vendor: 'mtb-staging',
      redirect: 'https://staging.mobiletoolbox.org',
    },
    staging_mtb_studies: {
      client: '100122',
      vendor: 'mtb-staging-studies',
      redirect: 'https://staging.studies.mobiletoolbox.org',
    },
    prod_mtb_studies: {
      client: '100123',
      vendor: 'mtb-prod',
      redirect: 'https://studies.mobiletoolbox.org',
    },
    local_arc: {
      client: '100104',
      vendor: 'arc-dev',
      redirect: 'http://127.0.0.1:3001',
    },
  },

  endpoints: {
    adherenceDetail:
      '/v5/studies/:studyId/participants/:userId/adherence/eventstream',
    adherenceUserWeekly:
      '/v5/studies/:studyId/participants/:userId/adherence/weekly',
    adherenceWeekly: '/v5/studies/:studyId/adherence/weekly',

    assessment: '/v1/assessments/:id',
    assessments: '/v1/assessments?includeDeleted=false',
    assessmentShared: '/v1/sharedassessments/:id',
    assessmentsShared: '/v1/sharedassessments/?includeDeleted=false',
    assessmentResources: '/v1/assessments/identifier::identifier/resources', //'/v1/sharedassessments',
    assessmentSharedResources:
      '/v1/sharedassessments/identifier::identifier/resources',
    assmentsForSessions: '/v1/sessions/:sessionId/assessments',
    bridgeAccount: '/v1/accounts/:id',
    enrollments: '/v5/studies/:studyId/enrollments',
    enrollmentsForUser: '/v5/studies/:studyId/participants/:userId/enrollments',
    events: '/v5/studies/:studyId/participants/:userId/activityevents',
    getAccountsForOrg: '/v1/organizations/:orgId/members',
    oauthSignIn: '/v3/auth/oauth/signIn',
    participant: '/v5/studies/:id/participants',
    participantsSearch: '/v5/studies/:studyId/participants/search',
    requestResetPassword: '/v3/auth/requestResetPassword',
    requestInfo: '/v5/studies/:studyId/participants/:userId/requestInfo',
    schedule: '/v5/studies/:studyId/schedule',
    scheduleTimeline: '/v5/studies/:studyId/timeline',
    selfInfo: '/v3/participants/self',
    signIn: '/v3/auth/signIn',
    signOut: '/v3/auth/signOut',
    signUp: '/v3/auth/signUp',
    study: '/v5/studies/:id',
    studyComplete: '/v5/studies/:id/complete',
    studyConduct: '/v5/studies/:id/conduct',
    studyAnalyze: '/v5/studies/:id/analyze',
    studyWithdraw: '/v5/studies/:id/withdraw',
    studyLaunch: '/v5/studies/:id/recruit',
    studies: '/v5/studies',
    synapseGetAlias: '/repo/v1/principal/alias',
    synapseGetUserProfile: '/repo/v1/user/:id/bundle',
  },
}
