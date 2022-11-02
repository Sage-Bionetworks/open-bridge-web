//unit tests for BranchingConfig.tsx
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Step} from '@typedefs/surveys'
import SurveyQuestions from '__test_utils/mocks/surveyQuestions'
import {ProvideTheme} from '__test_utils/utils'
import BranchingConfig from './BranchingConfig'

const onMock = jest.fn()
//render the component
export const renderComponent = (step: any) => {
  const user = userEvent.setup()
  const element = render(
    <ProvideTheme>
      <BranchingConfig
        step={step}
        isOpen={true}
        questions={SurveyQuestions}
        invalidTargetStepIds={[]}
        onCancel={() => onMock('cancel')}
        onSave={() => onMock('save')}
        onChange={(questions: Step[]) => onMock(questions)}
      />
    </ProvideTheme>
  )

  return {user, element}
}

//mock the props
const step = {
  type: 'choiceQuestion',
  identifier: 'singleChoiceQ_wtmfwv',
  subtitle: 'Subtitle',
  title: 'SingleSelectBranching',
  detail: 'Detail',
  baseType: 'string',
  singleChoice: true,
  choices: [
    {
      value: 'Choice A',
      text: 'Choice A',
    },
    {
      value: 'Choice B',

      text: 'Choice B',
    },
    {
      text: 'Choice C',
      value: 'Choice C',
    },
    {
      text: 'Choice D',
      value: 'Choice D',
    },
  ],
  nextStepIdentifier: 'numericQ_sqkjfd',

  surveyRules: [
    {
      matchingAnswer: 'Choice A',
      ruleOperator: 'eq',
      skipToIdentifier: 'multiChoiceQ_rmmcjb',
    },
    {
      matchingAnswer: 'Choice B',
      ruleOperator: 'eq',
      skipToIdentifier: 'multiChoiceQ_rmmcjb',
    },
  ],
}

describe('BranchingConfig', () => {
  it('should render', () => {
    renderComponent(step)
  })
})
