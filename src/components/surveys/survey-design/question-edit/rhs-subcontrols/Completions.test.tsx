//unit tests for ./Completion.tsx using react-testing-library


import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Completion from './Completion'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        id: 'survey_12345'
    })
}))
//render the component
const renderComponent = (props: any) => {
    const user = userEvent.setup()
    const element = render(
        <MemoryRouter>
            <Completion {...props} />
        </MemoryRouter>)
    return { user, element }
}

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

test('has the link to branching', async () => {
    const { user, element } = renderComponent(mockProps)
    element.debug()
    const link = screen.getByRole('link')
    expect(link.getAttribute('href')).toBe('/surveys/survey_12345/branching')
})