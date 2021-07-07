export default {
  constants: {
    APP_ID: 'mtb-user-testing',
    STUDY_ID: 'mtb-user-testing',
    SESSION_NAME: 'bridge-session-mtb-user-testing',
    ENDPOINT: 'https://webservices.sagebridge.org',
    SYNAPSE_ENDPOINT: 'https://repo-prod.prod.sagebase.org',
    NEW_STUDY_NAME: 'NEW_STUDY_UNNAMED',
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
    local: {
      client: '100062',
      vendor: 'mtb',
      redirect: 'http://127.0.0.1:3000',
    },
    staging: {
      client: '100069',
      vendor: 'mtb-staging',
      redirect: 'https://staging.mobiletoolbox.org',
    },
  },
  /* client: {
    local: '100062',
    staging: '100069',
    production: '100018',
  },
  vendor: {
    local: 'mtb',
    staging: 'mtb-staging',
    production: '',
  }*/

  /*toastr: {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-bottom-center",
    preventDuplicates: true,
    showDuration: "300",
    hideDuration: 300,
    timeOut: 7000,
    extendedTimeOut: "1000",
    showEasing: "swing",
    hideEasing: "linear",
    showMethod: "fadeIn",
    hideMethod: "fadeOut",
    opacity: 1.0
  },
  msgs: {
    shared_modules: {
      PUBLISH: "Are you sure you want to publish this shared module version?"
    }
  },
  retentionReports: ['api', 'biomarin-pku-study', 'crf-module', 'sage-mpower-2'],*/
  endpoints: {
    /*adminAuth: '/v3/auth/admin',
  appConfigs: '/v3/appconfigs',
  appConfigElements: '/v3/appconfigs/elements',
  apps: '/v1/apps',
  cache: '/v3/cache',
  compoundactivitydefinitions: '/v3/compoundactivitydefinitions',
  emailStatus: '/v1/apps/self/emailStatus',
  export: '/v3/export',
  externalIds: '/v4/externalids',
  files: '/v3/files',
  getCurrentApp: '/v1/apps/self',
  getApp: '/v1/apps/',
  getAppList: '/v1/apps?format=summary',
  getAppPublicKey: '/v1/apps/self/publicKey',
  masterschedule: '/v3/schedulerconfigs',
  metadata: '/v3/sharedmodules/metadata',*/

    // assessment: '/v1/assessments/:id',
    //assessments: '/v1/assessments?includeDeleted=false',
    assmentsForSessions: '/v1/sessions/:sessionId/assessments',
    assessmentsShared: '/v1/sharedassessments/?includeDeleted=false',
    assessmentShared: '/v1/sharedassessments/:id',
    //assessmentResources: '/v1/assessments/identifier::identifier/resources', //'/v1/sharedassessments',
    assessmentsSharedResources:
      '/v1/sharedassessments/identifier::identifier/resources',
    bridgeAccount: '/v1/accounts/:id',
    //  enrollments: '/v5/studies/{studyId}/enrollments',
    enrollments: '/v5/studies/:studyId/enrollments',
    enrollmentsForUser: '/v5/studies/:studyId/participants/:userId/enrollments',
    events: '/v5/studies/:studyId/participants/:userId/activityevents',
    getAccountsForOrg: '/v1/organizations/:orgId/members',
    oauthSignIn: '/v3/auth/oauth/signIn',
    participant: '/v5/studies/:id/participants',
    participantsSearch: '/v5/studies/:id/participants/search',
    requestResetPassword: '/v3/auth/requestResetPassword',
    requestInfo: '/v5/studies/:studyId/participants/:userId/requestInfo',
    schedule: '/v5/schedules/:id',
    scheduleTimeline: '/v5/schedules/:id/timeline',
    selfInfo: '/v3/participants/self',
    signIn: '/v3/auth/signIn',
    signOut: '/v3/auth/signOut',
    study: '/v5/studies/:id',
    studies: '/v5/studies',
    synapseGetAlias: '/repo/v1/principal/alias',
    synapseGetUserProfile: '/repo/v1/user/:id/bundle',

    /*phoneSignIn: '/v3/auth/phone/signIn',
  reauth: '/v3/auth/reauth',
  reports: '/v3/reports',
  requestPhoneSignIn: '/v3/auth/phone',*/

    /* schemaPlans: '/v3/scheduleplans',
  schemas: '/v3/uploadschemas',
  schemasV4: '/v4/uploadschemas',
  sharedmodules: '/v3/sharedmodules',*/

    /* subpopulations: '/v3/subpopulations',
  substudies: '/v3/substudies',
  survey: '/v3/surveys',
  surveys: '/v3/surveys',
  templates: '/v3/templates',
  topics: '/v3/topics',
  uploads: '/v3/uploads',
  uploadstatuses: '/v3/uploadstatuses',
  users: '/v3/users',
  verifyEmail: '/v1/apps/self/verifyEmail',
  verifyAppEmail: '/v1/apps/self/emails/resendVerify'*/
  },
}
