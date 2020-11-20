export default {
  constants: {
    APP_ID: 'mtb-user-testing',
    STUDY_ID: 'mtb-user-testing',
    SESSION_NAME: 'bridge-session-mtb-user-testing',
    ENDPOINT: 'https://webservices.sagebridge.org',
  },

  /* templateTitles: {
    email_account_exists: 'Account already exists notification (email)',
    email_app_install_link: 'Link to install app (email)',
    email_reset_password: 'Reset password (email)',
    email_sign_in: 'Sign in (via email)',
    email_signed_consent: 'Consent agreement (email)',
    email_verify_email: 'Verify email address',
    sms_account_exists: 'Account already exists notification (SMS)',
    sms_app_install_link: 'Link to install app (SMS)',
    sms_phone_sign_in: 'Sign in (via SMS)',
    sms_reset_password: 'Reset password (SMS)',
    sms_signed_consent: 'Consent agreement (SMS)',
    sms_verify_phone: 'Verify phone number',
  },*/
  environments: [
    { value: 'local', label: 'Local' },
    { value: 'develop', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
  ],
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
      redirect: 'http://127.0.0.1:3000'

    },
    staging: {
      client: '100069',
      vendor: 'mtb-staging',
      redirect: 'https://staging.mobiletoolbox.org'

    }

  }
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
  ,
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
  sessionAssessments: '/v1/sessions/{sessionGuid}/assessments',
    assessments: '/v1/assessments?includeDeleted=false',
    assessmentsShared: '/v1/sharedassessments/?includeDeleted=false',
    assessmentShared: '/v1/sharedassessments/',
    assessment: '/v1/assessments/',
    assessmentsSharedResources:
      '/v1/sharedassessments/identifier:{identifier}/resources',
    assessmentResources: '/v1/assessments/identifier:{identifier}/resources', //'/v1/sharedassessments',
    oauthSignIn: '/v3/auth/oauth/signIn',
    selfInfo: '/v3/participants/self',
    enrollments: '/v5/studies/{studyId}/enrollments',
    participants: '/v3/participants/search',

    /*phoneSignIn: '/v3/auth/phone/signIn',
  reauth: '/v3/auth/reauth',
  reports: '/v3/reports',
  requestPhoneSignIn: '/v3/auth/phone',*/
    requestResetPassword: '/v3/auth/requestResetPassword',
    /* schemaPlans: '/v3/scheduleplans',
  schemas: '/v3/uploadschemas',
  schemasV4: '/v4/uploadschemas',
  sharedmodules: '/v3/sharedmodules',*/
    signIn: '/v3/auth/signIn',
    signOut: '/v3/auth/signOut',
    
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
