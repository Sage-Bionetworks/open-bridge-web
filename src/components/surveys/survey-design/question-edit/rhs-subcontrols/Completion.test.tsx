//unit tests for ./Completion.tsx using react-testing-library

import {screen} from '@testing-library/react'
import {Step} from '@typedefs/surveys'
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

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

test('has the link to branching', async () => {
  renderComponent(step)
  // TODO: syoung 11/02/2023 Uncomment once branching logic is supported on production
  // const link = screen.getByRole('link', {name: 'Preview Branching Logic'})
  // expect(link).toBeInTheDocument()
})
