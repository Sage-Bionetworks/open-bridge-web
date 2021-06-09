import {
  cleanup,
  queryByAttribute,
  render,
  waitFor,
  within
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppDesign from '../../../../components/studies/app-design/AppDesign'
import { UserSessionDataStateContext } from '../../../../helpers/AuthContext'
import { Study, WelcomeScreenData } from '../../../../types/types'
import Server from '../../../../_tests_server/handlers/server'

const getById = queryByAttribute.bind(null, 'id')

const TESTING_TEXT: string = 'testing!'
const TESTING_TEXT_PHONE_NUMBER: string = '425-445-1788'
const TESTING_TEXT_EMAIL: string = 'testing@gmail.com'
const TESTING_TEXT_BAD_PHONE_NUMBER: string = '425-442-44'
const TESTIING_TEXT_BAD_EMAIL: string = 'BAD_EMAIL'

let appDesign: Element
let container: Element

const studyTemplate = {
  identifier: 'testing_study',
  phase: 'design',
  version: 1,
  name: '',
  clientData: {
    welcomeScreenData: {
      welcomeScreenBody: '',
      welcomeScreenFromText: '',
      welcomeScreenSalutation: '',
      welcomeScreenHeader: '',
      isUsingDefaultMessage: false,
      useOptionalDisclaimer: false,
    } as WelcomeScreenData,
  },
  contacts: [],
} as Study

let studyObject: Study

const onUpdate = jest.fn()
const onSave = jest.fn()

const renderAppDesignComponent = () => {
  appDesign = render(
    <BrowserRouter>
      <UserSessionDataStateContext.Provider
        value={{
          token: 'testing-token',
          orgMembership: 'testMembership',
          id: 'testID',
          roles: ['org_admin'],
          dataGroups: [],
        }}
      >
        <AppDesign
          hasObjectChanged={false}
          saveLoader={false}
          id={'test'}
          study={{ ...studyObject }}
          onSave={onSave}
          onUpdate={onUpdate}
        ></AppDesign>
        ,
      </UserSessionDataStateContext.Provider>
      ,
    </BrowserRouter>,
  ).container
  container = getById(appDesign as HTMLElement, 'container')!
}

beforeAll(() => {
  Server.listen()
})

beforeEach(() => {
  Server.resetHandlers()
  studyObject = {
    ...studyTemplate,
    contacts: [...studyTemplate.contacts!],
    clientData: {
      welcomeScreenData: {
        ...studyTemplate.clientData.welcomeScreenData!,
      },
    },
  }
  onUpdate.mockReset()
  onSave.mockReset()
  renderAppDesignComponent()
})

afterEach(() => {
  cleanup()
})

afterAll(() => {
  Server.close()
})

test('should study lead information section behave correctly', async () => {
  // Test the study lead drop down
  const leadPrincipleInvestigatorDropDown = getById(
    appDesign as HTMLElement,
    'lead-investigator-drop-down',
  )
  const selectNode = leadPrincipleInvestigatorDropDown?.parentNode?.querySelector(
    '[role=button]',
  )
  userEvent.click(selectNode!)
  const listbox = document.body.querySelector('ul[role=listbox]')
  await waitFor(() =>
    expect(
      within(listbox as HTMLElement).getByText('John Roberts'),
    ).toBeInTheDocument(),
  )
  const selectedItemDefault = within(listbox as HTMLElement).getByText(
    'John Roberts',
  )
  userEvent.click(selectedItemDefault)
  studyObject.contacts?.push({
    role: 'principal_investigator',
    name: 'John Roberts',
  })
  expect(onUpdate).lastCalledWith(studyObject)
  // Test the institution text
  const institution = getById(appDesign as HTMLElement, 'institution-input')
  userEvent.type(institution!, TESTING_TEXT)
  userEvent.click(container)
  const currentInvestigator = studyObject.contacts?.find(
    el => el.role === 'principal_investigator',
  )
  currentInvestigator!.affiliation = TESTING_TEXT
  studyObject.contacts?.unshift({
    role: 'irb',
    name: TESTING_TEXT,
  })
  expect(onUpdate).lastCalledWith(studyObject)
  // Test the funder text
  const funder = getById(appDesign as HTMLElement, 'funder-input')
  userEvent.type(funder!, TESTING_TEXT)
  userEvent.click(container!)
  studyObject.contacts?.splice(1, 0, {
    role: 'sponsor',
    name: TESTING_TEXT,
  })
  expect(onUpdate).lastCalledWith(studyObject)
})

test('should save buttons be called correctly', async () => {
  // test both save buttons
  const saveButton = getById(
    appDesign as HTMLElement,
    'save-button-study-builder-1',
  )
  userEvent.click(saveButton!)
  expect(onSave).toHaveBeenCalledTimes(1)
  const saveButton2 = getById(
    appDesign as HTMLElement,
    'save-button-study-builder-2',
  )
  userEvent.click(saveButton2!)
  expect(onSave).toHaveBeenCalledTimes(2)
})

test('should welcome screen messaging section behave correctly', async () => {
  const mainHeaderTextBox = getById(appDesign as HTMLElement, 'headline-input')!
  userEvent.type(mainHeaderTextBox, TESTING_TEXT)
  userEvent.click(container)
  studyObject.clientData.welcomeScreenData!.welcomeScreenHeader = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)

  const mainBodyText = getById(appDesign as HTMLElement, 'outlined-textarea')
  userEvent.type(mainBodyText!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.clientData.welcomeScreenData!.welcomeScreenBody = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)

  const salutationsText = getById(appDesign as HTMLElement, 'salutations')
  userEvent.type(salutationsText!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.clientData.welcomeScreenData!.welcomeScreenSalutation = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)

  const fromText = getById(appDesign as HTMLElement, 'signature-textarea')
  userEvent.type(fromText!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.clientData.welcomeScreenData!.welcomeScreenFromText = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)

  const disclaimerCheckBox = getById(
    appDesign as HTMLElement,
    'disclaimer-check-box',
  )
  userEvent.click(disclaimerCheckBox!)
  expect(disclaimerCheckBox).toBeChecked()
  studyObject.clientData.welcomeScreenData!.useOptionalDisclaimer = true
  expect(onUpdate).lastCalledWith(studyObject)
})

