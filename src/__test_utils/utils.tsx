import {createTheme, ThemeProvider} from '@mui/material/styles'
import {deepmerge} from '@mui/utils'
import {cssVariables, theme} from '@style/theme'
import {render} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {BaseStep} from '@typedefs/surveys'
import React from 'react'
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

const Wrapper = <T extends BaseStep>({Component, step: _step}: Props<T>) => {
  const [step, setStep] = React.useState(_step)
  const theTheme = createTheme(deepmerge(theme, cssVariables))
  return (
    <ThemeProvider theme={theTheme}>
      <MemoryRouter>
        <Component step={step} onChange={setStep} />
      </MemoryRouter>
    </ThemeProvider>
  )
}
//render the component
export const renderSurveyQuestionComponent = <T extends BaseStep>({step, Component}: Props<T>) => {
  const user = userEvent.setup()
  const element = render(<Wrapper Component={Component} step={step} />)
  return {user, element}
}
