import {cleanup, screen, waitFor, within} from '@testing-library/react'
import {ChoiceQuestion} from '@typedefs/surveys'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Select from './Select'

const step: ChoiceQuestion = {
  type: 'choiceQuestion',
  identifier: 'choiceQ1',
  comment: 'Go to the question selected by the participant. If they skip the question then go directly to follow-up.',
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
      value: 5,
      text: 'Duration',
    },
    {
      value: 6,
      text: 'Time',
    },
  ],
}

const renderComponent = (step: ChoiceQuestion) => {
  return renderSurveyQuestionComponent({step, Component: Select})
}

afterEach(cleanup)

test('show the Select options correctly', () => {
  renderComponent(step)
  for (const choice of step.choices) {
    expect(screen.getByRole('button', {name: new RegExp(choice.text, 'i')})).toBeInTheDocument()
  }
})

test('delete an option, and rules pertaining to it', async () => {
  const {user} = renderComponent(step)
  const birthYearOption = screen.getByRole('button', {name: /birth year/i})
  const deleteButton = within(birthYearOption).getByRole('button', {
    name: /delete/i,
  })
  await user.click(deleteButton)
  await waitFor(() => {
    expect(screen.queryByRole('button', {name: /birth year/i})).not.toBeInTheDocument()
  })
})

test('rename an option', async () => {
  const {user} = renderComponent(step)
  const optionToRename = screen.getByRole('button', {name: /Likert Select/i})
  expect(screen.queryByRole('button', {name: /Likert Select/i})).not.toBeNull()
  const label = within(optionToRename).getByRole('textbox')
  await user.clear(label)
  await user.type(label, 'New Label')
  await user.tab()
  expect(screen.queryByRole('button', {name: /Likert Select/i})).toBeNull()
  expect(screen.queryByRole('button', {name: /New Label/i})).not.toBeNull()
})
