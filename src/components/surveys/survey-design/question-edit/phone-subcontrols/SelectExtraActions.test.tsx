import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ChoiceQuestion} from '@typedefs/surveys'
import {act} from 'react-dom/test-utils'
import {ProvideTheme} from '__test_utils/utils'
import SelectExtraActions from './SelectExtraActions'

const onSortFn = jest.fn()
//render the component
export const renderComponent = (step: ChoiceQuestion) => {
  const user = userEvent.setup()
  const element = render(
    <ProvideTheme>
      <SelectExtraActions onSort={onSortFn} />
    </ProvideTheme>
  )

  return {user, element}
}

//mock the props
const step: ChoiceQuestion = {
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

test('renders the component and executes a callback with correct arguments', async () => {
  renderComponent(step)
  const sort = screen.getByRole('button', {name: /alpha/i})
  const sortReverse = screen.getByRole('button', {name: /reverse/i})
  await act(async () => await userEvent.click(sort))
  expect(onSortFn).toHaveBeenCalledWith(1)
  await act(async () => await userEvent.click(sortReverse))
  expect(onSortFn).toHaveBeenCalledWith(-1)
})
