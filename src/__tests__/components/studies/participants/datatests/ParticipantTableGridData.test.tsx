import React from 'react'
import {
  render,
  cleanup,
  queryByAttribute,
  within,
  waitFor,
} from '@testing-library/react'
import ParticipantTableGrid from '../../../../../components/studies/participants/ParticipantTableGrid'
import {
  StringDictionary,
  ParticipantAccountSummary,
} from '../../../../../types/types'
import ParticipantService from '../../../../../services/participants.service'
import { UserSessionDataProvider } from '../../../../../helpers/AuthContext'
import server from '../../../../../_tests_server/handlers/server'
import userEvent from '@testing-library/user-event'
import {
  generateSampleParticipantGridData,
  checkTwoPartcipantArraysForEquality,
} from '../../../../../types/functions'

let currentPage = 1
let pageSize = 50
let totalParticipants: number
let currentParticipants: ParticipantAccountSummary[] = []

let participantTableGrid: Element
let forward_to_end_button: HTMLElement
let backward_one_page_button: HTMLElement

let timesPageSelectedMethodCalled = 0
let timesPageSizeMethodCalled = 0

type ParticipantData = {
  items: ParticipantAccountSummary[]
  total: number
}

beforeEach(async () => {
  timesPageSelectedMethodCalled = 0
  timesPageSizeMethodCalled = 0
  pageSize = 50
  currentParticipants = []
  currentPage = 1
  totalParticipants = 0
  server.listen()
  await updateParticpantsData()
  await renderParticipantTableGrid()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

const getById = queryByAttribute.bind(null, 'id')

// simulates a function that would usually be inside ParticipantManager
const onPageSelectedChanged = async (page: number) => {
  currentPage = page
  await updateParticpantsData()
  timesPageSelectedMethodCalled++
}

// simulates a function that would usually be inside ParticipantManager
const updatePageSize = async (newPageSize: number) => {
  pageSize = newPageSize
  await updateParticpantsData()
  timesPageSizeMethodCalled++
}

// render the ParticipantTableGrid component with the forward/backward
// buttons inside of it
const renderParticipantTableGrid = async () => {
  participantTableGrid = render(
    <UserSessionDataProvider>
      <ParticipantTableGrid
        rows={currentParticipants}
        status={'RESOLVED'}
        studyId={'mtb-user-testing'}
        totalParticipants={totalParticipants}
        isEdit={false}
        currentPage={currentPage}
        setCurrentPage={onPageSelectedChanged}
        enrollmentType={'ID'}
        onRowSelected={(/*id: string, isSelected: boolean*/ selection) => {}}
        pageSize={pageSize}
        setPageSize={updatePageSize}
        onWithdrawParticipant={(participantId: string, note: string) => {}}
        onUpdateParticipant={(
          participantId: string,
          notes: string,
          clinicVisitDate?: Date,
        ) => {}}
      ></ParticipantTableGrid>
      ,
    </UserSessionDataProvider>,
  ).container

  forward_to_end_button = getById(
    participantTableGrid as HTMLElement,
    'forward-to-end-button',
  )!
  backward_one_page_button = getById(
    participantTableGrid as HTMLElement,
    'back-one-page-button',
  )!
}

// update the participant data to reflect new changes
const updateParticpantsData = async () => {
  const data = await getParticipants(
    'mtb-user-testing',
    'CmsXOhf9AYnTV69gbX2ZWUyd', // replace this token with a valid one when you run the test
  )
  currentParticipants = data.items
  totalParticipants = data.total
}

// This simulates a function call that would usually be made in ParticipantManager,
// the parent component to ParticipantTableGrid. It updates the participant data based
// on the page size and current page.
async function getParticipants(
  studyId: string,
  token: string,
): Promise<ParticipantData> {
  const offset = (currentPage - 1) * pageSize
  const participants = await ParticipantService.getParticipants(
    studyId,
    token!,
    pageSize,
    offset,
  )
  const retrievedParticipants = participants ? participants.items : []
  const numberOfParticipants = participants ? participants.total : 0
  const eventsMap: StringDictionary<{
    clinicVisitDate: string
    joinedDate: string
  }> = await ParticipantService.getRelevantEventsForParticipans(
    studyId,
    token,
    retrievedParticipants.map(p => p.id),
  )
  const result = retrievedParticipants!.map(participant => {
    const id = participant.id as string
    const event = eventsMap[id]
    const updatedParticipant = {
      ...participant,
      clinicVisit: event.clinicVisitDate,
      dateJoined: event.joinedDate,
    }
    return updatedParticipant
  })
  return { items: result, total: numberOfParticipants }
}

// test to see if the inital data is correct
test('data fetched intially be accurate', async () => {
  const expectedElements = generateSampleParticipantGridData(50, 0)
  checkTwoPartcipantArraysForEquality(expectedElements, currentParticipants)
})

// check to see if changing the pages results in correct participants being fetched
test('data fetched correctly on page change', async () => {
  userEvent.click(forward_to_end_button)
  await waitFor(() => expect(timesPageSelectedMethodCalled).toBe(1))
  let expectedElements = generateSampleParticipantGridData(50, 50)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
  renderParticipantTableGrid()
  userEvent.click(backward_one_page_button)
  await waitFor(() => expect(timesPageSelectedMethodCalled).toBe(2))
  expectedElements = generateSampleParticipantGridData(50, 0)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
})

// check to see if changing the page size leads to the correct behavior
test('data fetched correctly on page size change', async () => {
  const textField = getById(
    participantTableGrid as HTMLElement,
    'page-selector',
  )
  const selectNode = textField?.parentNode?.querySelector('[role=button]')
  userEvent.click(selectNode!)
  const listbox = document.body.querySelector('ul[role=listbox]')
  const selectedItem = within(listbox as HTMLElement).getByText('25')
  userEvent.click(selectedItem)
  await waitFor(() => expect(timesPageSizeMethodCalled).toBe(1))
  let expectedElements = generateSampleParticipantGridData(25, 0)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
  renderParticipantTableGrid()
  // check to see if data is correct on the last page
  userEvent.click(forward_to_end_button)
  await waitFor(() => expect(timesPageSelectedMethodCalled).toBe(2))
  expectedElements = generateSampleParticipantGridData(25, 75)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
})

// test to see if pressing a page box will result in correct behavior
test('data fetched correctly on page box pressed', async () => {
  const pageBox = getById(
    participantTableGrid as HTMLElement,
    `pagebox-button-1`,
  )!
  userEvent.click(pageBox)
  await waitFor(() => expect(timesPageSelectedMethodCalled).toBe(1))
  const expectedElements = generateSampleParticipantGridData(50, 50)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
})
