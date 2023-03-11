//unit tests for ./Completion.tsx using react-testing-library

import {act, screen} from '@testing-library/react'
import {Step} from '@typedefs/surveys'
import {createMemoryHistory} from 'history'
import {renderSurveyQuestionComponent} from '__test_utils/utils'
import Completion from './Completion'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'survey_12345',
  }),
}))

const renderComponent = (step: Step) => {
  return renderSurveyQuestionComponent({step, Component: Completion})
}

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

test('has the link to branching', async () => {
  const history = createMemoryHistory()
  console.log(history)
  const {user} = renderComponent(step)
  const link = screen.getByRole('button', {name: 'Preview Branching Logic'})
  console.log(link.attributes.length)
  await act(async () => await user.click(link))
  console.log(history)
  expect(history.length).toBe(2)
  expect(history.location.pathname).toBe('/about')
  expect(link.getAttribute('href')).toBe('/surveys/survey_12345/branching')
})
