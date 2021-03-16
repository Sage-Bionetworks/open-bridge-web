import {
  cleanup,
  queryByAttribute,
  render,
  RenderResult,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ReactDOM from 'react-dom'
import ParticipantTablePagination from '../../../../components/studies/participants/ParticipantTablePagination'

const getById = queryByAttribute.bind(null, 'id')

let participantTablePagination: RenderResult

let forward_to_end_button: HTMLElement
let forward_one_page_button: HTMLElement
let backward_to_beginning_button: HTMLElement
let backward_one_page_button: HTMLElement

let currentPage = 1
let pageSize = 25
let numberOfPages = 4
let totalParticipants = 100

const updatePageSize = jest.fn()
const onPageSelectedChanged = jest.fn()
const handlePageNavigationArrowPressed = jest.fn()

// rerender the table pagination component
const renderParticipantTableGrid = () => {
  participantTablePagination = render(
    <ParticipantTablePagination
      setPageSize={updatePageSize}
      totalParticipants={totalParticipants}
      currentPage={currentPage}
      pageSize={pageSize}
      numberOfPages={numberOfPages}
      onPageSelectedChanged={onPageSelectedChanged}
      handlePageNavigationArrowPressed={handlePageNavigationArrowPressed}
    ></ParticipantTablePagination>,
  )
  forward_to_end_button = getById(
    participantTablePagination.container as HTMLElement,
    'forward-to-end-button',
  )!
  forward_one_page_button = getById(
    participantTablePagination.container as HTMLElement,
    'forward-one-page-button',
  )!
  backward_to_beginning_button = getById(
    participantTablePagination.container as HTMLElement,
    'back-to-beginning-button',
  )!
  backward_one_page_button = getById(
    participantTablePagination.container as HTMLElement,
    'back-one-page-button',
  )!
}

// reset the variables
const resetVariables = (options: {
  currentPage?: number
  pageSize?: number
  numberOfPages?: number
  totalParticipants?: number
}) => {
  ;({
    currentPage = 1,
    pageSize = 25,
    numberOfPages = 4,
    totalParticipants = 100,
  } = options)
}

beforeEach(() => {
  resetVariables({})
  renderParticipantTableGrid()
})

afterEach(() => cleanup())

afterAll(() => {
  participantTablePagination.unmount()
  cleanup()
})

/*
    Tests:
*/

// tests to see if the components are rendering without crashing
test('should be rendering without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(
    <ParticipantTablePagination
      setPageSize={updatePageSize}
      totalParticipants={totalParticipants}
      currentPage={currentPage}
      pageSize={pageSize}
      numberOfPages={numberOfPages}
      onPageSelectedChanged={onPageSelectedChanged}
      handlePageNavigationArrowPressed={handlePageNavigationArrowPressed}
    ></ParticipantTablePagination>,
    div,
  )
})

// test the functionality of the forward and back buttons for pagination
test('should page forward and backward buttons function correctly', () => {
  // try to go back one page. nothing should happen
  userEvent.click(backward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).not.toHaveBeenCalled()
  // go forward one page
  userEvent.click(forward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('F')
  handlePageNavigationArrowPressed.mockReset()
  userEvent.click(backward_to_beginning_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).not.toHaveBeenCalled()
  handlePageNavigationArrowPressed.mockReset()
  resetVariables({ currentPage: 2 })
  renderParticipantTableGrid()
  // go back one page
  userEvent.click(backward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('B')
  // go to the last page
  userEvent.click(forward_to_end_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('FF')
  //when you are on the last page  try to go to next page. nothing should happen
  resetVariables({ currentPage: 4 })
  renderParticipantTableGrid()
  handlePageNavigationArrowPressed.mockReset()
  userEvent.click(forward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).not.toHaveBeenCalled()
  userEvent.click(backward_to_beginning_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('BB')
})

// test to see if the page changes as expected when page number is clicked
test('should page change when page number is clicked', () => {
  const btn = participantTablePagination.container.querySelector(
    '#pagebox-button-3',
  )
  expect(btn!.textContent).toBe('4')
  userEvent.click(btn!)
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(4)
})

// test to see if changing the page size results in correct behavior
test('should changing page size result in correct behavior', () => {
  const textField = getById(
    participantTablePagination.container as HTMLElement,
    'page-selector',
  )
  const selectNode = textField?.parentNode?.querySelector('[role=button]')
  userEvent.click(selectNode!)
  const listbox = document.body.querySelector('ul[role=listbox]')
  const selectedItem = within(listbox as HTMLElement).getByText('50')
  userEvent.click(selectedItem)
  expect(updatePageSize).toHaveBeenCalledWith(50)
})
