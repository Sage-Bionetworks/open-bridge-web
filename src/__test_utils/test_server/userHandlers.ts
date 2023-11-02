import constants from '@typedefs/constants'
import {rest} from 'msw'

export const REQUEST_RESET_PASSWORD_MESSAGE =
  "If registered with the app, we'll send an email to that address so you can change your password."

const endpoints = [
  rest.post(`*${constants.endpoints.requestResetPassword}`, async (req, res, ctx) => {
    return res(
      ctx.status(202),
      ctx.json({
        message: REQUEST_RESET_PASSWORD_MESSAGE,
        type: 'StatusMessage',
      })
    )
  }),
  rest.post(`*${constants.endpoints.sendRequestResetPassword.replace(':id', '*')}`, async (req, res, ctx) => {
    return res(
      ctx.status(202),
      ctx.json({
        identifer: 'Request to reset password sent to user.',
        type: 'StatusMessage',
      })
    )
  }),
]

export default endpoints
