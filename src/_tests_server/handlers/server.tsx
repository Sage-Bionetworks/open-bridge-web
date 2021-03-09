import { rest } from 'msw'
import { setupServer } from 'msw/node'
import constants from '../../types/constants'

type search = {
  pageSize: number
  offsetBy: number
}

const server = setupServer(
  rest.post(
    `*${constants.endpoints.participantsSearch}`,
    async (req, res, ctx) => {
      const data = req.body as search
      const items = []
      // console.log('offset by', data.offsetBy)
      for (let i = data.offsetBy + 1; i <= data.pageSize + data.offsetBy; i++) {
        let obj = {
          createdOn: '2021-02-22T20:45:38.375Z',
          externalIds: { kkynty35udejidtdp8h: `test-id-${i}` },
          id: 'dRNO0ydUO3hAGD5rHOXx1Gmb' + i,
          status: 'unverified',
          firstName: '',
          lastName: '',
          email: '',
        }
        items.push(obj)
      }
      return res(
        ctx.status(200),
        ctx.json({
          items: items,
          total: items.length,
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
