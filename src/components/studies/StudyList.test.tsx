import * as useUserSessionDataState from '@helpers/AuthContext'
import {render, screen, waitFor} from '@testing-library/react'
import constants from '@typedefs/constants'
import {rest} from 'msw'
import {QueryClient, QueryClientProvider} from 'react-query'
import {MemoryRouter} from 'react-router-dom'
import {loggedInSessionData} from '__test_utils/mocks/user'
import server from '__test_utils/test_server/server'
import {ProvideTheme} from '__test_utils/utils'
import StudyList from './StudyList'

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

function renderComponent(isVerified: boolean) {
  const userData = isVerified ? {...loggedInSessionData, isVerified: isVerified} : loggedInSessionData
  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  const routeComponentPropsMock = {
    history: {} as any,
    location: {} as any,
    match: {} as any,
  }

  const queryClient = new QueryClient()

  // stub for adherence weekly handler
  server.use(
    rest.post(`*${constants.endpoints.adherenceWeekly}`, async (req, res, ctx) => {
      console.log('stubbing out adherence weekly')
      return res(
        ctx.status(200),
        ctx.json({
          items: [],
          total: 0,
        })
      )
    })
  )

  // scroll window placeholder
  window.scrollTo = jest.fn()

  return render(
    <MemoryRouter>
      <ProvideTheme>
        <QueryClientProvider client={queryClient}>
          <StudyList {...routeComponentPropsMock} />
        </QueryClientProvider>
      </ProvideTheme>
    </MemoryRouter>
  )
}

test('verify banner appears when user is not verified', async () => {
  // set up
  renderComponent(false)

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  // show that banner appears
  expect(screen.queryByRole('alert')).toBeInTheDocument()
  expect(screen.queryByRole('link', {name: /become verified/i}))
})

test('verify banner does not appear when usser is verified', async () => {
  // set up
  renderComponent(true)

  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })

  // show that banner is not present
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  expect(screen.queryByRole('link', {name: /become verified/i})).not.toBeInTheDocument()
})
