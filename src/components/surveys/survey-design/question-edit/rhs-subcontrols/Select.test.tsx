import {act, cleanup, screen, within} from '@testing-library/react'
import {ChoiceQuestion} from '@typedefs/surveys'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Select from './Select'

const step: ChoiceQuestion = {
  type: 'choiceQuestion',
  identifier: 'choiceQ1',
  comment:
    'Go to the question selected by the participant. If they skip the question then go directly to follow-up.',
  title: 'Choose which question to answer',
  surveyRules: [
    {
      skipToIdentifier: 'followupQ',
    },
    {
      matchingAnswer: 1,
      skipToIdentifier: 'simpleQ1',
    },
    {
      matchingAnswer: 2,
      skipToIdentifier: 'simpleQ2',
    },
    {
      matchingAnswer: 3,
      skipToIdentifier: 'simpleQ3',
    },
    {
      matchingAnswer: 4,
      skipToIdentifier: 'simpleQ4',
    },
    {
      matchingAnswer: 5,
      skipToIdentifier: 'simpleQ5',
    },
    {
      matchingAnswer: 6,
      skipToIdentifier: 'simpleQ6',
    },
  ],
  baseType: 'integer',
  singleChoice: true,
  choices: [
    {
      value: 1,
      text: 'Enter some text',
    },
    {
      value: 2,
      text: 'Birth year',
    },
    {
      value: 3,
      text: 'Likert Select',
    },
    {
      value: 4,
      text: 'Sliding Select',
    },
    {
      value: '5',
      text: 'Duration',
    },
    {
      value: '6',
      text: 'Time',
    },
  ],
}

const getQuestionTypeSelect = () =>
  screen.getByRole('button', {name: /question type:/i})
const getDataTypeSelect = () =>
  screen.getByRole('button', {name: /set response value pairing:/i})

//render the component
const renderComponent = (step: ChoiceQuestion) => {
  return renderSurveyQuestionComponent<ChoiceQuestion>({
    step,
    Component: Select,
  })
}
afterEach(cleanup)

test('show the setting correctly for single select and integer', async () => {
  renderComponent(step)
  const questionTypeSelect = getQuestionTypeSelect()
  const dataTypeSelect = getDataTypeSelect()
  expect(questionTypeSelect).toHaveTextContent('Single Select')
  expect(dataTypeSelect).toHaveTextContent('Integer')
})

test('show the setting correctly for multi-select and string', async () => {
  renderComponent({...step, singleChoice: false, baseType: 'string'})
  const questionTypeSelect = getQuestionTypeSelect()
  const dataTypeSelect = getDataTypeSelect()
  expect(questionTypeSelect).toHaveTextContent('Multi-Select')
  expect(dataTypeSelect).toHaveTextContent('String')
})

test('updates the values for questions', async () => {
  const {user} = renderComponent(step)
  var cell = screen.getByText(/Time/, {exact: true})
  var textBox = within(cell.parentElement?.parentElement || cell).getByRole(
    'textbox'
  )
  expect(textBox).toHaveValue('6')
  await act(async () => {
    await user.type(textBox, '7')
  })
  expect(textBox).toHaveValue('67')
})

test('updates the values for select type and data type', async () => {
  const {user} = renderComponent({...step})
  const questionTypeSelect = getQuestionTypeSelect()
  const dataTypeSelect = getDataTypeSelect()
  expect(questionTypeSelect).toHaveTextContent('Single Select')
  await act(async () => await user.click(questionTypeSelect))
  await act(
    async () =>
      await user.click(screen.getByRole('option', {name: /multi\-select/i}))
  )
  expect(questionTypeSelect).toHaveTextContent('Multi-Select')

  expect(dataTypeSelect).toHaveTextContent('Integer')
  await act(async () => await user.click(dataTypeSelect))
  await act(
    async () => await user.click(screen.getByRole('option', {name: /string/i}))
  )
  expect(dataTypeSelect).toHaveTextContent('String')
})
