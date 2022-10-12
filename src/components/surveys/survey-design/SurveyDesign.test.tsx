import * as useUserSessionDataState from '@helpers/AuthContext'
import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {QueryClient, QueryClientProvider} from 'react-query'
import {MemoryRouter} from 'react-router-dom'
import {loggedInSessionData} from '__test_utils/mocks/user'
import {ProvideTheme} from '__test_utils/utils'
import SurveyDesign from './SurveyDesign'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'survey_12345',
  }),
}))

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<
  typeof useUserSessionDataState
>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

//render the component

const renderComponent = (props: any) => {
  const userData = loggedInSessionData
  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  const queryClient = new QueryClient()
  const user = userEvent.setup()
  const element = render(
    <MemoryRouter
      initialEntries={[
        '/surveys/xY3Th7-sifB2JLCyBxAnxRLh/design/question?q=5',
      ]}>
      <ProvideTheme>
        <QueryClientProvider client={queryClient}>
          <SurveyDesign {...props} />
        </QueryClientProvider>
      </ProvideTheme>
    </MemoryRouter>
  )
  return {user, element}
}

test('renders the component, initially with loader', async () => {
  renderComponent({})
  expect(screen.queryByRole('progressbar')).toBeInTheDocument()
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
