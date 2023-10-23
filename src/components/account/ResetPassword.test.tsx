import UserService from '@services/user.service'
import {cleanup, render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {REQUEST_RESET_PASSWORD_MESSAGE} from '__test_utils/test_server/userHandlers'
import {createWrapper} from '__test_utils/utils'
import {ResetPassword} from './ResetPassword'

export const setUp = () => {
  const user = userEvent.setup()
  const spyOnRequestResetPassword = jest.spyOn(UserService, 'requestResetPassword')
  const element = render(<ResetPassword />, {wrapper: createWrapper()})

  const emailField = screen.getByLabelText('Email')
  const submitButton = screen.getByRole('button', {name: /reset my password/i})

  return {user, spyOnRequestResetPassword, element, emailField, submitButton}
}

afterEach(() => {
  jest.restoreAllMocks()
  cleanup()
})

describe('ResetPassword', () => {
  test('should not be able to request password reset when email is empty', async () => {
    const {emailField, submitButton, spyOnRequestResetPassword} = setUp()
    expect(emailField).toHaveTextContent('')
    expect(submitButton).toBeDisabled()
    expect(spyOnRequestResetPassword).toHaveBeenCalledTimes(0)
  })

  test('should show success banner when password reset request is sent', async () => {
    const {user, emailField, submitButton, spyOnRequestResetPassword} = setUp()
    const testEmail = 'test@fake.com'

    await waitFor(() => {
      user.clear(emailField)
      user.type(emailField, testEmail)
    })
    await waitFor(() => {
      expect(emailField).toHaveValue(testEmail)
      expect(submitButton).not.toBeDisabled()
    })

    // click must be wrapped in a waitFor to prevent an act warning
    await waitFor(() => {
      user.click(submitButton)
    })

    const alert = await screen.findByRole('alert')
    expect(alert).toBeInTheDocument()
    expect(alert).toHaveTextContent(REQUEST_RESET_PASSWORD_MESSAGE)

    expect(spyOnRequestResetPassword).toHaveBeenCalledTimes(1)
    expect(spyOnRequestResetPassword).toHaveBeenLastCalledWith(testEmail)
  })
})
