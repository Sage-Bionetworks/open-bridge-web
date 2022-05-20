import {Study, StudyDesignType} from '@typedefs/types'

export const noStudy = {
  status: 'idle',
  isLoading: false,
  isSuccess: false,
  isError: false,
  isIdle: true,
  dataUpdatedAt: 0,
  error: null,
  errorUpdatedAt: 0,
  failureCount: 0,
  isFetched: false,
  isFetchedAfterMount: false,
  isFetching: false,
  isLoadingError: false,
  isPlaceholderData: false,
  isPreviousData: false,
  isRefetchError: false,
  isStale: true,
  data: undefined,
}

export const studyData: Study = {
  identifier: '12345',
  name: 'Study For Testing',
  studyStartEventId: 'timeline_retrieved',

  clientData: {
    welcomeScreenData: {
      welcomeScreenHeader: '',
      welcomeScreenBody: '',
      welcomeScreenFromText: '',
      welcomeScreenSalutation: '',
      useOptionalDisclaimer: true,
      isUsingDefaultMessage: true,
    },
  },

  phase: 'design',
  details:
    'Et nemo quas et quisquam qui quo dolore perspiciatis elit cupiditate quo architecto itaque mollitia omnis veritatis eius ab',
  irbName: 'test',
  irbDecisionOn: '2022-05-26',
  irbExpiresOn: '2022-05-26',
  irbDecisionType: 'exempt',
  irbProtocolId: 'Ipsa repudiandae od',
  colorScheme: {
    background: '#351c1c',
    type: 'ColorScheme',
  },
  //scheduleGuid: '1Nhzr9dusXiRDKx-k9uQQDCj',
  keywords: 'physical activity',
  version: 1,
  contacts: [
    {
      name: 'Sit velit nobis adip',
      role: 'irb',
      position: 'IRB/Ethics Board of Record',
      email: 'raxizu@mailinator.com',
      phone: {
        number: '+13123396222',
        regionCode: 'US',
        nationalFormat: '(312) 339-6222',
      },
    },
    {
      name: 'Qui sunt praesentium',
      role: 'sponsor',
    },
    {
      name: 'Pariatur Voluptatem',
      role: 'study_support',
      position: 'Est quis et numquam ',
      email: 'sequza@mailinator.com',
      phone: {
        number: '+13123396222',
        regionCode: 'US',
        nationalFormat: '(312) 339-6222',
      },
    },
    {
      name: 'Ann Campton',
      role: 'principal_investigator',
      affiliation: 'Sit velit nobis adip',
    },
  ],
  diseases: ['Achalasia'],
  studyDesignTypes: ['validate' as StudyDesignType],
  signInTypes: ['external_id_password'],
  customEvents: [],
}
