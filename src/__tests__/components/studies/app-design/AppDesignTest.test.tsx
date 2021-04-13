import { cleanup, queryByAttribute, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import AppDesign from '../../../../components/studies/app-design/AppDesign'
import { StudyAppDesign } from '../../../../types/types'
import { UserSessionDataProvider } from '../../../../helpers/AuthContext'

const getById = queryByAttribute.bind(null, 'id')

const TESTING_TEXT: string = 'testing!'

let appDesign: Element
let container: Element
let studyAppDesign = {} as StudyAppDesign

const onUpdate = jest.fn()
const onSave = jest.fn()

const renderAppDesignComponent = () => {
  appDesign = render(
    <UserSessionDataProvider>
      <AppDesign
        hasObjectChanged={false}
        saveLoader={false}
        id={'test'}
        currentAppDesign={studyAppDesign}
        onSave={onSave}
        onUpdate={onUpdate}
      ></AppDesign>
      ,
    </UserSessionDataProvider>,
  ).container
  container = getById(appDesign as HTMLElement, 'container')!
}

beforeEach(() => {
  studyAppDesign = {
    logo: '',
    backgroundColor: '#6040FF',
    welcomeScreenHeader: '',
    welcomeScreenBody: '',
    welcomeScreenFromText: '',
    welcomeScreenSalutation: '',
    studyTitle: '',
    studySummaryBody: '',
    leadPrincipleInvestigator: '',
    institution: '',
    funder: '',
    IRBApprovalNumber: '',
    contactLead: '',
    contactLeadRoleInStudy: '',
    contactLeadPhoneNumber: '',
    contactLeadEmail: '',
    nameOfEthicsBoard: '',
    ethicsBoardPhoneNumber: '',
    ethicsBoardEmail: '',
    useOptionalDisclaimer: false,
    isUsingDefaultMessage: false,
  }
  renderAppDesignComponent()
  onUpdate.mockReset()
  onSave.mockReset()
})

afterEach(() => {
  cleanup()
})

test('save button is called correctly', () => {
  const saveButton = getById(
    appDesign as HTMLElement,
    'save-button-study-builder-1',
  )
  userEvent.click(saveButton!)
  expect(onSave).toHaveBeenCalledTimes(1)
})

test('welcome screen messaging section is behaving correctly', () => {
  const mainHeaderTextBox = getById(appDesign as HTMLElement, 'headline-input')!
  userEvent.type(mainHeaderTextBox, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.welcomeScreenHeader = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const mainBodyText = getById(appDesign as HTMLElement, 'outlined-textarea')
  userEvent.type(mainBodyText!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.welcomeScreenBody = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const salutationsText = getById(appDesign as HTMLElement, 'salutations')
  userEvent.type(salutationsText!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.welcomeScreenSalutation = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const fromText = getById(appDesign as HTMLElement, 'signature-textarea')
  userEvent.type(fromText!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.welcomeScreenFromText = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const disclaimerCheckBox = getById(
    appDesign as HTMLElement,
    'disclaimer-check-box',
  )
  userEvent.click(disclaimerCheckBox!)
  expect(disclaimerCheckBox).toBeChecked()
  studyAppDesign.useOptionalDisclaimer = true
  expect(onUpdate).lastCalledWith(studyAppDesign)
})

test('study summary section is behaving correctly', () => {
  const officialStudyName = getById(
    appDesign as HTMLElement,
    'study-name-input',
  )
  userEvent.type(officialStudyName!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.studyTitle = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const studySummaryBody = getById(appDesign as HTMLElement, 'study-body-text')
  userEvent.type(studySummaryBody!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.studySummaryBody = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)
  expect(onUpdate).toHaveBeenCalledTimes(2)
})

test('study Lead information section is behaving correctly', () => {
  const institution = getById(appDesign as HTMLElement, 'institution-input')
  userEvent.type(institution!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.institution = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const funder = getById(appDesign as HTMLElement, 'funder-input')
  userEvent.type(funder!, TESTING_TEXT)
  userEvent.click(container!)
  studyAppDesign.funder = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const IRBApprovalNumber = getById(
    appDesign as HTMLElement,
    'IRB-approval-input',
  )
  userEvent.type(IRBApprovalNumber!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.IRBApprovalNumber = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)
  expect(onUpdate).toHaveBeenCalledTimes(3)

  // add tests for lead principle investigator after Pr has been merged
  // const leadPrincipleInvestigatorDropDown = getById(appDesign as HTMLElement, "")
})

test('general contact and support section is behaving correctly', () => {
  const contactLead = getById(appDesign as HTMLElement, 'contact-lead-input')
  userEvent.type(contactLead!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.contactLead = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const roleInStudy = getById(appDesign as HTMLElement, 'role-in-study-input')
  userEvent.type(roleInStudy!, TESTING_TEXT)
  userEvent.click(container!)
  studyAppDesign.contactLeadRoleInStudy = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const contactLeadPhoneNumber = getById(
    appDesign as HTMLElement,
    'phone-number-contact-input',
  )
  userEvent.type(contactLeadPhoneNumber!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.contactLeadPhoneNumber = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const contactLeadEmail = getById(
    appDesign as HTMLElement,
    'contact-email-input',
  )
  userEvent.type(contactLeadEmail!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.contactLeadEmail = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  expect(onUpdate).toHaveBeenCalledTimes(4)
})

test('ethics board contact section is behaving correctly', () => {
  const ethicsBoardName = getById(
    appDesign as HTMLElement,
    'ethics-board-input',
  )
  userEvent.type(ethicsBoardName!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.nameOfEthicsBoard = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const ethicsBoardPhoneNumber = getById(
    appDesign as HTMLElement,
    'ethics-phone-number-input',
  )
  userEvent.type(ethicsBoardPhoneNumber!, TESTING_TEXT)
  userEvent.click(container!)
  studyAppDesign.ethicsBoardPhoneNumber = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const ethicsBoardemail = getById(
    appDesign as HTMLElement,
    'ethics-email-input',
  )
  userEvent.type(ethicsBoardemail!, TESTING_TEXT)
  userEvent.click(container)
  studyAppDesign.ethicsBoardEmail = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)
  expect(onUpdate).toHaveBeenCalledTimes(3)
})
