//jest test SurveyList
import * as useUserSessionDataState from '@helpers/AuthContext'
import * as useAssessments from '@services/assessmentHooks'
import {cleanup, render} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {LocalAssessmentsMTB} from '__test_utils/mocks/assessments'
import {loggedInSessionData} from '__test_utils/mocks/user'
import {ProvideTheme} from '__test_utils/utils'
import SurveyList from './SurveyList'

jest.mock('@services/assessmentHooks')
const mockedUseAssessmentsHook = useAssessments as jest.Mocked<any>
jest.mock('@helpers/AuthContext')

const mockedAuth = useUserSessionDataState as jest.Mocked<
  typeof useUserSessionDataState
>
mockedAuth.useUserSessionDataState.mockImplementation(() => loggedInSessionData)

function renderControl(location: string) {
  return render(
    <MemoryRouter initialEntries={[location]}>
      <ProvideTheme>
        <SurveyList></SurveyList>
      </ProvideTheme>
    </MemoryRouter>
  )
}

beforeEach(() => {
  mockedUseAssessmentsHook.useUpdateSurveyAssessment.mockImplementation(() => ({
    isSuccess: true,
    isError: null,
    isLoading: false,
    error: null,
    mutate: () => {},
  }))
})

afterEach(() => {
  cleanup()
})

test("should render without surveys and provide 'new survey' button", () => {
  mockedUseAssessmentsHook.useAssessments.mockImplementation(() => ({
    data: [],
    isLoading: false,
  }))

  const container = renderControl('http://127.0.0.1:3000/surveys')
  expect(
    container.getByRole('button', {name: /New Survey/})
  ).toBeInTheDocument()
})

test('should display the list of surveys', () => {
  mockedUseAssessmentsHook.useAssessments.mockImplementation(() => ({
    isLoading: false,
    data: LocalAssessmentsMTB,
  }))
  const container = renderControl('http://127.0.0.1:3000/surveys')
  expect(container.getByText(LocalAssessmentsMTB[0].title)).toBeInTheDocument()
  expect(container.getByText(LocalAssessmentsMTB[1].title)).toBeInTheDocument()
})
