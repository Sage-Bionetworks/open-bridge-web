const MTB_APP_ID = 'mobile-toolbox'
const ARC_APP_ID = 'arc'
const INV_ARC_ID = 'inv-arc'
const MTB_ONESAGE_APP_ID = 'MTB'
const ARC_ONESAGE_APP_ID = 'ARC'
const INV_ARC_ONESAGE_APP_ID = 'INV-ARC'
const constants = {
  constants: {
    MTB_APP_ID: MTB_APP_ID,
    ARC_APP_ID: ARC_APP_ID,
    INV_ARC_APP_ID: INV_ARC_ID,
    MTB_ONESAGE_APP_ID: MTB_ONESAGE_APP_ID,
    ARC_ONESAGE_APP_ID: ARC_ONESAGE_APP_ID,
    INV_ARC_ONESAGE_APP_ID: INV_ARC_ONESAGE_APP_ID,

    SESSION_NAME: 'mtb-user-session',
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
    SURVEY_BUILDER: '/surveys/:id/design',
    SURVEY_BRANCHING: '/surveys/:id/branching',
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

  oauth: {
    local_mtb: {
      client: '100062',
      vendor: 'mtb-dev',
      redirect: 'http://127.0.0.1:3000',
      appId: MTB_APP_ID,
      oneSageAppId: MTB_ONESAGE_APP_ID,
    },
    /* staging_mtb: {
      client: '100069',
      vendor: 'mtb-staging',
      redirect: 'https://staging.mobiletoolbox.org',
    },*/
    stage_mtb_studies: {
      client: '100122',
      vendor: 'mtb-staging-studies',
      redirect: 'https://staging.studies.mobiletoolbox.org',
      appId: MTB_APP_ID,
      oneSageAppId: MTB_ONESAGE_APP_ID,
    },
    prod_mtb_studies: {
      client: '100123',
      vendor: 'mtb-prod',
      redirect: 'https://studies.mobiletoolbox.org',
      appId: MTB_APP_ID,
      oneSageAppId: MTB_ONESAGE_APP_ID,
    },
    local_arc: {
      client: '100104',
      vendor: 'arc-dev',
      redirect: 'http://127.0.0.1:3001',
      appId: ARC_APP_ID,
      oneSageAppId: ARC_ONESAGE_APP_ID,
    },

    stage_arc_studies: {
      client: '100162',
      vendor: 'arc-stage',
      redirect: 'https://staging.arcdashboard.sagebionetworks.org',
      appId: ARC_APP_ID,
      oneSageAppId: ARC_ONESAGE_APP_ID,
    },
    prod_arc_studies: {
      client: '100164',
      vendor: 'arc-prod',
      redirect: 'https://arcdashboard.sagebionetworks.org',
      appId: ARC_APP_ID,
      oneSageAppId: ARC_ONESAGE_APP_ID,
    },

    local_inv_arc: {
      client: '100276',
      vendor: 'inv-arc-dev',
      redirect: 'http://127.0.0.1:3002',
      appId: INV_ARC_ID,
      oneSageAppId: INV_ARC_ONESAGE_APP_ID,
    },
    stage_inv_arc_studies: {
      client: '100274',
      vendor: 'inv-arc-stage',
      redirect: 'https://staging.inv-arcdashboard.sagebionetworks.org',
      appId: INV_ARC_ID,
      oneSageAppId: INV_ARC_ONESAGE_APP_ID,
    },
    prod_inv_arc_studies: {
      client: '100275',
      vendor: 'inv-arc-prod',
      redirect: 'https://inv-arcdashboard.sagebionetworks.org',
      appId: INV_ARC_ID,
      oneSageAppId: INV_ARC_ONESAGE_APP_ID,
    },
  },

  endpoints: {
    adherenceDetail: '/v5/studies/:studyId/participants/:userId/adherence/study',
    adherenceStats: '/v5/studies/:studyId/adherence/stats',
    adherenceUserWeekly: '/v5/studies/:studyId/participants/:userId/adherence/weekly',
    adherenceWeekly: '/v5/studies/:studyId/adherence/weekly',
    assessment: '/v1/assessments/:id',
    assessmentShared: '/v1/sharedassessments/:id',
    assessments: '/v1/assessments/?includeDeleted=false',
    assessmentsShared: '/v1/sharedassessments/?includeDeleted=false',
    assessmentResources: '/v1/assessments/identifier::identifier/resources', //'/v1/sharedassessments',
    assessmentSharedResources: '/v1/sharedassessments/identifier::identifier/resources',
    assmentsForSessions: '/v1/sessions/:sessionId/assessments',
    bridgeAccount: '/v1/accounts/:id',
    enrollments: '/v5/studies/:studyId/enrollments',
    enrollment: '/v5/studies/:studyId/enrollments/:userId',
    participantEnrollments: '/v5/studies/:studyId/participants/:userId/enrollments',
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

export default constants
