import {
  cleanup,
  queryByAttribute,
  render,
  waitFor,
  within,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import AppDesign from '../../../../components/studies/app-design/AppDesign'
import {
  StudyBuilderComponentProps,
  Contact,
  WelcomeScreenData,
  StudyAppDesign,
  Study,
} from '../../../../types/types'
import { UserSessionDataStateContext } from '../../../../helpers/AuthContext'
import Server from '../../../../_tests_server/handlers/server'
import { BrowserRouter } from 'react-router-dom'

const getById = queryByAttribute.bind(null, 'id')

const TESTING_TEXT: string = 'testing!'

let appDesign: Element
let container: Element
const studyAppDesignTemplate = {
  logo: '',
  backgroundColor: {
    foreground: '#6040FF',
  },
  welcomeScreenInfo: {
    welcomeScreenBody: '',
    welcomeScreenFromText: '',
    welcomeScreenSalutation: '',
    welcomeScreenHeader: '',
    isUsingDefaultMessage: false,
    useOptionalDisclaimer: false,
  } as WelcomeScreenData,
  studyTitle: '',
  studySummaryBody: '',
  irbProtocolId: '',
  leadPrincipleInvestigatorInfo: undefined,
  contactLeadInfo: undefined,
  ethicsBoardInfo: undefined,
  funder: undefined,
} as StudyAppDesign

const studyTemplate = {
  identifier: 'testing_study',
  status: 'DRAFT',
  version: 1,
  name: 'test_study',
  clientData: {},
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
          study={{ ...studyTemplate }}
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

test('investigator drop down is working correctly', async () => {
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
  const institution = getById(appDesign as HTMLElement, 'institution-input')
  userEvent.type(institution!, TESTING_TEXT)
  userEvent.click(container)
  const currentInvestigator = studyObject.contacts?.find(
    el => el.role === 'principal_investigator',
  )
  currentInvestigator!.affiliation = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyObject)
})

// test('study lead information section is behaving correctly', () => {
//   const funder = getById(appDesign as HTMLElement, 'funder-input')
//   userEvent.type(funder!, TESTING_TEXT)
//   userEvent.click(container!)
//   studyAppDesign.funder = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//

//   const IRBApprovalNumber = getById(
//     appDesign as HTMLElement,
//     'IRB-approval-input',
//   )
//   userEvent.type(IRBApprovalNumber!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.IRBApprovalNumber = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)
// })

// test('save button is called correctly', () => {
//   const saveButton = getById(
//     appDesign as HTMLElement,
//     'save-button-study-builder-1',
//   )
//   userEvent.click(saveButton!)
//   expect(onSave).toHaveBeenCalledTimes(1)
// })

// test('welcome screen messaging section is behaving correctly', () => {
//   const mainHeaderTextBox = getById(appDesign as HTMLElement, 'headline-input')!
//   userEvent.type(mainHeaderTextBox, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.welcomeScreenHeader = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const mainBodyText = getById(appDesign as HTMLElement, 'outlined-textarea')
//   userEvent.type(mainBodyText!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.welcomeScreenBody = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const salutationsText = getById(appDesign as HTMLElement, 'salutations')
//   userEvent.type(salutationsText!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.welcomeScreenSalutation = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const fromText = getById(appDesign as HTMLElement, 'signature-textarea')
//   userEvent.type(fromText!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.welcomeScreenFromText = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const disclaimerCheckBox = getById(
//     appDesign as HTMLElement,
//     'disclaimer-check-box',
//   )
//   userEvent.click(disclaimerCheckBox!)
//   expect(disclaimerCheckBox).toBeChecked()
//   studyAppDesign.useOptionalDisclaimer = true
//   expect(onUpdate).lastCalledWith(studyAppDesign)
// })

// test('study summary section is behaving correctly', () => {
//   const officialStudyName = getById(
//     appDesign as HTMLElement,
//     'study-name-input',
//   )
//   userEvent.type(officialStudyName!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.studyTitle = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const studySummaryBody = getById(appDesign as HTMLElement, 'study-body-text')
//   userEvent.type(studySummaryBody!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.studySummaryBody = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)
// })

// test('general contact and support section is behaving correctly', () => {
//   const contactLead = getById(appDesign as HTMLElement, 'contact-lead-input')
//   userEvent.type(contactLead!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.contactLead = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const roleInStudy = getById(appDesign as HTMLElement, 'role-in-study-input')
//   userEvent.type(roleInStudy!, TESTING_TEXT)
//   userEvent.click(container!)
//   studyAppDesign.contactLeadRoleInStudy = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const contactLeadPhoneNumber = getById(
//     appDesign as HTMLElement,
//     'phone-number-contact-input',
//   )
//   userEvent.type(contactLeadPhoneNumber!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.contactLeadPhoneNumber = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const contactLeadEmail = getById(
//     appDesign as HTMLElement,
//     'contact-email-input',
//   )
//   userEvent.type(contactLeadEmail!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.contactLeadEmail = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)
// })

// test('ethics board contact section is behaving correctly', () => {
//   const ethicsBoardName = getById(
//     appDesign as HTMLElement,
//     'ethics-board-input',
//   )
//   userEvent.type(ethicsBoardName!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.nameOfEthicsBoard = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const ethicsBoardPhoneNumber = getById(
//     appDesign as HTMLElement,
//     'ethics-phone-number-input',
//   )
//   userEvent.type(ethicsBoardPhoneNumber!, TESTING_TEXT)
//   userEvent.click(container!)
//   studyAppDesign.ethicsBoardPhoneNumber = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)

//   const ethicsBoardemail = getById(
//     appDesign as HTMLElement,
//     'ethics-email-input',
//   )
//   userEvent.type(ethicsBoardemail!, TESTING_TEXT)
//   userEvent.click(container)
//   studyAppDesign.ethicsBoardEmail = TESTING_TEXT
//   expect(onUpdate).lastCalledWith(studyAppDesign)
// })
