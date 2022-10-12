import RequiredToggle from '@components/surveys/survey-design/question-edit/RequiredToggle'
import {cleanup, fireEvent, render} from '@testing-library/react'
import {ActionButtonName} from '@typedefs/surveys'

afterEach(cleanup)
const onChange = jest.fn()

function renderControl(actArray: ActionButtonName[] = ['goForward']) {
  return render(<RequiredToggle shouldHideActionsArray={actArray} onChange={onChange} />)
}

test('"allow" should be selected if "skip" is NOT in hidden actions, and clicking it have no effect', () => {
  const render = renderControl()
  let button = render.getByRole('button', {name: /allow skip/i})
  expect(Array.from(button.classList.values())).toContain('Mui-selected')
  fireEvent.click(button)
  expect(onChange).not.toHaveBeenCalled()
})

test('"allow" should NOT be selected if "skip" is IN  hidden actions, and clicking it have no effect', () => {
  const render = renderControl(['goForward', 'skip'])
  let allowButton = render.getByRole('button', {name: /allow skip/i})
  expect(Array.from(allowButton.classList.values())).not.toContain('Mui-selected')
  let requireButton = render.getByRole('button', {name: /require/i})
  expect(Array.from(requireButton.classList.values())).toContain('Mui-selected')

  fireEvent.click(allowButton)
  expect(onChange).toHaveBeenCalled()
})

test('when select "require" the argument array will contain skip', () => {
  const render = renderControl(['goForward', 'skip'])
  let button = render.getByRole('button', {name: /allow skip/i})
  fireEvent.click(button)
  expect(onChange).toHaveBeenLastCalledWith(['goForward'])
})

test('when select "allow" the argument array will not contain skip', () => {
  const render = renderControl([])
  let button = render.getByRole('button', {name: /require/i})

  fireEvent.click(button)
  expect(onChange).toHaveBeenCalledWith(['skip'])
})
