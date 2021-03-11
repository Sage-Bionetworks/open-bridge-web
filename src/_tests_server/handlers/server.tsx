import { rest } from 'msw'
import { setupServer } from 'msw/node'
import constants from '../../types/constants'
import { generateSampleParticipantGridData } from '../../types/functions'

type Search = {
  pageSize: number
  offsetBy: number
}

const server = setupServer(
  rest.post(
    `*${constants.endpoints.participantsSearch}`,
    async (req, res, ctx) => {
      const data = req.body as Search
      const items = generateSampleParticipantGridData(
        data.pageSize,
        data.offsetBy,
      )
      return res(
        ctx.status(200),
        ctx.json({
          items: items,
          total: 100,
        }),
      )
    },
  ),
  rest.get(`*${constants.endpoints.events}`, async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        items: [],
      }),
    )
  }),
)

export default server