test('should general contact and support section behave correctly', () => {
  const contactLead = getById(appDesign as HTMLElement, 'contact-lead-input')
  userEvent.type(contactLead!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.contacts?.push({
    role: 'study_support',
    name: TESTING_TEXT,
  })
  expect(onUpdate).lastCalledWith(studyObject)

  const roleInStudy = getById(appDesign as HTMLElement, 'role-in-study-input')
  userEvent.type(roleInStudy!, TESTING_TEXT)
  userEvent.click(container!)
  studyObject.contacts![0].position = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)

  const contactLeadPhoneNumber = getById(
    appDesign as HTMLElement,
    'phone-number-contact-input',
  )
  userEvent.type(contactLeadPhoneNumber!, TESTING_TEXT_PHONE_NUMBER)
  userEvent.click(container)
  studyObject.contacts![0].phone = {
    number: '+1' + TESTING_TEXT_PHONE_NUMBER,
    regionCode: 'US',
  }
  expect(onUpdate).lastCalledWith(studyObject)

  const contactLeadEmail = getById(
    appDesign as HTMLElement,
    'contact-email-input',
  )
  userEvent.type(contactLeadEmail!, TESTING_TEXT_EMAIL)
  userEvent.click(container)
  studyObject.contacts![0].email = TESTING_TEXT_EMAIL
  expect(onUpdate).lastCalledWith(studyObject)
})

