import constants from '@typedefs/constants'
import { rest } from 'msw'
import * as adherenceAlerts from '../mocks/adherenceAlerts.json'

const endpoints = [
  // get all alerts
  rest.post(`*${constants.endpoints.adherenceAlerts}`, async (req, res, ctx) => {
    console.log("getting all mocked alerts!")
    return res(
      ctx.status(200), 
      ctx.json(adherenceAlerts)
    )
  }),
]

export default endpoints