//unit tests for ./Completion.tsx using react-testing-library
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Completion from './Completion'


//render the component
const renderComponent = (props: any) => {
    const user = userEvent.setup()
    const element = render(<Completion {...props} />)
    return { user, element }
}

const getTitle = () => screen.getByDisplayValue(mockProps.step.title)
const getDetail = () => screen.getByDisplayValue(mockProps.step.detail)

//mock the props
const mockProps = {
    step: {
        type: 'completion',
        identifier: 'completion',
        title: 'Completion',
        detail: 'Thank you for completing the survey.',
        image: {
            type: 'sageResource',
            imageName: 'survey',
        },
    },
    onChange: jest.fn(),
}

//test the component renders
test('renders the component', () => {
    renderComponent(mockProps)

    expect(getTitle()).toBeInTheDocument()

    expect(getDetail()).toBeInTheDocument()
})
//test that the title can be edited
test('the title can be edited', async () => {

    const { user } = renderComponent(mockProps)
    const title = getTitle()
    await act(async () => await user.type(title, 'New Title'))
    expect(mockProps.onChange).toHaveBeenCalledTimes('New Title'.length)
})
//test that the detail can be edited
test('the detail can be edited', async () => {
    const { user } = renderComponent(mockProps)
    const detail = getDetail()
    await act(async () => await userEvent.type(detail, 'New Details'))
    expect(mockProps.onChange).toHaveBeenCalledTimes('New Details'.length)
})


