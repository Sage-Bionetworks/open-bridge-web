import {cleanup, render, RenderResult} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
  userEvent.click(button)

  QUESTIONS.forEach(value => {
    var re = new RegExp(value.title)
    const item = component!.getByRole('menuitem', {name: re})
    expect(item).toBeInTheDocument()
  })
})

test('fires an appropriate call back when item is selected', async () => {
  const button = component.getByRole('button', {name: /select/i})
  const buttonAdd = component.getByRole('button', {name: /add/i})
  userEvent.click(button)

  const item = component.getByRole('menuitem', {name: /Free Text/i})
  userEvent.click(item)
  userEvent.click(buttonAdd)

  expect(onSelect).toHaveBeenCalledWith('FREE_TEXT')
})
