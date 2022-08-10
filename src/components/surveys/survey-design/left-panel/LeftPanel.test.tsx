import {cleanup, render} from '@testing-library/react'
import {SurveyConfig} from '@typedefs/surveys'
import {MemoryRouter} from 'react-router-dom'
import surveySample from '__test_utils/mocks/surveySampleA'
import LeftPanel from './LeftPanel'

const onUpdateStep = jest.fn()
const onNavigateStep = jest.fn()

function renderControl(
  location: string,
  guid: string,
  surveyId: string,
  surveyConfig?: SurveyConfig
) {
  return render(
    <MemoryRouter initialEntries={[location]}>
      <LeftPanel
        onUpdateSteps={onUpdateStep}
        guid={guid}
        surveyId={surveyId}
        onNavigateStep={onNavigateStep}
        surveyConfig={surveyConfig}
      />
    </MemoryRouter>
  )
}

afterEach(() => {
  cleanup()
})

test('renders left panel for new survey without questions', () => {
  const app = renderControl('surveys/12345/design/title', '12345', 'sur01')

  const completion = app.queryByRole('link', {
    name: /Completion/i,
  })
  expect(completion).not.toBeInTheDocument()
})

test('renders left panel for survey with questions with completion screen ', async () => {
  const app = renderControl(
    'surveys/12345/design/title',
    '12345',
    'sur01',
    surveySample
  )

  const buttons = app.getAllByRole('button')

  const lastQuestion = app.queryByRole('button', {
    name: /12. What are your favorite colors?/i,
  })

  const completion = app.queryByRole('link', {
    name: /Completion/i,
  })

  expect(lastQuestion).toBeInTheDocument()
  expect(surveySample.steps.length).toBe(13)
  expect(buttons.length).toBe(12)
  expect(completion).toBeInTheDocument()
})
