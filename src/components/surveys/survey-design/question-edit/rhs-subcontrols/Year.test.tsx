import {screen} from '@testing-library/react'
import {YearQuestion} from '@typedefs/surveys'
import {act} from 'react-dom/test-utils'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Year from './Year'

//render the component
const renderComponent = (step: YearQuestion) => {
  return renderSurveyQuestionComponent<YearQuestion>({step, Component: Year})
}
//mock the props

const getCheckbox = () =>
  screen.getByRole('checkbox', {name: /no min and max/i})
const getMinInput = () => screen.getByRole('button', {name: /min/i})
const getMaxInput = () => screen.getByRole('button', {name: /max/i})

const step: YearQuestion = {
  type: 'simpleQuestion',
  identifier: 'simpleQ6',
  nextStepIdentifier: 'followupQ',
  title: 'What time is it on the moon?',
  inputItem: {
    type: 'year',
  },
}

//test the component renders without field label
test('renders the component without min/max', () => {
  renderComponent(step)
  const min = getMinInput()
  const max = getMaxInput()

  expect(getCheckbox()).toHaveProperty('checked', true)
  expect(min).toHaveClass('Mui-disabled')
  expect(max).toHaveClass('Mui-disabled')
  // expect(min).toHaveValue(null)
  //expect(max).toHaveValue(null)
})

//test the component renders without field label
test('renders the component with min and max', () => {
  renderComponent({
    ...step,
    inputItem: {
      type: 'year',
      fieldLabel: 'My Label',
      formatOptions: {minimumValue: '10:00', maximumValue: '12:00'},
    },
  })
  const min = getMinInput()
  const max = getMaxInput()
  expect(getCheckbox()).toHaveProperty('checked', false)
  expect(min).toHaveTextContent('10:00')
  expect(max).toHaveTextContent('12:00')
  expect(min).not.toHaveClass('Mui-disabled')
  expect(max).not.toHaveClass('Mui-disabled')
  expect(
    screen.getByRole('radio', {name: /allow any time value/i})
  ).toHaveProperty('checked', true)
  expect(
    screen.getByRole('radio', {name: /allow only time in the future/i})
  ).toHaveProperty('checked', false)
  expect(
    screen.getByRole('radio', {name: /allow only time in the past/i})
  ).toHaveProperty('checked', false)
})

test('updates values', async () => {
  const {user} = renderComponent({
    ...step,
    inputItem: {
      type: 'year',
      fieldLabel: 'My Label',
      formatOptions: {
        allowFuture: false,
        allowPast: true,
        minimumValue: '10:00',
        maximumValue: '12:00',
      },
    },
  })

  const min = getMinInput()
  const max = getMaxInput()
  await act(async () => await user.click(min))
  const minItem = screen.getByRole('option', {name: /05:00/i})
  await act(async () => await user.click(minItem))
  await act(async () => await user.click(max))
  const maxItem = screen.getByRole('option', {name: /15:00/i})
  await act(async () => await user.click(maxItem))

  expect(min).toHaveTextContent('05:00')
  expect(max).toHaveTextContent('15:00')
  await act(async () => await user.click(getCheckbox()))
  expect(getCheckbox()).toHaveProperty('checked', true)
  expect(min).toHaveClass('Mui-disabled')
  expect(max).toHaveClass('Mui-disabled')
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(
    screen.getByRole('radio', {name: /allow only time in the past/i})
  ).toHaveProperty('checked', true)
})
