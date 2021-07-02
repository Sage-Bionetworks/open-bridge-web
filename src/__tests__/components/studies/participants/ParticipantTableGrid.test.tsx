import {cleanup, queryByAttribute, render, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ParticipantTableGrid from '../../../../components/studies/participants/ParticipantTableGrid'
import {UserSessionDataProvider} from '../../../../helpers/AuthContext'
import {
  ParticipantAccountSummary,
  ParticipantActivityType,
} from '../../../../types/types'

let currentPage = 1
let pageSize = 25
let numberOfPages = 4
let status: string
let currentParticipants: ParticipantAccountSummary[]

let participantTableGrid: Element
let forward_to_end_button: HTMLElement
let backward_one_page_button: HTMLElement
let forward_one_page_button: HTMLElement
let backward_to_beginning_button: HTMLElement

// reset the variables
const resetVariables = (options: {
  currentPage?: number
  pageSize?: number
  numberOfPages?: number
  totalParticipants?: number
  status?: string
  currentParticipants?: ParticipantAccountSummary[]
}) => {
  ;({
    currentPage = 1,
    pageSize = 25,
    numberOfPages = 4,
    status = 'RESOLVED',
    currentParticipants = generateSampleParticipantGridData(50, 0),
  } = options)
}

beforeEach(async () => {
  resetVariables({})
  renderParticipantTableGrid()
})

afterEach(() => {
  cleanup()
})

const getById = queryByAttribute.bind(null, 'id')

const onPageSelectedChanged = jest.fn()
const updatePageSize = jest.fn()

const generateSampleParticipantGridData = (total: number, offsetBy: number) => {
  const expectedData = []
  for (let i = offsetBy + 1; i <= total + offsetBy; i++) {
    let obj: ParticipantAccountSummary = {
      createdOn: '2021-02-22T20:45:38.375Z',
      externalIds: {testID: `test-id-${i}`},
      id: 'dRNO0ydUO3hAGD5rHOXx1Gmb' + i,
      status: 'unverified',
      firstName: '',
      lastName: '',
      email: '',
    }
    expectedData.push(obj)
  }
  return expectedData
}
// render the ParticipantTableGrid component with the forward/backward
// buttons inside of it
const renderParticipantTableGrid = async () => {
  participantTableGrid = render(
    <UserSessionDataProvider>
      <ParticipantTableGrid
        rows={currentParticipants}
        status={status as 'PENDING' | 'RESOLVED' | 'IDLE'}
        studyId={'mtb-user-testing'}
        totalParticipants={100}
        isAllSelected={false}
        selectedParticipantIds={[]}
        //isEdit={false}
        isEnrolledById={true}
        onRowSelected={(/*id: string, isSelected: boolean*/ selection) => {}}
        onWithdrawParticipant={(participantId: string, note: string) => {}}
        onUpdateParticipant={(
          participantId: string,
          note: string,
          clinicVisitDate?: Date
        ) => {}}
        gridType={{} as ParticipantActivityType}>
        <></>
      </ParticipantTableGrid>
      ,
    </UserSessionDataProvider>
  ).container

  forward_to_end_button = getById(
    participantTableGrid as HTMLElement,
    'forward-to-end-button'
  )!
  backward_one_page_button = getById(
    participantTableGrid as HTMLElement,
    'back-one-page-button'
  )!
  forward_one_page_button = getById(
    participantTableGrid as HTMLElement,
    'forward-one-page-button'
  )!
  backward_to_beginning_button = getById(
    participantTableGrid as HTMLElement,
    'back-to-beginning-button'
  )!
}

test('should render correctly', () => {
  const textField = getById(
    participantTableGrid as HTMLElement,
    'page-selector'
  )
  expect(textField?.textContent).toBe('25')
  expect(
    getById(participantTableGrid as HTMLElement, 'pagebox-button-0')
  ).not.toEqual(null)
  expect(
    getById(participantTableGrid as HTMLElement, 'pagebox-button-1')
  ).not.toEqual(null)
  expect(
    getById(participantTableGrid as HTMLElement, 'pagebox-button-2')
  ).not.toEqual(null)
  expect(
    getById(participantTableGrid as HTMLElement, 'pagebox-button-3')
  ).not.toEqual(null)
  const participantCountData = getById(
    participantTableGrid as HTMLElement,
    'participant_page_data'
  )
  expect(participantCountData?.textContent).toBe('25/100 participants')
})

// check to see if changing the pages results in correct data being passed
test('data passed appropriately to onPageSelectedChanged method', async () => {
  userEvent.click(forward_to_end_button)
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(numberOfPages)
  resetVariables({currentPage: numberOfPages})
  renderParticipantTableGrid()
  userEvent.click(backward_one_page_button)
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(numberOfPages - 1)
  resetVariables({currentPage: numberOfPages - 1})
  renderParticipantTableGrid()
  userEvent.click(backward_to_beginning_button)
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(1)
  resetVariables({currentPage: 1})
  renderParticipantTableGrid()
  userEvent.click(forward_one_page_button)
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(2)
  onPageSelectedChanged.mockReset()
  resetVariables({currentPage: 1})
  renderParticipantTableGrid()
  userEvent.click(backward_one_page_button)
  expect(onPageSelectedChanged).not.toHaveBeenCalled()
})

// test to see if pressing a page box will result in correct behavior
test('data passed correctly on page box pressed', async () => {
  const textField = getById(
    participantTableGrid as HTMLElement,
    'page-selector'
  )
  const selectNode = textField?.parentNode?.querySelector('[role=button]')
  userEvent.click(selectNode!)
  const listbox = document.body.querySelector('ul[role=listbox]')
  const selectedItem50 = within(listbox as HTMLElement).getByText('50')
  userEvent.click(selectedItem50)
  expect(updatePageSize).toHaveBeenLastCalledWith(50)
  const selectedItem100 = within(listbox as HTMLElement).getByText('100')
  userEvent.click(selectedItem100)
  expect(updatePageSize).toHaveBeenLastCalledWith(100)
})

test('data is passed correctly on page box click', () => {
  const pageBox = getById(
    participantTableGrid as HTMLElement,
    `pagebox-button-1`
  )!
  userEvent.click(pageBox)
  expect(onPageSelectedChanged).toHaveBeenLastCalledWith(2)
})

// test to see if the loading status appears when the status is pending
test('should loading status appear when status is PENDING', () => {
  resetVariables({status: 'PENDING', currentParticipants: []})
  renderParticipantTableGrid()
  expect(
    getById(participantTableGrid as HTMLElement, 'circular_progress')
  ).not.toEqual(null)
})
