//unit tests for ./Completion.tsx using react-testing-library


import { screen } from '@testing-library/react'
import { Step } from '@typedefs/surveys'
import { renderSurveyQuestionComponent } from '__test_utils/utils'
import Completion from './Completion'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 'survey_12345'
    })
}))

const renderComponent = (step: Step) => {
    return renderSurveyQuestionComponent({ step, Component: Completion })
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
    const { user, element } = renderComponent(step)
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/surveys/survey_12345/branching')
})