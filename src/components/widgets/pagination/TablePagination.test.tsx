import TablePagination from '@components/widgets/pagination/TablePagination'
import {act, cleanup, queryByAttribute, render, RenderResult, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {createWrapper} from '__test_utils/utils'

const getById = queryByAttribute.bind(null, 'id')

let participantTablePagination: RenderResult

let currentPage = 0
let pageSize = 25
let totalParticipants = 100
let buttons: HTMLElement[]

const updatePageSize = jest.fn()
const onPageSelectedChanged = jest.fn()

// rerender the table pagination component
const renderParticipantTableGrid = () => {
  participantTablePagination = render(
    <TablePagination
      setPageSize={updatePageSize}
      totalItems={totalParticipants}
      currentPage={currentPage}
      pageSize={pageSize}
      counterTextSingular="participants"
      onPageSelectedChanged={onPageSelectedChanged}></TablePagination>,
    {wrapper: createWrapper()}
  )
  buttons = screen.getAllByRole('button')
}

beforeEach(() => {
  renderParticipantTableGrid()
})

afterEach(() => cleanup())

afterAll(() => {
  participantTablePagination?.unmount()
  cleanup()
})

// test the functionality of the button navigation for pagination
test('should page forward and backward buttons function correctly', async () => {
  const user = userEvent.setup()
  // const buttons = screen.getAllByRole('button')
  //should be 6 relevant buttons < 1234>
  // try to go back one page. nothing should happen
  expect(buttons[0]).toBeDisabled()
  // go forward two pages
  await act(async () => await user.click(buttons[3]))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(2)
  onPageSelectedChanged.mockReset()

  // go back one page
  await act(async () => await user.click(buttons[2] as HTMLElement))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(1)

  // go to the last page
  onPageSelectedChanged.mockReset()
  await act(async () => await user.click(buttons[4] as HTMLElement))
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(3)

  //navigate from the last page
  onPageSelectedChanged.mockReset()

  await act(async () => await user.click(buttons[1] as HTMLElement))

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
  const selectedItem = within(listbox as HTMLElement).getByText('50 per page')
  await act(async () => await user.click(selectedItem))
  expect(updatePageSize).toHaveBeenCalledWith(50)
})
