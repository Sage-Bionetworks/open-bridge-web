import {screen} from '@testing-library/react'
import {NumericQuestion} from '@typedefs/surveys'
import {act} from 'react-dom/test-utils'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Numeric from './Numeric'

//render the component
const renderComponent = (step: NumericQuestion) => {
  return renderSurveyQuestionComponent<NumericQuestion>({
    step,
    Component: Numeric,
  })
}
//mock the props

const getCheckbox = () =>
  screen.getByRole('checkbox', {name: /no min and max/i})
const getMinInput = () => screen.getByRole('spinbutton', {name: /min/i})
const getMaxInput = () => screen.getByRole('spinbutton', {name: /max/i})
const step: NumericQuestion = {
  type: 'simpleQuestion',
  identifier: 'simpleQ3',
  title: 'How many times did you wake up for 5 minutes or longer?',
  uiHint: 'textfield',
  inputItem: {
    type: 'integer',
  },
}

//test the component renders without field label
test('renders the component without min/max', () => {
  renderComponent(step)
  const min = getMinInput()
  const max = getMaxInput()

  expect(getCheckbox()).toHaveProperty('checked', true)
  expect(min).toBeDisabled()
  expect(max).toBeDisabled()
  expect(min).toHaveValue(null)
  expect(max).toHaveValue(null)
})

//test the component renders without field label
test('renders the component with min and max', () => {
  renderComponent({
    ...step,
    inputItem: {
      type: 'integer',
      fieldLabel: 'My Label',
      formatOptions: {minimumValue: 3, maximumValue: 8},
    },
  })
  const min = getMinInput()
  const max = getMaxInput()

  expect(getCheckbox()).toHaveProperty('checked', false)
  expect(min).toHaveValue(3)
  expect(min).not.toBeDisabled()
  expect(max).not.toBeDisabled()
  expect(max).toHaveValue(8)
})

test('updates values', async () => {
  const {user} = renderComponent({
    ...step,
    inputItem: {
      type: 'integer',
      fieldLabel: 'My Label',
      formatOptions: {minimumValue: 3, maximumValue: 8},
    },
  })
  screen.debug()
  const min = getMinInput()
  const max = getMaxInput()
  await act(async () => await user.clear(min))
  await act(async () => await user.clear(max))
  await act(async () => await user.type(min, '5'))
  await act(async () => await user.type(max, '15'))
  expect(min).toHaveValue(5)
  expect(max).toHaveValue(15)
  await act(async () => await user.click(getCheckbox()))
  expect(getCheckbox()).toHaveProperty('checked', true)
  expect(min).toBeDisabled()
  expect(max).toBeDisabled()
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})

test('displays error if min  > max', async () => {
  const {user} = renderComponent({
    ...step,
    inputItem: {
      type: 'integer',
      fieldLabel: 'My Label',
      formatOptions: {minimumValue: 3, maximumValue: 8},
    },
  })

  const min = getMinInput()
  const max = getMaxInput()
  await act(async () => await user.clear(min))
  await act(async () => await user.clear(max))
  await act(async () => await user.type(min, '15'))
  await act(async () => await user.type(max, '5'))
  expect(min).toHaveValue(15)
  expect(max).toHaveValue(5)
  expect(screen.queryByRole('alert')).toBeInTheDocument()
})
