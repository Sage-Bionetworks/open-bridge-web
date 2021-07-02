import {cleanup, queryByAttribute, render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import ParticipantSearch from '../../../../components/studies/participants/ParticipantSearch'

let participantSearch: Element

const onReset = jest.fn()
const onSearch = jest.fn()

const TESTING_TEXT: string = 'testing!'

const getById = queryByAttribute.bind(null, 'id')

const renderParticipantSearchComponent = () => {
  participantSearch = render(
    <ParticipantSearch
      onReset={onReset}
      onSearch={onSearch}></ParticipantSearch>
  ).container
}

beforeEach(() => {
  renderParticipantSearchComponent()
  onReset.mockReset()
  onSearch.mockReset()
})

afterEach(() => {
  cleanup()
})

test('renders correctly', () => {
  const startSearchButton = getById(
    participantSearch as HTMLElement,
    'start-searching-for-participant-button'
  )
  expect(startSearchButton).not.toEqual(null)
  const inputElement = getById(
    participantSearch as HTMLElement,
    'participant-search-bar'
  )
  expect(inputElement).toEqual(null)
})

test('should initial search button press lead to appearing of input element', () => {
  const startSearchButton = getById(
    participantSearch as HTMLElement,
    'start-searching-for-participant-button'
  )
  userEvent.click(startSearchButton!)
  const inputElement = getById(
    participantSearch as HTMLElement,
    'participant-search-bar'
  )
  expect(inputElement).not.toEqual(null)
})

test('search properties are passed correctly on search button pressed', () => {
  const startSearchButton = getById(
    participantSearch as HTMLElement,
    'start-searching-for-participant-button'
  )
  userEvent.click(startSearchButton!)
  const inputElement = getById(
    participantSearch as HTMLElement,
    'participant-search-bar'
  )
  userEvent.type(inputElement!, TESTING_TEXT)
  const searchbutton = getById(
    participantSearch as HTMLElement,
    'search-participants-button'
  )
  userEvent.click(searchbutton!)
  expect(onSearch).toHaveBeenLastCalledWith(TESTING_TEXT)
})

test('content is correct when typing and is cleared correctly on x-button press', () => {
  const startSearchButton = getById(
    participantSearch as HTMLElement,
    'start-searching-for-participant-button'
  )
  userEvent.click(startSearchButton!)
  const inputElement = getById(
    participantSearch as HTMLElement,
    'participant-search-bar'
  )
  userEvent.type(inputElement!, TESTING_TEXT)
  expect(inputElement).toHaveValue(TESTING_TEXT)
  const searchbutton = getById(
    participantSearch as HTMLElement,
    'search-participants-button'
  )
  userEvent.click(searchbutton!)
  const clearTextButton = getById(
    participantSearch as HTMLInputElement,
    'clear-participant-search-text-button'
  )
  expect(clearTextButton).not.toEqual(null)
  userEvent.click(clearTextButton!)
  expect(inputElement).toHaveValue('')
})

test('search is executed on enter press', () => {
  const startSearchButton = getById(
    participantSearch as HTMLElement,
    'start-searching-for-participant-button'
  )
  userEvent.click(startSearchButton!)
  const inputElement = getById(
    participantSearch as HTMLElement,
    'participant-search-bar'
  )
  userEvent.type(inputElement!, TESTING_TEXT)
  userEvent.type(inputElement!, '{enter}')
  expect(onSearch).toHaveBeenLastCalledWith(TESTING_TEXT)
})
