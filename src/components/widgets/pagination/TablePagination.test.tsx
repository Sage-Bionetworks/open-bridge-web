import TablePagination from '@components/widgets/pagination/TablePagination'
import {act, cleanup, queryByAttribute, render, RenderResult, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {ProvideTheme} from '__test_utils/utils'

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
    <ProvideTheme>
      <TablePagination
        setPageSize={updatePageSize}
        totalItems={totalParticipants}
        currentPage={currentPage}
        pageSize={pageSize}
        counterTextSingular="participants"
        onPageSelectedChanged={onPageSelectedChanged}></TablePagination>
    </ProvideTheme>
  )
  forward_to_end_button = getById(participantTablePagination.container as HTMLElement, 'forward-to-end-button')!
  forward_one_page_button = getById(participantTablePagination.container as HTMLElement, 'forward-one-page-button')!
  backward_to_beginning_button = getById(
    participantTablePagination.container as HTMLElement,
    'back-to-beginning-button'
  )!
  backward_one_page_button = getById(participantTablePagination.container as HTMLElement, 'back-one-page-button')!
}

// reset the variables
const resetVariables = (options: {
  currentPage?: number
  pageSize?: number
  numberOfPages?: number
  totalParticipants?: number
}) => {
  ;({currentPage = 0, pageSize = 25, numberOfPages = 4, totalParticipants = 100} = options)
}

beforeEach(() => {
  resetVariables({})
  renderParticipantTableGrid()
})

afterEach(() => cleanup())

afterAll(() => {
  participantTablePagination?.unmount()
  cleanup()
})

/*
    Tests:
*/

// tests to see if the components are rendering without crashing

// test the functionality of the forward and back buttons for pagination
test('should page forward and backward buttons function correctly', async () => {
  const user = userEvent.setup()
  // try to go back one page. nothing should happen
  expect(backward_one_page_button).toBeDisabled()
  // go forward one page
  await act(async () => await user.click(forward_one_page_button as HTMLElement))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(1)
  onPageSelectedChanged.mockReset()

  expect(backward_to_beginning_button).toBeDisabled()
  onPageSelectedChanged.mockReset()
  resetVariables({currentPage: 2})
  renderParticipantTableGrid()
  // go back one page
  await act(async () => await user.click(backward_one_page_button as HTMLElement))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(1)
  // go to the last page
  await act(async () => await user.click(forward_to_end_button as HTMLElement))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(3)
  //when you are on the last page  try to go to next page. nothing should happen
  resetVariables({currentPage: 3})
  renderParticipantTableGrid()
  onPageSelectedChanged.mockReset()

  expect(forward_one_page_button).toBeDisabled()
  await act(async () => await user.click(backward_to_beginning_button as HTMLElement))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(0)
})

// test to see if the page changes as expected when page number is clicked
test('should page change when page number is clicked', async () => {
  const user = userEvent.setup()
  const btn = participantTablePagination.container.querySelector('#pagebox-button-3')
  expect(btn!.textContent).toBe('4')
  await act(async () => await act(async () => await user.click(btn!)))

  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(3)
})

// test to see if changing the page size results in correct behavior
test('should changing page size result in correct behavior', async () => {
  const user = userEvent.setup()
  const textField = getById(participantTablePagination.container as HTMLElement, 'page-selector')
  const selectNode = textField?.parentNode?.querySelector('[role=button]')

  await act(async () => await user.click(selectNode!))
  const listbox = document.body.querySelector('ul[role=listbox]')
  const selectedItem = within(listbox as HTMLElement).getByText('50')
  await act(async () => await user.click(selectedItem))
  expect(updatePageSize).toHaveBeenCalledWith(50)
})
