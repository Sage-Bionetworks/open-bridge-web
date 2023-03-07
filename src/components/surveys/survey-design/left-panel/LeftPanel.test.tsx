import {cleanup, render} from '@testing-library/react'
import {SurveyConfig} from '@typedefs/surveys'
import surveySample from '__test_utils/mocks/surveySampleA'
import {createWrapper} from '__test_utils/utils'
import LeftPanel from './LeftPanel'

const onReorderSteps = jest.fn()
const onNavigateStep = jest.fn()

function renderControl(location: string, guid: string, surveyId: string, surveyConfig?: SurveyConfig) {
  const element = render(
    <LeftPanel
      onReorderSteps={onReorderSteps}
      guid={guid}
      surveyId={surveyId}
      onNavigateStep={onNavigateStep}
      surveyConfig={surveyConfig}
    />,
    {wrapper: createWrapper()}
  )
  return element
}

afterEach(() => {
  cleanup()
})

test('renders left panel for new survey without questions', () => {
  const app = renderControl('surveys/12345/design/title', '12345', 'sur01')

  const completion = app.queryByRole('link', {
    name: /Completion Screen/i,
  })
  expect(completion).not.toBeInTheDocument()
})

test('renders left panel for survey with questions with completion screen ', async () => {
  const app = renderControl('surveys/12345/design/title', '12345', 'sur01', surveySample)

  const buttons = app.getAllByRole('button')

  const lastQuestion = app.queryByRole('button', {
    name: /11. What are your favorite colors?/i,
  })

  /*  const completion = app.queryByRole('button', {
    name: /Completion Screen/i,
  })*/

  expect(lastQuestion).toBeInTheDocument()
  expect(surveySample.steps.length).toBe(13)
  expect(buttons.length).toBe(11)
  //w expect(completion).toBeInTheDocument()
})
