import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Step, WebUISkipOptions} from '@typedefs/surveys'
import surveyQuestions from '__test_utils/mocks/surveyQuestions'
import QuestionEditPhone from './QuestionEditPhone'

const onChange = jest.fn()

const renderComponent = (isDynamic: boolean, skipConfig: WebUISkipOptions, step: Step, progress: number) => {
  const component = render(
    <QuestionEditPhone
      isDynamic={isDynamic}
      globalSkipConfiguration={skipConfig}
      onChange={(step: Step) => {
        onChange(step)
      }}
      step={step}
      completionProgress={progress}
    />
  )
  const user = userEvent.setup()
  return {user, component}
}

describe('QuestionEditPhone', () => {
  it('should render with correct buttons for static questions', () => {
    renderComponent(false, 'CUSTOMIZE', surveyQuestions[0], 10)
    expect(surveyQuestions[0].type).toBe('overview')
    expect(screen.queryByRole('button', {name: /make required/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /allow skip/i})).not.toBeInTheDocument()
    expect(screen.queryByText('Skip question')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /sort alpha/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /sort reverse/i})).not.toBeInTheDocument()
  })

  it('should render with correct buttons for dynamic not choice questions', () => {
    renderComponent(true, 'CUSTOMIZE', surveyQuestions[2], 10)
    expect(surveyQuestions[2].type).toBe('simpleQuestion')
    expect(screen.queryByRole('button', {name: /make required/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /allow skip/i})).toBeInTheDocument()
    expect(screen.queryByText('Skip question')).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /sort alpha/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /sort reverse/i})).not.toBeInTheDocument()
  })

  it('should render with correct buttons for choice questions', () => {
    renderComponent(true, 'CUSTOMIZE', surveyQuestions[1], 10)
    expect(surveyQuestions[1].type).toBe('choiceQuestion')
    expect(screen.queryByRole('button', {name: /make required/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /allow skip/i})).toBeInTheDocument()
    expect(screen.queryByText('Skip question')).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /sort alpha/i})).toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /sort reverse/i})).toBeInTheDocument()
  })
})
it('should render with correct buttons with config set to SKIP', () => {
  renderComponent(true, 'SKIP', surveyQuestions[1], 10)

  expect(screen.queryByRole('button', {name: /make required/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /allow skip/i})).not.toBeInTheDocument()
  expect(screen.queryByText('Skip question')).toBeInTheDocument()
})

it('should render with correct buttons with config set to MAKE ALL REQUIRED ', () => {
  renderComponent(true, 'NO_SKIP', surveyQuestions[1], 10)

  expect(screen.queryByRole('button', {name: /make required/i})).not.toBeInTheDocument()
  expect(screen.queryByRole('button', {name: /allow skip/i})).not.toBeInTheDocument()
  expect(screen.queryByText('Skip question')).not.toBeInTheDocument()
})
