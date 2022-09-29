import { createTheme, ThemeProvider } from '@mui/material/styles'
import { deepmerge } from '@mui/utils'
import { cssVariables, theme } from '@style/theme'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Step } from '@typedefs/surveys'
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    id: 'survey_12345'
  })
}))


export const ProvideTheme: React.FunctionComponent<{
  children: React.ReactNode
}> = ({ children }) => {
  const theTheme = createTheme(deepmerge(theme, cssVariables))
  return <ThemeProvider theme={theTheme}>{children}</ThemeProvider>
}



const Wrapper = ({ Component, step: _step }: { Component: React.FC<{ step: Step, onChange: (s: Step) => void }>, step: Step }) => {
  const [step, setStep] = React.useState(_step)
  return (<MemoryRouter><Component step={step} onChange={setStep} /></MemoryRouter>)

}
//render the component
export const renderSurveyQuestionComponent = ({ step, Component }: { step: Step, Component: React.FunctionComponent<{ step: Step, onChange: (s: Step) => void }> }) => {
  const user = userEvent.setup()
  const element = render(
    <Wrapper Component={Component} step={step} />
  )
  return { user, element }
}