test('should ethics board contact section behave correctly', () => {
  const differingIRBContactButton = getById(
    appDesign as HTMLElement,
    'affiliation-other-radio-button',
  )
  userEvent.click(differingIRBContactButton!)
  const ethicsBoardName = getById(
    appDesign as HTMLElement,
    'ethics-board-input',
  )
  userEvent.type(ethicsBoardName!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.contacts?.push({
    role: 'irb',
    name: TESTING_TEXT,
  })
  expect(onUpdate).lastCalledWith(studyObject)

  const ethicsBoardPhoneNumber = getById(
    appDesign as HTMLElement,
    'ethics-phone-number-input',
  )
  userEvent.type(ethicsBoardPhoneNumber!, TESTING_TEXT_PHONE_NUMBER)
  userEvent.click(container!)
  studyObject.contacts![0].phone = {
    number: '+1' + TESTING_TEXT_PHONE_NUMBER,
    regionCode: 'US',
  }
  expect(onUpdate).lastCalledWith(studyObject)

  const ethicsBoardEmail = getById(
    appDesign as HTMLElement,
    'ethics-email-input',
  )
  userEvent.type(ethicsBoardEmail!, TESTING_TEXT_EMAIL)
  userEvent.click(container)
  studyObject.contacts![0].email = TESTING_TEXT_EMAIL
  expect(onUpdate).lastCalledWith(studyObject)

  const IRBApprovalNumber = getById(
    appDesign as HTMLElement,
    'IRB-approval-input',
  )
  userEvent.type(IRBApprovalNumber!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.irbProtocolId = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)
})

test('should study summary section behave correctly', () => {
  const officialStudyName = getById(
    appDesign as HTMLElement,
    'study-name-input',
  )
  userEvent.type(officialStudyName!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.name = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)

  renderAppDesignComponent()
  const studySummaryBody = getById(appDesign as HTMLElement, 'study-body-text')
  userEvent.type(studySummaryBody!, TESTING_TEXT)
  userEvent.click(container)
  studyObject.details = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)
})

test('should error text appear when emails are badly formatted', () => {
  const ethicsBoardEmail = getById(
    appDesign as HTMLElement,
    'ethics-email-input',
  )
  userEvent.type(ethicsBoardEmail!, TESTIING_TEXT_BAD_EMAIL)
  userEvent.click(container)
  expect(
    getById(appDesign as HTMLElement, 'ethics-bad-email-text'),
  ).not.toBeNull()
  userEvent.clear(ethicsBoardEmail!)
  userEvent.click(container)
  expect(getById(appDesign as HTMLElement, 'ethics-bad-email-text')).toBeNull()

  const contactLeadEmail = getById(
    appDesign as HTMLElement,
    'contact-email-input',
  )
  userEvent.type(contactLeadEmail!, TESTIING_TEXT_BAD_EMAIL)
  userEvent.click(container)
  expect(
    getById(appDesign as HTMLElement, 'general-contact-bad-email-text'),
  ).not.toBeNull()
  userEvent.clear(contactLeadEmail!)
  userEvent.click(container)
  expect(
    getById(appDesign as HTMLElement, 'general-contact-bad-email-text'),
  ).toBeNull()
})

test('should error text appear when phone numbers are badly formatted', () => {
  const ethicsBoardPhoneNumber = getById(
    appDesign as HTMLElement,
    'ethics-phone-number-input',
  )
  userEvent.type(ethicsBoardPhoneNumber!, TESTING_TEXT_BAD_PHONE_NUMBER)
  userEvent.click(container)
  expect(
    getById(appDesign as HTMLElement, 'ethics-phone-bad-text'),
  ).not.toBeNull()
  userEvent.clear(ethicsBoardPhoneNumber!)
  userEvent.click(container)
  expect(getById(appDesign as HTMLElement, 'ethics-phone-bad-text')).toBeNull()

  const contactLeadPhoneNumber = getById(
    appDesign as HTMLElement,
    'phone-number-contact-input',
  )
  userEvent.type(contactLeadPhoneNumber!, TESTING_TEXT_BAD_PHONE_NUMBER)
  userEvent.click(container)
  expect(
    getById(appDesign as HTMLElement, 'general-contact-bad-phone-text'),
  ).not.toBeNull()
  userEvent.clear(contactLeadPhoneNumber!)
  userEvent.click(container)
  expect(
    getById(appDesign as HTMLElement, 'general-contact-bad-phone-text'),
  ).toBeNull()
})
