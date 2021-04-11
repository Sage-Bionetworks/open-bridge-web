import { cleanup, queryByAttribute, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import AppDesign from '../../../../components/studies/app-design/AppDesign'
import { StudyAppDesign } from '../../../../types/types'
import { UserSessionDataProvider } from '../../../../helpers/AuthContext'

const getById = queryByAttribute.bind(null, 'id')

const TESTING_TEXT: string = 'testing!'

let appDesign: Element
let saveButton: Element
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
  saveButton = getById(appDesign as HTMLElement, 'test-box')!
  //   console.log('the save button is', saveButton)
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

test('welcome screen messaging section is behaving correctly', () => {
  const mainHeaderTextBox = getById(appDesign as HTMLElement, 'headline-input')!
  userEvent.type(mainHeaderTextBox, TESTING_TEXT)
  // loses focus
  userEvent.click(saveButton)
  studyAppDesign.welcomeScreenHeader = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)

  const mainBodyText = getById(appDesign as HTMLElement, 'outlined-textarea')
  userEvent.type(mainBodyText as HTMLElement, TESTING_TEXT)
  userEvent.click(saveButton)
  studyAppDesign.welcomeScreenBody = TESTING_TEXT
  expect(onUpdate).lastCalledWith(studyAppDesign)
})
