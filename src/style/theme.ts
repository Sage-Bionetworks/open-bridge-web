import { createMuiTheme, Theme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'


type cssDict = {
  [key: string]: CSSProperties
}

export type CssVariablesType = {
  shadowing:  any,
  testColor: string
}

export type ThemeType = Theme & CssVariablesType

const cssVariables = {
  shadowing: {
     boxShadow: "0 2px 5px -1px rgba(0, 0, 0, 0.3)",
  },
  testColor: 'red'
};


//those are global css classes
const globals: cssDict = {
  '.assesmentContainer': {
    justifyContent: 'flex-start',
    fontSize: '26px',

    display: 'flex',
    flexWrap: 'wrap',
    overflowWrap: 'normal',
  },
}


const theme: Theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
    
      '@global': globals,
    }},
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  spacing: 8,
  
  typography: {
    fontSize: 12,
    /*htmlFontSize: 10,
    button: {
      textTransform: 'none',
    },*/
  },

  palette: {
    text: {
      secondary: '',
    },
  },
})


export { theme, globals, cssVariables }
