import {act, cleanup, render, RenderResult} from '@testing-library/react'
import AddQuestionMenu from './AddQuestionMenu'
import QUESTIONS from './QuestionConfigs'

let component: RenderResult

const onSelect = jest.fn()
afterEach(cleanup)
beforeEach(() => {
  component = render(
    <AddQuestionMenu onSelectQuestion={something => onSelect(something)} />
  )
})

test('renders question selector', async () => {
  let valSelectTextField = component!.container.querySelector(
    '#select-survey-question'
  ) as HTMLDivElement
  expect(valSelectTextField).toBeInTheDocument()
})

test('brings up the menu with question types to select', async () => {
  const button = component!.getByRole('button', {name: /select/i})
  act(() => {
    button.focus()
    button.click()
  })

  QUESTIONS.forEach(value => {
    var re = new RegExp(value.title)
    const item = component!.getByRole('menuitem', {name: re})
    expect(item).toBeInTheDocument()
  })
})

test('fires an appropriate call back when item is selected', async () => {
  const button = component.getByRole('button', {name: /select/i})
  const buttonAdd = component.getByRole('button', {name: /add/i})
  act(() => {
    button.focus()
    button.click()
  })

  component.debug(undefined, 30000000)
  const item = component.getByRole('menuitem', {name: /Free Text/i})

  act(() => {
    item.focus()
    item.click()
  })
  act(() => {
    buttonAdd.focus()
    buttonAdd.click()
  })

  expect(onSelect).toHaveBeenCalledWith('FREE_TEXT')
})
