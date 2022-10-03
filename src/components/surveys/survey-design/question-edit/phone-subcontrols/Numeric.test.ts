import { act, screen } from '@testing-library/react'
import { NumericQuestion } from '@typedefs/surveys'
import { renderSurveyQuestionComponent } from '__test_utils/utils'
import Numeric from './Numeric'


//render the component
const renderComponent = (step: NumericQuestion) => {
    return renderSurveyQuestionComponent<NumericQuestion>({ step, Component: Numeric })
}

const getLabelField = () => screen.getByRole('textbox')


//mock the props
const step: NumericQuestion = {

    "type": "simpleQuestion",
    "identifier": "simpleQ3",
    "title": "How many times did you wake up for 5 minutes or longer?",
    "uiHint": "textfield",
    "inputItem": {
        "type": "integer",
    }
}

//test the component renders without field label
test('renders the component without label', () => {
    renderComponent(step)
    const labelField = getLabelField()
    expect(labelField).toBeInTheDocument()
    expect(labelField).toHaveProperty('placeholder', 'Field Label')
    expect(screen.getByPlaceholderText('Field Label', { exact: false })).toBeInTheDocument()
})
//test the component renders with field label
test('renders the component with label', () => {
    renderComponent({ ...step, inputItem: { fieldLabel: 'Some Label', type: 'integer' } })
    const labelField = getLabelField()

    expect(labelField).toHaveValue('Some Label')
})

//test that the field label can be editied
test('the title can be edited', async () => {
    const { user } = renderComponent(step)
    const labelField = getLabelField()
    await act(async () => await user.clear(labelField))
    await act(async () => await user.type(labelField, 'New Label'))
    expect(labelField).toHaveValue('New Label')
})

