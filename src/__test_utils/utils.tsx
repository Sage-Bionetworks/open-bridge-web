import {createTheme, ThemeProvider} from '@mui/material/styles'
import {deepmerge} from '@mui/utils'
import {cssVariables, theme} from '@style/theme'

export const ProvideTheme: React.FunctionComponent<{
  children: React.ReactNode
}> = ({children}) => {
  const theTheme = createTheme(deepmerge(theme, cssVariables))
  return <ThemeProvider theme={theTheme}>{children}</ThemeProvider>
}
