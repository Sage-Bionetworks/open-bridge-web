import {
  cleanup,
  queryByAttribute,
  render,
  RenderResult,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ReactDOM from 'react-dom'
import PageSelector from '../../../../../components/studies/participants/PageSelector'
import ParticipantTablePagination from '../../../../../components/studies/participants/ParticipantTablePagination'

const getById = queryByAttribute.bind(null, 'id')

let participantTablePagination: RenderResult
let pageSelector: RenderResult

let forward_to_end_button: HTMLElement
let forward_one_page_button: HTMLElement
let backward_to_beginning_button: HTMLElement
let backward_one_page_button: HTMLElement

let currentPage = 1
let pageSize = 25
let numberOfPages = 4
let totalParticipants = 100

/*
    Simulated functions that are usually in parent components:
*/

/*
const onPageSelectedChanged = (page: number) => {
  currentPage = page
}*/

/*const handlePageNavigationArrowPressed = (type: string) => {
  if (type === 'F' && currentPage !== numberOfPages) {
    currentPage++
  } else if (type === 'FF' && currentPage !== numberOfPages) {
    currentPage = numberOfPages
  } else if (type === 'B' && currentPage !== 1) {
    currentPage--
  } else if (type === 'BB' && currentPage !== 1) {
    currentPage = 1
  }
}*/

/*const updatePageSize = (newPageSize: number) => {
  pageSize = newPageSize
  numberOfPages = Math.ceil(totalParticipants / newPageSize)
}*/
const updatePageSize = jest.fn()
const onPageSelectedChanged = jest.fn()
const handlePageNavigationArrowPressed = jest.fn()

/*
    Render Functions:
*/

// rerender the page selector and the forward/backward buttons inside of it
const renderPageSelector = () => {
  pageSelector = render(
    <PageSelector
      onPageSelected={onPageSelectedChanged}
      numberOfPages={numberOfPages}
      currentPageSelected={currentPage}
      handlePageNavigationArrowPressed={handlePageNavigationArrowPressed}
    ></PageSelector>,
  )
  forward_to_end_button = getById(
    pageSelector.container as HTMLElement,
    'forward-to-end-button',
  )!
  forward_one_page_button = getById(
    pageSelector.container as HTMLElement,
    'forward-one-page-button',
  )!
  backward_to_beginning_button = getById(
    pageSelector.container as HTMLElement,
    'back-to-beginning-button',
  )!
  backward_one_page_button = getById(
    pageSelector.container as HTMLElement,
    'back-one-page-button',
  )!
}

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
  renderPageSelector()
})

afterEach(() => cleanup())

afterAll(() => {
  participantTablePagination.unmount()
  pageSelector.unmount()
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
  /* const div2 = document.createElement('div')
  ReactDOM.render(
    <PageSelector
      onPageSelected={onPageSelectedChanged}
      numberOfPages={numberOfPages}
      currentPageSelected={currentPage}
      handlePageNavigationArrowPressed={handlePageNavigationArrowPressed}
    ></PageSelector>,
    div2,
  )*/
})

// test the functionality of the forward and back buttons for pagination
test('should page forward and backward buttons function correctly', () => {
  //we are on page 1
  // try to go back one page. nothing should happen
  userEvent.click(backward_one_page_button as HTMLElement)
  //expect(currentPage).toBe(1)
  expect(handlePageNavigationArrowPressed).not.toHaveBeenCalled()
  // go forward one page
  userEvent.click(forward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('F')
  //expect(currentPage).toBe(2)
  handlePageNavigationArrowPressed.mockReset()
  userEvent.click(backward_to_beginning_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).not.toHaveBeenCalled()
  handlePageNavigationArrowPressed.mockReset()
  resetVariables({ currentPage: 2 })
  renderPageSelector()
  // go back one page
  userEvent.click(backward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('B')
  //expect(currentPage).toBe(1)
  //renderPageSelector()
  // go to the last page
  userEvent.click(forward_to_end_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('FF')
  //expect(currentPage).toBe(numberOfPages)
  // renderPageSelector()
  //when you are on the last page  try to go to next page. nothing should happen
  resetVariables({ currentPage: 4 })
  renderPageSelector()
  handlePageNavigationArrowPressed.mockReset()
  userEvent.click(forward_one_page_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).not.toHaveBeenCalled()
  //expect(currentPage).toBe(numberOfPages)
  //renderPageSelector()
  // go back to the beginning page
  userEvent.click(backward_to_beginning_button as HTMLElement)
  expect(handlePageNavigationArrowPressed).toHaveBeenLastCalledWith('BB')
  // expect(currentPage).toBe(1)
  //renderPageSelector()
})

// test to see if the page changes as expected when page number is clicked
test('should page change when page number is clicked', () => {
  /*const x = pageSelector
  const pb = render(
    <PageBox
      isSelected={false}
      pageNumber={3}
      index={3}
      onPageSelected={onPageSelectedChanged}
    ></PageBox>,
  ).container
  const pageButton3 = getById(pb as HTMLElement, 'pagebox-button-3')
  */
  const btn = pageSelector.container.querySelector('#pagebox-button-3')
  expect(btn!.textContent).toBe("4")

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
  //This is what you care about. You don't test the parent function.
  //The parent function needs to be tested but it needs to be tested in the component it is in
  expect(updatePageSize).toHaveBeenCalledWith(50)
  //expect(pageSize).toBe(50)
  //expect(currentPage).toBe(1)

  //expect(numberOfPages).toBe(2)
})
