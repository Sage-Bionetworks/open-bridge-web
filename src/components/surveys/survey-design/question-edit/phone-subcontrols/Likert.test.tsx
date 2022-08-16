import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {LikertQuestion} from '@typedefs/surveys'
import Likert from './Likert'

const QUESTION: LikertQuestion = {
  type: 'simpleQuestion',
  identifier: 'simpleQ3',
  nextStepIdentifier: 'followupQ',
  title: 'How much do you like apples?',
  detail: 'Description to show',
  uiHint: 'likert',
  inputItem: {
    type: 'integer',
    formatOptions: {
      maximumLabel: 'Very much',
      maximumValue: 7,
      minimumLabel: 'Not at all',
      minimumValue: 1,
    },
  },
}

let component

function setUp(step: LikertQuestion = QUESTION) {
  const user = userEvent.setup()
  component = render(<Likert step={step} onChange={step => onChange(step)} />)

  return {user, component}
}

const onChange = jest.fn()
afterEach(cleanup)

test('show the scale correctly', async () => {
  const {component} = setUp()

  expect(screen.queryByText('1')).toBeInTheDocument()
  expect(screen.queryByText('7')).toBeInTheDocument()
  expect(screen.queryByText('0')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()
  expect(screen.queryByText('Very much')).toBeInTheDocument()
  expect(screen.queryByText('Not at all')).toBeInTheDocument()
})

test('show the min and max values/labels correctly', async () => {
  const newInput = {
    ...QUESTION.inputItem,
    formatOptions: {
      ...QUESTION.inputItem.formatOptions,
      minimumValue: 0,
      maximumValue: 8,
      minimumLabel: 'MIN',
      maximumLabel: 'MAX',
    },
  }
  const {component} = setUp({...QUESTION, inputItem: newInput})
  expect(screen.queryByText('1')).toBeInTheDocument()
  expect(screen.queryByText('7')).toBeInTheDocument()
  expect(screen.queryByText('0')).toBeInTheDocument()
  expect(screen.queryByText('8')).toBeInTheDocument()
  expect(screen.queryByText('Very much')).not.toBeInTheDocument()
  expect(screen.queryByText('Not at all')).not.toBeInTheDocument()
  expect(screen.queryByText('MIN')).toBeInTheDocument()
  expect(screen.queryByText('MAX')).toBeInTheDocument()
})
