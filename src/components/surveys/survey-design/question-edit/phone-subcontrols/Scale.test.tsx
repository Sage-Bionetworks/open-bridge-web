import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ScaleQuestion} from '@typedefs/surveys'
import Scale from './Scale'

const QUESTION: ScaleQuestion = {
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

function setUp(step: ScaleQuestion = QUESTION) {
  const user = userEvent.setup()
  component = render(<Scale step={step} onChange={step => onChange(step)} />)

  return {user, component}
}

const onChange = jest.fn()
afterEach(cleanup)

test('show the scale correctly', () => {
  setUp()

  expect(screen.queryByText('1')).toBeInTheDocument()
  expect(screen.queryByText('2')).toBeInTheDocument()
  expect(screen.queryByText('7')).toBeInTheDocument()
  expect(screen.queryByText('0')).not.toBeInTheDocument()
  expect(screen.queryByText('8')).not.toBeInTheDocument()
  expect(screen.queryByText('Very much')).toBeInTheDocument()
  expect(screen.queryByText('Not at all')).toBeInTheDocument()
})

test('should only display the max and min for the slider', () => {
  setUp({...QUESTION, uiHint: 'slider'})
  expect(screen.queryByText('1')).toBeInTheDocument()
  expect(screen.queryByText('2')).not.toBeInTheDocument()
  expect(screen.queryByText('7')).toBeInTheDocument()
})

test('show the min and max values/labels correctly', () => {
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
