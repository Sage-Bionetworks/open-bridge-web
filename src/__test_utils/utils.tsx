import {createTheme, ThemeProvider} from '@mui/material/styles'
import {deepmerge} from '@mui/utils'
import {cssVariables, theme} from '@style/theme'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {BaseStep} from '@typedefs/surveys'
import React, {ReactNode} from 'react'
import {QueryClient, QueryClientProvider} from 'react-query'
import {MemoryRouter} from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'survey_12345',
  }),
}))

interface Props<T> {
  Component: React.FC<{step: T; onChange: (s: T) => void}>
  step: T
}

export const ProvideTheme: React.FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  const theTheme = createTheme(deepmerge(theme, cssVariables))
  return <ThemeProvider theme={theTheme}>{children}</ThemeProvider>
}

export const ProvideQueryClient: React.FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  const queryClient = new QueryClient()
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

type CreateWrapperProps = {
  initialEntries?: string[]
}

type RtlWrapperProps = {
  children?: ReactNode
}

/**
 * Based on https://github.com/Sage-Bionetworks/synapse-web-monorepo/blob/main/packages/synapse-react-client/test/testutils/TestingLibraryUtils.tsx
 * creates a test wrapper for components being tested with @testing-library/react. This
 * wrapper includes a memory router, theme, and an isolated query cache.
 * Returns the wrapper function
 */
export const createWrapper = (props?: CreateWrapperProps) => {
  return function RtlWrapper({children}: RtlWrapperProps) {
    return (
      <MemoryRouter initialEntries={props?.initialEntries}>
        <ProvideTheme>
          <ProvideQueryClient>{children}</ProvideQueryClient>
        </ProvideTheme>
      </MemoryRouter>
    )
  }
}

const SurveyQuestionComponentWrapper = <T extends BaseStep>({Component, step: _step}: Props<T>) => {
  const [step, setStep] = React.useState(_step)
  return <Component step={step} onChange={setStep} />
}

export const renderSurveyQuestionComponent = <T extends BaseStep>({step, Component}: Props<T>) => {
  jest.useFakeTimers()
  const user = userEvent.setup({
    advanceTimers: jest.advanceTimersByTime,
  })
  const element = render(<SurveyQuestionComponentWrapper Component={Component} step={step} />, {
    wrapper: createWrapper(),
  })
  return {user, element}
}
