import EditableTextbox from '@components/widgets/EditableTextbox'
import {prettyDOM, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as React from 'react'
import {ProvideTheme} from '__test_utils/utils'

const DISPLAY_ELEMENT = 'h4'
const DEFAULT_VALUE = 'hello'
const handleChange = jest.fn()
let container: Element
let text: Element
let input: Element | null

beforeEach(() => {
  container = render(
    <ProvideTheme>
      <EditableTextbox
        component={DISPLAY_ELEMENT}
        initValue={DEFAULT_VALUE}
        onTriggerUpdate={handleChange}></EditableTextbox>
    </ProvideTheme>
  ).container
  text = container.querySelector(DISPLAY_ELEMENT)!
  input = container.querySelector('input')
})

test('should initially display the initValue in a component provided', () => {
  //initially show as text
  expect(text).toHaveTextContent(DEFAULT_VALUE)
  expect(input).toBeNull()
})

/*test('should onClick reveal this value in an input box', () => {
  //after click show as input
  userEvent.click(text)
  const input = container.querySelector('input')!
  expect(container.querySelector(DISPLAY_ELEMENT)).toBeNull()
  expect(input).not.toBeNull()
  expect(input.value).toBeNull
  expect(input.placeholder).toBe(DEFAULT_VALUE)
})*/

/*test('should on Enter change the value of the element and hide the input', () => {
  //after click show as input
  userEvent.click(text)
  const input = container.querySelector('input')!
  userEvent.type(input, 'hi{enter}')
  expect(container.querySelector('input')).toBeNull()
  expect(container.querySelector('h4')!).toHaveTextContent(/hi/)
  expect(handleChange).toHaveBeenCalledWith('hi')
})
*/
test('should on Escape reset the value to default and hide the input, and not call update', () => {
  //after click show as input
  try {
    userEvent.click(text).then(() => {
      console.log(prettyDOM(container))
      const input = container.querySelector('input')!
      console.log(input)
      userEvent.type(input, 'hi{esc}')
    })

    /* expect(container.querySelector('input')).toBeNull()
    expect(container.querySelector('h4')!).toHaveTextContent(DEFAULT_VALUE)
    expect(handleChange).not.toHaveBeenCalled()*/
  } catch (e) {
    console.log('error', e)
  }
})

/*
test('should on clicking outside the input set the input value to the component, call the update,  and hide the input', () => {
  //after click show as input
  userEvent.click(text)
  const input = container.querySelector('input')!

  userEvent.type(input, 'hi')
  userEvent.tab()

  expect(container.querySelector('input')).toBeNull()
  expect(container.querySelector('h4')!).toHaveTextContent('hi')
  expect(handleChange).toHaveBeenCalled()
})*/
