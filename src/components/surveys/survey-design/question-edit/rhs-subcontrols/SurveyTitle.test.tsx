import {act, screen} from '@testing-library/react'
import {Step} from '@typedefs/surveys'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import SurveyTitle from './SurveyTitle'

//render the component
const renderComponent = (step: Step) => {
  return renderSurveyQuestionComponent({step, Component: SurveyTitle})
}

//mock the props
const step: Step = {
  type: 'overview',
  identifier: 'overview',
  title: 'Survey Title',
  detail:
    'Summary to participants on what they should know about the survey, thanking them for their time, what type of environment they should be taking it in, etc.',
  image: {
    imageName: 'energy',
    type: 'sageResource',
  },
}

test('renders the component with the right image', () => {
  renderComponent(step)
  const imgContainer = screen.getByRole('img', {name: /energy/i}).parentElement
  expect(imgContainer).toHaveClass('selected')
})

test('updates the image correctly', async () => {
  const {user} = renderComponent(step)
  const currentImgContainer = screen.getByRole('img', {
    name: /energy/i,
  }).parentElement
  const imgContainerHealth = screen.getByRole('img', {
    name: /mood/i,
  }).parentElement
  expect(currentImgContainer).toHaveClass('selected')
  expect(imgContainerHealth).not.toHaveClass('selected')
  await act(async () => await user.click(screen.getByRole('img', {name: /mood/i})))
  expect(currentImgContainer).not.toHaveClass('selected')
  expect(imgContainerHealth).toHaveClass('selected')
})
