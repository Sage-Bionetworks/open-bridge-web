import {act, cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ChoiceQuestion} from '@typedefs/surveys'
import SelectPhoneBottomMenu from './SelectPhoneBottomMenu'

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
  singleChoice: false,
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

const onChange = jest.fn()

function setUp(step: ChoiceQuestion) {
  const user = userEvent.setup()
  const component = render(<SelectPhoneBottomMenu step={step} onChange={step => onChange(step)} />)

  return {user, component}
}

afterEach(cleanup)

test('trigger fn on add response', async () => {
  const {user} = setUp(step)
  const btnAddResponse = screen.getByRole('button', {name: /Add Response/i})
  await act(async () => await user.click(btnAddResponse))
  expect(onChange).toHaveBeenCalled()
})

test('additional options for integer multiselect', async () => {
  const {user} = setUp(step)
  const btnDots = screen.getByRole('button', {name: /more/i})

  await act(async () => user.click(btnDots))

  expect(screen.queryByRole('menuitem', {name: /all of the above/i})).toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /none of the above/i})).toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /other/i})).not.toBeInTheDocument()
})

test('additional options for string multiselect', async () => {
  const {user} = setUp({...step, baseType: 'string'})
  const btnDots = screen.getByRole('button', {name: /more/i})

  await act(async () => user.click(btnDots))

  expect(screen.queryByRole('menuitem', {name: /all of the above/i})).toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /none of the above/i})).toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /other/i})).not.toBeInTheDocument()
})

test('additional options for integer single select', async () => {
  const {user} = setUp({...step, baseType: 'integer', singleChoice: true})
  const btnDots = screen.getByRole('button', {name: /more/i})

  await act(async () => user.click(btnDots))

  expect(screen.queryByRole('menuitem', {name: /all of the above/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /none of the above/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /other/i})).not.toBeInTheDocument()
})

test('additional options for string single select', async () => {
  const {user} = setUp({...step, baseType: 'string', singleChoice: true})
  const btnDots = screen.getByRole('button', {name: /more/i})

  await act(async () => user.click(btnDots))

  expect(screen.queryByRole('menuitem', {name: /all of the above/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /none of the above/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('menuitem', {name: /other/i})).toBeInTheDocument()
})
