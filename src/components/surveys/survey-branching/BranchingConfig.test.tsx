//unit tests for BranchingConfig.tsx
import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {Step} from '@typedefs/surveys'
import {act} from 'react-dom/test-utils'
import SurveyQuestions from '__test_utils/mocks/surveyQuestions'
import {ProvideTheme} from '__test_utils/utils'
import BranchingConfig from './BranchingConfig'

const onMock = jest.fn()
//render the component
export const renderComponent = (step: any) => {
  const user = userEvent.setup()
  const element = render(
    <ProvideTheme>
      <BranchingConfig
        step={step}
        isOpen={true}
        isReadOnly={false}
        questions={SurveyQuestions}
        invalidTargetStepIds={[]}
        onCancel={() => onMock('cancel')}
        onSave={() => onMock('save')}
        onChange={(questions: Step[]) => onMock(questions)}
      />
    </ProvideTheme>
  )

  return {user, element}
}

const radioNext = () => screen.getByRole('radio', {name: /go to next screen in sequence/i})
const radioSkip = () => screen.getByRole('radio', {name: /skip to/i})

const questionType = () => screen.getByRole('button', {name: /question type:/i})
//screen.getByRole('option', { name: /3/i })

//mock the props
const step = {
  type: 'choiceQuestion',
  identifier: 'favoriteFood',
  title: 'What are you having for dinner next Tuesday after the soccer game?',
  subtitle: 'After thinking it over...',
  detail:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  surveyRules: [
    {
      matchingAnswer: 'Pizza',
      skipToIdentifier: 'multipleChoice',
    },
  ],
  baseType: 'string',
  singleChoice: true,
  choices: [
    {
      value: 'Pizza',
      text: 'Pizza',
    },
    {
      value: 'Sushi',
      text: 'Sushi',
    },
    {
      value: 'Ice Cream',
      text: 'Ice Cream',
    },
    {
      value: 'Beans & Rice',
      text: 'Beans & Rice',
    },
    {
      value: 'Tofu Tacos',
      text: 'Tofu Tacos',
    },
    {
      value: 'Bucatini Alla Carbonara',
      text: 'Bucatini Alla Carbonara',
    },
    {
      value: 'Hot Dogs, Kraft Dinner & Potato Salad',
      text: 'Hot Dogs, Kraft Dinner & Potato Salad',
    },
  ],
  other: {
    type: 'string',
  },
}

describe('BranchingConfig', () => {
  it('should render with correct options', async () => {
    const {user} = renderComponent(step)
    for (let choice of step.choices) {
      expect(screen.getByText(choice.text)).toBeInTheDocument()
    }
    const bRow = screen.getByText(/Pizza/i).closest('tr')

    var dropdown = within(bRow!).getByRole('button', {name: /question type:/i})
    expect(dropdown).toBeInTheDocument()
    await act(async () => await user.click(dropdown))
    const option = within(dropdown).getByText(/11/)
    expect(option).toBeInTheDocument()
  })

  it('should set nextStepIdentifier if checkbox is selected', async () => {
    const {user} = renderComponent(step)

    const rSkip = radioSkip()
    const rNext = radioNext()
    expect(rSkip).toBeInTheDocument()
    expect(rNext).toHaveAttribute('checked')
    await act(async () => await user.click(rSkip))
    const arg = onMock.mock.calls[0][0]
    const q = arg.find((s: {identifier: string}) => s.identifier === step.identifier)
    expect(onMock.mock.calls.length).toBe(1)
    expect(q.nextStepIdentifier).toBeDefined()
  })

  it('should render', async () => {
    const {user} = renderComponent({...step, nextStepIdentifier: 'multipleChoice'})
    const rSkip = radioSkip()
    const rNext = radioNext()
    expect(rSkip).toHaveAttribute('checked')
    await act(async () => await user.click(rNext))
    let arg = onMock.mock.calls[0][0]
    let q = arg.find((s: {identifier: string}) => s.identifier === step.identifier)
    expect(onMock.mock.calls.length).toBe(1)
    expect(q.nextStepIdentifier).not.toBeDefined()
  })
})
