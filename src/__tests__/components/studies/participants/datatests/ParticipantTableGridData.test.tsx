import React from 'react'
import {
  render,
  cleanup,
  queryByAttribute,
  within,
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

let currentPage = 1
let pageSize = 50
let numberOfPages = 2
let totalParticipants = 100
let currentParticipants: ParticipantAccountSummary[] = []
let participantTableGrid: Element

let forward_to_end_button: HTMLElement
let forward_one_page_button: HTMLElement
let backward_one_page_button: HTMLElement
let backtoBeginningButton: HTMLElement

type ParticipantData = {
  items: ParticipantAccountSummary[]
  total: number
}

const getById = queryByAttribute.bind(null, 'id')

const generateRandomParticipantData = (
  amount: number,
  offsetBy: number,
): ParticipantAccountSummary[] => {
  const expectedData = []
  for (let i = offsetBy + 1; i <= amount + offsetBy; i++) {
    let obj: ParticipantAccountSummary = {
      createdOn: '2021-02-22T20:45:38.375Z',
      externalIds: { kkynty35udejidtdp8h: `test-id-${i}` },
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

// simulates a function that would usually be inside ParticipantManager
const onPageSelectedChanged = async (page: number) => {
  // console.log('updated current page')
  currentPage = page
  await renderParticipantTableGrid()
}

// simulates a function that would usually be inside ParticipantManager
const updatePageSize = (newPageSize: number) => {
  pageSize = newPageSize
  numberOfPages = Math.ceil(totalParticipants / newPageSize)
  renderParticipantTableGrid()
}

// render the ParticipantTableGrid component with the forward/backward
// buttons inside of it
const renderParticipantTableGrid = async () => {
  await updateParticpantsData()
  participantTableGrid = render(
    <UserSessionDataProvider>
      <ParticipantTableGrid
        rows={currentParticipants}
        status={'RESOLVED'}
        studyId={'mtb-user-testing'}
        totalParticipants={currentParticipants.length}
        isEdit={false}
        onUpdate={() => {}}
        currentPage={currentPage}
        setCurrentPage={onPageSelectedChanged}
        enrollmentType={'ID'}
        onRowSelected={(/*id: string, isSelected: boolean*/ selection) => {}}
        pageSize={pageSize}
        setPageSize={updatePageSize}
        isPhoneEnrollmentType={false}
      ></ParticipantTableGrid>
      ,
    </UserSessionDataProvider>,
  ).container

  backtoBeginningButton = getById(
    participantTableGrid as HTMLElement,
    'back-to-beginning-button',
  )!

  forward_to_end_button = getById(
    participantTableGrid as HTMLElement,
    'forward-to-end-button',
  )!
  forward_one_page_button = getById(
    participantTableGrid as HTMLElement,
    'forward-one-page-button',
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
    '57TMA_3fSg4Fek_T9aZ0dLLa', // replace this token with a valid one when you run the test
  )
  currentParticipants = data.items
}

// This simulates a function call that would usually be made in ParticipantManager,
// the parent component to ParticipantTableGrid
async function getParticipants(
  studyId: string,
  token: string,
): Promise<ParticipantData> {
  // console.log('the current page is', currentPage)
  const offset = (currentPage - 1) * pageSize
  const participants = await ParticipantService.getParticipants(
    studyId,
    token!,
    pageSize,
    offset,
  )
  const retrievedParticipants = participants ? participants.items : []
  const numberOfParticipants = participants ? participants.total : 0
  const clinicVisitMap: StringDictionary<string> = await ParticipantService.getClinicVisitsForParticipants(
    studyId,
    token,
    retrievedParticipants.map(p => p.id),
  )
  const result = retrievedParticipants!.map(participant => {
    const id = participant.id as string
    const visit = clinicVisitMap[id]
    const y = { ...participant, clinicVisit: visit }
    return y
  })

  return { items: result, total: numberOfParticipants }
}

// check two arrays containing participants for equality
const checkTwoPartcipantArraysForEquality = (
  arr1: ParticipantAccountSummary[],
  arr2: ParticipantAccountSummary[],
) => {
  expect(arr1.length).toBe(arr2.length)
  for (let i = 0; i < arr1.length; i++) {
    const el1 = arr1[i]
    const el2 = arr2[i]
    // expect(el1.externalId).toBe(el2.externalId)
  }
}

beforeEach(async () => {
  server.listen()
  await renderParticipantTableGrid()
})

afterEach(() => {
  server.resetHandlers()
  cleanup()
})

afterAll(() => server.close())

// test to see if the inital data is correct
test('data fetched intially be accurate', async () => {
  const expectedElements = generateRandomParticipantData(50, 0)
  checkTwoPartcipantArraysForEquality(expectedElements, currentParticipants)
})

// check to see if changing the pages results in correct participants being fetched
test('data fetched correctly on page change', async () => {
  console.log(forward_to_end_button)
  userEvent.click(forward_to_end_button)
  console.log('the current page is', currentPage)
  const expectedElements = generateRandomParticipantData(50, 50)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
  userEvent.click(backward_one_page_button)
  const nextExpectedElements = generateRandomParticipantData(50, 0)
  checkTwoPartcipantArraysForEquality(currentParticipants, nextExpectedElements)
})

/*
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
  const expectedElements = generateRandomParticipantData(25, 0)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
})

// test to see if pressing a page box will result in correct behavior
test('data fetched correctly on page box pressed', async () => {
  const pageBox2 = getById(
    participantTableGrid as HTMLElement,
    `pagebox-button-0`,
  )!
  userEvent.click(pageBox2)
  const expectedElements = generateRandomParticipantData(50, 50)
  checkTwoPartcipantArraysForEquality(currentParticipants, expectedElements)
})
*/
