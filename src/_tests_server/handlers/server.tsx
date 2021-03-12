import { rest } from 'msw'
import { setupServer } from 'msw/node'
import constants from '../../types/constants'
import { ParticipantAccountSummary } from '../../types/types'

type Search = {
  pageSize: number
  offsetBy: number
}

const server = setupServer(
  rest.post(
    `*${constants.endpoints.participantsSearch}`,
    async (req, res, ctx) => {
      const data = req.body as Search
      const expectedData = []
      for (let i = data.offsetBy + 1; i <= data.pageSize + data.offsetBy; i++) {
        let obj: ParticipantAccountSummary = {
          createdOn: '2021-02-22T20:45:38.375Z',
          externalIds: { testID: `test-id-${i}` },
          id: 'dRNO0ydUO3hAGD5rHOXx1Gmb' + i,
          status: 'unverified',
          firstName: '',
          lastName: '',
          email: '',
        }
        expectedData.push(obj)
      }
      return res(
        ctx.status(200),
        ctx.json({
          items: expectedData,
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
