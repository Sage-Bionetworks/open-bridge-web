//teest for surveyTitle.tsx
//unit tests for ./SurveyTitle.tsx using react-testing-library
import { act, screen } from '@testing-library/react'
import { Step } from '@typedefs/surveys'
import { renderSurveyQuestionComponent } from '__test_utils/utils'
import SurveyTitle from './SurveyTitle'

//render the component
const renderComponent = (step: Step) => {
    return renderSurveyQuestionComponent({ step, Component: SurveyTitle })
}

const getTitle = () => screen.getByDisplayValue(step.title)
const getDetail = () => screen.getByDisplayValue(step.detail || '')

//mock the props
const step: Step = {

    "type": "overview",
    "identifier": "overview",
    "title": "Survey Title",
    "detail": "Summary to participants on what they should know about the survey, thanking them for their time, what type of environment they should be taking it in, etc.",
    "image": {
        "imageName": "energy",
        "type": "sageResource"
    }
}


//test the component renders
test('renders the component with the right image', () => {
    renderComponent(step)
    const image = screen.getByRole('img', { name: /energy/i })
    expect(image).toBeInTheDocument()

})

//test that the title can be edited
test('the datafields pull in data correctly and  can be edited', async () => {

    const { user } = renderComponent(step)
    const title = getTitle()
    const detail = getDetail()
    expect(title).toHaveValue(step.title)
    expect(detail).toHaveValue(step.detail)
    await act(async () => await user.clear(title))
    await act(async () => await user.clear(detail))
    await act(async () => await user.type(title, 'New Title'))
    await act(async () => await user.type(detail, 'Something Else'))
    expect(title).toHaveValue('New Title')
    expect(detail).toHaveValue('Something Else')
})
