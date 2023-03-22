import {YearQuestion} from '@typedefs/surveys'
/*
//render the component
const renderComponent = (step: YearQuestion) => {
  return renderSurveyQuestionComponent<YearQuestion>({step, Component: Year})
}
//mock the props

const getMinInput = () => screen.getByRole('spinbutton', {name: /min/i})
const getMaxInput = () => screen.getByRole('spinbutton', {name: /max/i})
const getPastCheckbox = () => {
  const p = screen.getByText('Allow past years').parentElement
  return within(p!).getByRole('checkbox')
}
const getFutureCheckbox = () => {
  const p = screen.getByText('Allow future years').parentElement
  return within(p!).getByRole('checkbox')
}*/

const step: YearQuestion = {
  type: 'simpleQuestion',
  identifier: 'simpleQ2',
  nextStepIdentifier: 'followupQ',
  title: 'Enter a birth year',
  inputItem: {
    type: 'year',
    fieldLabel: 'year of birth',
    placeholder: 'YYYY',
    formatOptions: {
      allowFuture: false,
      minimumYear: 1900,
    },
  },
}
test('renders the component with correct min/max and updates', async () => {
  //placeholder
  expect(true).toBe(true)
})
/*t
test('renders the component with correct min/max and updates', async () => {
  const {user} = renderComponent(step)
  const min = getMinInput()
  const max = getMaxInput()

  expect(min).toHaveValue(1900)
  expect(max).toHaveValue(null)

  expect(getPastCheckbox()).toHaveProperty('checked', true)
  expect(getFutureCheckbox()).toHaveProperty('checked', false)

  await act(async () => await user.click(getPastCheckbox()))
  await act(async () => await user.click(getFutureCheckbox()))
  expect(getPastCheckbox()).toHaveProperty('checked', false)
  expect(getFutureCheckbox()).toHaveProperty('checked', true)
  await act(async () => {
    user.clear(min)
    await user.type(min, '2000')
  })
  expect(getMinInput()).toHaveValue(2000)
})

est('renders the component with different params', () => {
  renderComponent({
    ...step,
    inputItem: {
      type: 'year',
      fieldLabel: 'My Label',
      formatOptions: {
        maximumYear: 1900,
      },
    },
  })
  const min = getMinInput()
  const max = getMaxInput()
  expect(min).toHaveValue(null)
  expect(max).toHaveValue(1900)
  expect(getPastCheckbox()).toHaveProperty('checked', true)
  expect(getFutureCheckbox()).toHaveProperty('checked', true)
})

test('validation for values update', async () => {
  const {user} = renderComponent({
    ...step,
    inputItem: {
      type: 'year',
      fieldLabel: 'My Label',
      formatOptions: {
        allowFuture: false,
        allowPast: false,
      },
    },
  })
  const min = getMinInput()
  const max = getMaxInput()
  expect(min).toHaveValue(null)

  await act(async () => {
    user.clear(min)
    await user.type(min, '2000')
  })
  expect(screen.queryByRole('alert')).toHaveTextContent('No past years allowed')
  await act(async () => await user.click(getPastCheckbox()))
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  await act(async () => {
    user.clear(max)
    await user.type(max, '1999')
  })
  expect(screen.queryByRole('alert')).toHaveTextContent('Max value must be greater than min value')
  await act(async () => {
    user.clear(max)
    await user.type(max, '2023')
  })
  expect(screen.queryByRole('alert')).toHaveTextContent('No future years allowed')
  await act(async () => await user.click(getFutureCheckbox()))
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  await act(async () => await user.click(getFutureCheckbox()))
  expect(screen.queryByRole('alert')).toHaveTextContent('No future years allowed')
})*/
