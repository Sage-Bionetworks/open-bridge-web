import * as useUserSessionDataState from '@helpers/AuthContext'
import {render, screen, waitFor} from '@testing-library/react'
import constants from '@typedefs/constants'
import {rest} from 'msw'
import {QueryClient, QueryClientProvider} from 'react-query'
import {MemoryRouter} from 'react-router-dom'
import {loggedInSessionData} from '__test_utils/mocks/user'
import server from '__test_utils/test_server/server'
import {ProvideTheme} from '__test_utils/utils'
import AdherenceAlerts from './AdherenceAlerts'

const studyId = 'hprczm'

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

export const renderComponent = () => {
  const userData = loggedInSessionData
  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  const queryClient = new QueryClient()

  const element = render(
    <ProvideTheme>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AdherenceAlerts studyId={studyId} />
        </QueryClientProvider>
      </MemoryRouter>
    </ProvideTheme>
  )
  return element
}

describe('AdherenceAlerts', () => {
  test('should render table with all filters checked', async () => {
    // set up
    renderComponent()
    expect(screen.queryByRole('progressbar')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
    })

    // all filters are checked
    screen.queryAllByRole('checkbox').forEach(eachCheckbox => {
      expect(eachCheckbox).toHaveProperty('checked', true)
    })

    // table exists
    expect(screen.queryByRole('table')).toBeInTheDocument()
  })

  test('should not render table when there are no alerts', async () => {
    // override server handler
    server.use(
      rest.post(`*${constants.endpoints.adherenceAlerts}`, async (req, res, ctx) => {
        console.log('getting empty mocked alerts!')
        return res(
          ctx.status(200),
          ctx.json({
            items: [],
            total: 0,
            requestParams: {
              pageSize: 50,
              offsetBy: 0,
              type: 'RequestParams',
            },
            type: 'PagedResourceList',
          })
        )
      })
    )

    // set up
    renderComponent()

    // checkboxes exist
    screen.queryAllByRole('checkbox').forEach(eachCheckbox => {
      expect(eachCheckbox).toHaveProperty('checked', true)
    })

    // table does not exist
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
