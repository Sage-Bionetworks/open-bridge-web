import constants from '@typedefs/constants'
import {rest} from 'msw'
import * as adherenceAlerts from '../mocks/adherenceAlerts.json'

const endpoints = [
  // get all alerts
  rest.post(`*${constants.endpoints.adherenceAlerts}`, async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(adherenceAlerts))
  }),
  // update alerts
  rest.post(`*${constants.endpoints.adherenceAlerts}/read`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Alerts successfully marked as read',
        type: 'StatusMessage',
      })
    )
  }),
  rest.post(`*${constants.endpoints.adherenceAlerts}/unread`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Alerts successfully marked as unread',
        type: 'StatusMessage',
      })
    )
  }),
  rest.post(`*${constants.endpoints.adherenceAlerts}/delete`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Alerts successfully deleted',
        type: 'StatusMessage',
      })
    )
  }),
]

export default endpoints
