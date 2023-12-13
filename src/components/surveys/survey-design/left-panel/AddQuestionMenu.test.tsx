import {cleanup, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddQuestionMenu from './AddQuestionMenu'
import QUESTIONS from './QuestionConfigs'

function setUp() {
  const user = userEvent.setup()
  const component = render(<AddQuestionMenu onSelectQuestion={something => onSelect(something)} />)

  const selectBtn = component!.getByRole('button', {name: /select/i})
  return {user, component, selectBtn}
}

const onSelect = jest.fn()
afterEach(cleanup)

test('renders question selector', async () => {
  const {component} = setUp()

  let valSelectTextField = component!.container.querySelector('#select-survey-question') as HTMLDivElement
  expect(valSelectTextField).toBeInTheDocument()
})

test('brings up the menu with question types to select', async () => {
  const {user, component, selectBtn} = setUp()
  await user.click(selectBtn)

  QUESTIONS.forEach(value => {
    var re = new RegExp(value.title)
    const def = value.default as any
    if (def.type! === 'overview' && def.type !== 'overview') {
      const item = component!.getByRole('menuitem', {name: re})
      expect(item).toBeInTheDocument()
    }
  })
})

test('fires an appropriate call back when item is selected', async () => {
  const {user, component, selectBtn} = setUp()

  const buttonAdd = component.getByRole('button', {name: /add/i})
  await user.click(selectBtn)
  const item = component.getByRole('menuitem', {name: /Free Text/i})
  await user.click(item)
  await user.click(buttonAdd)

  expect(onSelect).toHaveBeenCalledWith('FREE_TEXT')
})
