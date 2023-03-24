import constants from '@typedefs/constants'
import {rest} from 'msw'

const handlers = [
  //  get single schedule -- not found
  rest.get(`*${constants.endpoints.schedule}`, async (req, res, ctx) => {
    {
      return res(
        ctx.status(404),
        ctx.json({
          errorMessage: 'Schedule Not found',
        })
      )
    }
  }),
]

export default handlers
