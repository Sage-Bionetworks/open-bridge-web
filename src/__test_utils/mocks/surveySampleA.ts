import {SurveyConfig} from '@typedefs/surveys'
import steps from './surveyQuestions'

const survey: SurveyConfig = {
  type: 'assessment',
  identifier: 'surveyA',

  versionString: '1.0.0',
  estimatedMinutes: 3,

  title: 'Example Survey A',
  detail:
    "This is intended as an example of a survey with a list of questions. There are no sections and there are no additional instructions. In this survey, pause navigation is hidden for all nodes. For all questions, the skip button should say 'Skip me'. Default behavior is that buttons that make logical sense to be displayed are shown unless they are explicitly hidden.",
  steps: steps,
}

export default survey
