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
]

export default endpoints
