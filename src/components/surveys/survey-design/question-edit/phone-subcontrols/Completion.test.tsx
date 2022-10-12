//unit tests for ./Completion.tsx using react-testing-library
import {act, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Step} from '@typedefs/surveys'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Completion from './Completion'

//render the component
const renderComponent = (step: Step) => {
  return renderSurveyQuestionComponent({step, Component: Completion})
}

const getTitle = () => screen.getByDisplayValue(step.title)
const getDetail = () => screen.getByDisplayValue(step.detail || '')

//mock the props

const step: Step = {
  type: 'completion',
  identifier: 'completion',
  title: 'Completion',
  detail: 'Thank you for completing the survey.',
  image: {
    type: 'sageResource',
    imageName: 'survey',
  },
}

//test the component renders
test('renders the component', () => {
  renderComponent(step)
  expect(getTitle()).toBeInTheDocument()
  expect(getDetail()).toBeInTheDocument()
})
//test that the title can be edited
test('the title can be edited', async () => {
  const {user} = renderComponent(step)
  const title = getTitle()
  expect(title).toHaveValue(step.title)
  await act(async () => await user.clear(title))
  await act(async () => await user.type(title, 'New Title'))
  expect(title).toHaveValue('New Title')
})
//test that the detail can be edited
test('the detail can be edited', async () => {
  const {user} = renderComponent(step)
  const detail = getDetail()
  expect(detail).toHaveValue(step.detail)
  await act(async () => await user.clear(detail))
  await act(async () => await userEvent.type(detail, 'New Details'))
  expect(detail).toHaveValue('New Details')
})
