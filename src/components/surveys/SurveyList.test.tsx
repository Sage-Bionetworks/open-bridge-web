//jest test SurveyList
import * as useUserSessionDataState from '@helpers/AuthContext'
import {cleanup, render, waitFor} from '@testing-library/react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {MemoryRouter} from 'react-router-dom'
import {LocalAssessmentsMTB} from '__test_utils/mocks/assessments'
import {loggedInSessionData} from '__test_utils/mocks/user'
import {ProvideTheme} from '__test_utils/utils'
import SurveyList from './SurveyList'

jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<typeof useUserSessionDataState>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

function renderControl(appId?: string) {
  const queryClient = new QueryClient()
  const userData = appId ? {...loggedInSessionData, appId: appId} : loggedInSessionData

  /* mockedAuth.useUserSessionDataState.mockImplementation(
    () => loggedInSessionData*/

  mockedAuth.useUserSessionDataState.mockImplementation(() => userData)

  return render(
    <MemoryRouter initialEntries={['http://127.0.0.1:3000/surveys']}>
      <ProvideTheme>
        <QueryClientProvider client={queryClient}>
          <SurveyList></SurveyList>
        </QueryClientProvider>
      </ProvideTheme>
    </MemoryRouter>
  )
}

afterEach(() => {
  cleanup()
})

test('should display the list of surveys', async () => {
  const container = renderControl()
  await waitFor(() => {
    expect(container.getAllByRole('button', {name: /last edited/i})).toHaveLength(1)
    expect(container.getByText(LocalAssessmentsMTB[0].title)).toBeInTheDocument()
  })
})

test('should display only a button to add if there are no surveys returned', async () => {
  const container = renderControl('someAppId')
  await waitFor(() => {
    expect(container.getByRole('button', {name: /New Survey/})).toBeInTheDocument()
    expect(container.queryByRole('link')).toBe(null)
  })
})
