import * as useUserSessionDataState from '@helpers/AuthContext'
import Utility from '@helpers/utility'
import AccessService, {SynapseAlias} from '@services/access.service'
import ParticipantService from '@services/participants.service'
import UserService from '@services/user.service'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {UserEvent} from '@testing-library/user-event/dist/types/setup/setup'
import {Study} from '@typedefs/types'
import {orgAdminSession, testUserId} from '__test_utils/test_server/accountHandlers'
import {createWrapper} from '__test_utils/utils'
import AccessSettings from './AccessSettings'

jest.mock('@helpers/AuthContext')

const study = {
  identifier: 'test',
  phase: 'design',
  version: 1,
  name: 'test',
} as Study

const mockSynapseProfileInfo = {
  principalId: '000000',
  firstName: 'FirstSynapse',
  lastName: 'LastSynapse',
} as SynapseAlias

const mockDemoExternalId = '000000:demo'

// scrollIntoView is not implemented in jsdom
// see: https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

const setUp = async () => {
  const user = userEvent.setup()

  // authentication
  const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
  mockedAuth.useUserSessionDataState.mockImplementation(() => {
    Utility.setSession({...orgAdminSession, token: undefined})
    return orgAdminSession
  })

  // access settings
  const spyOnGetAliasFromSynapseByEmail = jest
    .spyOn(AccessService, 'getAliasFromSynapseByEmail')
    .mockResolvedValue(mockSynapseProfileInfo)
  const spyOnSignUpForAssessmentDemoStudy = jest
    .spyOn(ParticipantService, 'signUpForAssessmentDemoStudy')
    .mockResolvedValue(mockDemoExternalId)
  const spyOnCreateIndividualAccount = jest.spyOn(AccessService, 'createIndividualAccount')
  const spyOnSendRequestResetPassword = jest.spyOn(UserService, 'sendRequestResetPassword')

  const element = await waitFor(() => render(<AccessSettings study={study} />, {wrapper: createWrapper()}))

  const addNewMemberButton = await screen.findByRole('button', {name: 'Add New Member'})
  await waitFor(() => {
    expect(addNewMemberButton).not.toBeDisabled()
  })

  return {
    user,
    spyOnGetAliasFromSynapseByEmail,
    spyOnSignUpForAssessmentDemoStudy,
    spyOnCreateIndividualAccount,
    spyOnSendRequestResetPassword,
    addNewMemberButton,
    element,
  }
}

const openAddNewMemberPanel = async (user: UserEvent, addNewMemberButton: HTMLElement) => {
  await user.click(addNewMemberButton)

  await waitFor(() => {
    expect(addNewMemberButton).toBeDisabled()
    expect(screen.getByRole('heading', {name: 'Account'})).toBeVisible()
    expect(screen.getByRole('heading', {name: 'Permissions'})).toBeVisible()
  })
}

const newMemberAccountControls = async () => {
  return {
    emailInput: await screen.findByRole('textbox', {name: 'Email Address'}),
    firstNameInput: await screen.findByRole('textbox', {name: 'First Name'}),
    lastNameInput: await screen.findByRole('textbox', {name: 'Last Name'}),
    saveChangesButton: await screen.findByRole('button', {name: 'Save Changes'}),
  }
}

afterEach(() => {
  Utility.clearSession()
  jest.restoreAllMocks()
  cleanup()
})

