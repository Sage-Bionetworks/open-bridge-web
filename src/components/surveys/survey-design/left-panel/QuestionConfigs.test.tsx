import {cleanup} from '@testing-library/react'

import steps from '../../../../__test_utils/mocks/surveyQuestions'
import {getQuestionId} from './QuestionConfigs'

import {Step} from '@typedefs/surveys'

afterEach(cleanup)

const stepExpectations = [
  'OVERVIEW',
  'SINGLE_SELECT',
  'FREE_TEXT',
  'YEAR',
  'LIKERT',
  'SLIDER',
  'DURATION',

  'TIME',
  'SINGLE_SELECT',
  'SINGLE_SELECT',

  'INSTRUCTION',
  'MULTI_SELECT',
  'COMPLETION',

  // 'MULTI_SELECT',
  // 'NUMERIC',

  /* 

  'COMPLETION',*/
]

//ALINA TODO: All questions

test('returns correct question types ids for questions', () => {
  steps.forEach((step: any, i: number) => {
    const _step = step as Step
    //  console.log(_step)
    if (i < stepExpectations.length) {
      expect(getQuestionId(_step)).toBe(stepExpectations[i])
    }
  })
})
