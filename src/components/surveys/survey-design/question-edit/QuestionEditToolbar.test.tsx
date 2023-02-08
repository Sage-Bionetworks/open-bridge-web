import {act, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ProvideTheme} from '__test_utils/utils'
import QuestionEditToolbar from './QuestionEditToolbar'

const onChange = jest.fn()

const renderComponent = (isDynamic: boolean, dependentQuestions: number[]) => {
  const component = render(
    <ProvideTheme>
      <QuestionEditToolbar isDynamic={isDynamic} dependentQuestions={dependentQuestions} onAction={x => onChange(x)} />
    </ProvideTheme>
  )
  const user = userEvent.setup()
  return {user, component}
}

const getSaveButton = (isStrict?: boolean) =>
  isStrict ? screen.getByRole('button', {name: /save/i}) : screen.queryByRole('button', {name: /save/i})
const getDeleteButton = (isStrict?: boolean) =>
  isStrict ? screen.getByRole('button', {name: /delete/i}) : screen.queryByRole('button', {name: /delete/i})
const getDuplicateButton = (isStrict?: boolean) =>
  isStrict ? screen.getByRole('button', {name: /duplicate/i}) : screen.queryByRole('button', {name: /duplicate/i})

describe('Correct Rendering', () => {
  it('should render with correct buttons for dynamic questions', async () => {
    const {user} = renderComponent(true, [])
    expect(getSaveButton()).toBeInTheDocument()
    expect(getDeleteButton()).toBeInTheDocument()
    expect(getDuplicateButton()).toBeInTheDocument()
  })

  it('should render with correct buttons for static questions', async () => {
    const {user} = renderComponent(false, [])
    expect(getSaveButton()).toBeInTheDocument()
    expect(getDeleteButton()).not.toBeInTheDocument()
    expect(getDuplicateButton()).not.toBeInTheDocument()
  })
})

describe('Correct button actions', () => {
  it("should have working 'save' button", async () => {
    const {user} = renderComponent(true, [])

    await act(async () => {
      await userEvent.click(getSaveButton(true)!)
    })
    expect(onChange).toHaveBeenCalledWith('save')
  })

  it("should have working 'duplicate' button", async () => {
    const {user} = renderComponent(true, [])
    await act(async () => {
      await userEvent.click(getDuplicateButton(true)!)
    })
    expect(onChange).toHaveBeenCalledWith('duplicate')
  })
})

describe('Delete Button', () => {
  it("should not call onChange when 'delete' button is clicked. But should bring up warning modal if no dependednt question", async () => {
    const {user} = renderComponent(true, [])
    expect(screen.queryByText(/permanently delete this question/)).not.toBeInTheDocument()
    await act(async () => {
      await userEvent.click(getDeleteButton(true)!)
    })
    expect(screen.queryByText(/permanently delete this question/)).toBeInTheDocument()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should be disabled if there are dependent questions', async () => {
    const {user} = renderComponent(true, [3])
    expect(getDeleteButton(true)).toBeDisabled()
  })
})
