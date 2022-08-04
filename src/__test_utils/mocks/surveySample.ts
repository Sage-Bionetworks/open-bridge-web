import {Survey} from '@typedefs/surveys'
import steps from './surveyQuestions'

const surveySample: Survey = {
  version: 1,
  config: {
    type: 'assessment',
    identifier: 'foo',
    versionString: '1.2.3',
    schemaIdentifier: 'bar',
    title: 'Hello World!',
    subtitle: 'Subtitle',
    detail: 'Some text. This is a test.',
    estimatedMinutes: 4,
    icon: 'fooIcon',
    footnote: 'This is a footnote.',
    actions: {
      goForward: {type: 'default', buttonTitle: 'Go, Dogs! Go!'},
      cancel: {type: 'default', iconName: 'closeX'},
    },
    shouldHideActions: ['goBackward'],
    progressMarkers: ['step1', 'step2'],
    steps,
  },
}

export default surveySample