describe('AccessSettings', () => {
  describe('isSynapseEmail', () => {
    test('identifies a synapse email address', () => {
      expect(AccessService.isSynapseEmail('fake@synapse.org')).toBe(true)
    })

    test('identifes non-synapse email addresses', () => {
      expect(AccessService.isSynapseEmail('fake@domain.org')).toBe(false)
      expect(AccessService.isSynapseEmail('something@google.com')).toBe(false)
    })
  })

  describe('Add New Member', () => {
    const nonSynapseEmail = 'test@domain.org'
    const synapseEmail = 'test@synapse.org'
    const firstName = 'FirstNonSynapse'
    const lastName = 'LastNonSynapse'

    test('should display an error when an email is not provided', async () => {
      const errorText = 'No email provided'
      const {
        user,
        spyOnGetAliasFromSynapseByEmail,
        spyOnSignUpForAssessmentDemoStudy,
        spyOnCreateIndividualAccount,
        spyOnSendRequestResetPassword,
        addNewMemberButton,
      } = await setUp()

      await openAddNewMemberPanel(user, addNewMemberButton)

      const {emailInput, saveChangesButton} = await newMemberAccountControls()
      expect(emailInput).toHaveValue('')

      const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      await user.click(saveChangesButton)

      expect(errorSpy).toHaveBeenCalledTimes(1)
      expect(spyOnGetAliasFromSynapseByEmail).toHaveBeenCalledTimes(0)
      expect(spyOnSignUpForAssessmentDemoStudy).toHaveBeenCalledTimes(0)
      expect(spyOnCreateIndividualAccount).toHaveBeenCalledTimes(0)
      expect(spyOnSendRequestResetPassword).toHaveBeenCalledTimes(0)

      expect(screen.getByText(errorText)).toBeVisible()
      errorSpy.mockRestore()
    })

    test('should create new account with first and last name for non-Synapse email', async () => {
      const {
        user,
        spyOnGetAliasFromSynapseByEmail,
        spyOnSignUpForAssessmentDemoStudy,
        spyOnCreateIndividualAccount,
        spyOnSendRequestResetPassword,
        addNewMemberButton,
      } = await setUp()

      await openAddNewMemberPanel(user, addNewMemberButton)

      const {emailInput, firstNameInput, lastNameInput, saveChangesButton} = await newMemberAccountControls()

      await user.type(emailInput, nonSynapseEmail)
      await user.type(firstNameInput, firstName)
      await user.type(lastNameInput, lastName)

      expect(emailInput).toHaveValue(nonSynapseEmail)
      expect(firstNameInput).toHaveValue(firstName)
      expect(lastNameInput).toHaveValue(lastName)

      expect(spyOnGetAliasFromSynapseByEmail).toHaveBeenCalledTimes(0)
      expect(spyOnSignUpForAssessmentDemoStudy).toHaveBeenCalledTimes(0)
      expect(spyOnCreateIndividualAccount).toHaveBeenCalledTimes(0)
      expect(spyOnSendRequestResetPassword).toHaveBeenCalledTimes(0)

      await user.click(saveChangesButton)

      await waitFor(() => {
        expect(emailInput).not.toBeVisible()
        expect(firstNameInput).not.toBeVisible()
        expect(lastNameInput).not.toBeVisible()
        expect(saveChangesButton).not.toBeVisible()
      })

      expect(spyOnGetAliasFromSynapseByEmail).toHaveBeenCalledTimes(0)
      expect(spyOnSignUpForAssessmentDemoStudy).toHaveBeenCalledTimes(1)
      expect(spyOnCreateIndividualAccount).toHaveBeenCalledTimes(1)
      expect(spyOnCreateIndividualAccount).toHaveBeenLastCalledWith(
        orgAdminSession.token,
        nonSynapseEmail,
        null,
        firstName,
        lastName,
        orgAdminSession.orgMembership,
        {demoExternalId: mockDemoExternalId},
        []
      )
      expect(spyOnSendRequestResetPassword).toHaveBeenCalledTimes(1)
      expect(spyOnSendRequestResetPassword).toHaveBeenLastCalledWith(testUserId, orgAdminSession.token)
    }, 10_000)

    test('should create new account without first and last name for non-Synapse email', async () => {
      const {
        user,
        spyOnGetAliasFromSynapseByEmail,
        spyOnSignUpForAssessmentDemoStudy,
        spyOnCreateIndividualAccount,
        spyOnSendRequestResetPassword,
        addNewMemberButton,
      } = await setUp()

      await openAddNewMemberPanel(user, addNewMemberButton)

      const {emailInput, saveChangesButton} = await newMemberAccountControls()

      await user.type(emailInput, nonSynapseEmail)
      expect(emailInput).toHaveValue(nonSynapseEmail)

      await user.click(saveChangesButton)

      await waitFor(() => {
        expect(emailInput).not.toBeVisible()
        expect(saveChangesButton).not.toBeVisible()
      })

      expect(spyOnGetAliasFromSynapseByEmail).toHaveBeenCalledTimes(0)
      expect(spyOnSignUpForAssessmentDemoStudy).toHaveBeenCalledTimes(1)
      expect(spyOnCreateIndividualAccount).toHaveBeenCalledTimes(1)
      expect(spyOnCreateIndividualAccount).toHaveBeenLastCalledWith(
        orgAdminSession.token,
        nonSynapseEmail,
        null,
        null,
        null,
        orgAdminSession.orgMembership,
        {demoExternalId: mockDemoExternalId},
        []
      )
      expect(spyOnSendRequestResetPassword).toHaveBeenCalledTimes(1)
      expect(spyOnSendRequestResetPassword).toHaveBeenLastCalledWith(testUserId, orgAdminSession.token)
    })

    test('should create new account with first and last name for Synapse email', async () => {
      const {
        user,
        spyOnGetAliasFromSynapseByEmail,
        spyOnSignUpForAssessmentDemoStudy,
        spyOnCreateIndividualAccount,
        spyOnSendRequestResetPassword,
        addNewMemberButton,
      } = await setUp()

      await openAddNewMemberPanel(user, addNewMemberButton)

      const {emailInput, firstNameInput, lastNameInput, saveChangesButton} = await newMemberAccountControls()

      await user.type(emailInput, synapseEmail)
      await user.type(firstNameInput, firstName)
      await user.type(lastNameInput, lastName)

      expect(emailInput).toHaveValue(synapseEmail)
      expect(firstNameInput).toHaveValue(firstName)
      expect(lastNameInput).toHaveValue(lastName)

      await user.click(saveChangesButton)

      await waitFor(() => {
        expect(emailInput).not.toBeVisible()
        expect(saveChangesButton).not.toBeVisible()
      })

      expect(spyOnGetAliasFromSynapseByEmail).toHaveBeenCalledTimes(1)
      expect(spyOnSignUpForAssessmentDemoStudy).toHaveBeenCalledTimes(1)
      expect(spyOnCreateIndividualAccount).toHaveBeenCalledTimes(1)

      // should use provided first/last name rather than synapse info
      expect(spyOnCreateIndividualAccount).toHaveBeenLastCalledWith(
        orgAdminSession.token,
        synapseEmail,
        mockSynapseProfileInfo.principalId,
        firstName,
        lastName,
        orgAdminSession.orgMembership,
        {demoExternalId: mockDemoExternalId},
        []
      )

      // should not send request reset password email to synapse email address
      expect(spyOnSendRequestResetPassword).toHaveBeenCalledTimes(0)
    }, 10_000)

    test('should create new account without first and last name for Synapse email', async () => {
      const {
        user,
        spyOnGetAliasFromSynapseByEmail,
        spyOnSignUpForAssessmentDemoStudy,
        spyOnCreateIndividualAccount,
        spyOnSendRequestResetPassword,
        addNewMemberButton,
      } = await setUp()

      await openAddNewMemberPanel(user, addNewMemberButton)

      const {emailInput, saveChangesButton} = await newMemberAccountControls()

      await user.type(emailInput, synapseEmail)
      expect(emailInput).toHaveValue(synapseEmail)

      await user.click(saveChangesButton)

      await waitFor(() => {
        expect(emailInput).not.toBeVisible()
        expect(saveChangesButton).not.toBeVisible()
      })

      expect(spyOnGetAliasFromSynapseByEmail).toHaveBeenCalledTimes(1)
      expect(spyOnSignUpForAssessmentDemoStudy).toHaveBeenCalledTimes(1)
      expect(spyOnCreateIndividualAccount).toHaveBeenCalledTimes(1)

      // should use synapse first/last name, if inputs not provided
      expect(spyOnCreateIndividualAccount).toHaveBeenLastCalledWith(
        orgAdminSession.token,
        synapseEmail,
        mockSynapseProfileInfo.principalId,
        mockSynapseProfileInfo.firstName,
        mockSynapseProfileInfo.lastName,
        orgAdminSession.orgMembership,
        {demoExternalId: mockDemoExternalId},
        []
      )

      // should not send request reset password email to synapse email address
      expect(spyOnSendRequestResetPassword).toHaveBeenCalledTimes(0)
    })
  })
})
