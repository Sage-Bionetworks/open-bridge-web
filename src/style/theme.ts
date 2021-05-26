/*import { createMuiTheme, Theme } from '@material-ui/core'
/*ag*/
import {
  Theme,
  unstable_createMuiStrictModeTheme as createMuiTheme
} from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

type cssGlobalClasses = {
  [key: string]: CSSProperties
}

export const openSansFont = [
  'Open Sans',
  'serif',
  'Lato',
  'Roboto',
  'Helvetica',
  'Arial',
].join(',')

export const playfairDisplayFont = [
  'Playfair Display',
  'serif',
  'Lato',
  'Roboto',
  'Helvetica',
  'Arial',
].join(',')

const SPACE_UNIT = 8

export const latoFont = ['Lato', 'Roboto', 'Helvetica', 'Arial'].join(',')

export const poppinsFont = ['Poppins', 'sans-serif'].join(',')

export type CssVariablesType = {
  shadowing: any
  testColor: string
  activeBorder: string
}

export type ThemeType = Theme & CssVariablesType

const cssVariables = {
  shadowing: {
    boxShadow: '0 2px 5px -1px rgba(0, 0, 0, 0.3)',
  },
  testColor: 'red',
  activeBorder: `1px solid #2196f3`,
}

//those are global css classes
const globals: cssGlobalClasses = {
  /* '.assesmentContainer': {
    justifyContent: 'flex-start',
    fontSize: '26px',

    display: 'flex',
    flexWrap: 'wrap',
    overflowWrap: 'normal',
  },*/
  '.whiteBg': {
    backgroundColor: '#fff',
  },
  '.blackBg': {
    backgroundColor: '#000',
    color: '#FFF'
  },
  listReset: {
    margin: '0',
    padding: '0',
    position: 'relative',
    listStyle: 'none',
  },
}

const theme: Theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': globals,
    },
    MuiButton: {
      containedPrimary: {
        backgroundColor: '#3a3a3a',
        borderRadius: '0px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        fontFamily: latoFont,

        fontWeight: 600,
        fontSize: '14px',
        lineHeight: '17px',
        padding: '16px',

        color: '#FCFCFC',
        '&:hover': {
          backgroundColor: '#634848',
        },
      },
      outlinedPrimary: {
        backgroundColor: '#fff',
        borderRadius: '0px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        border: '1px solid black',
        fontFamily: latoFont,

        fontWeight: 'normal',
        fontSize: '14px',
        lineHeight: '17px',
        padding: '16px',

        color: '#3a3a3a',
        '&:hover': {
          backgroundColor: '#fafaf1',
          borderColor: '#000',
        },
      },
    },
    MuiPaper: {
      root: {
        color: '#1c1c1c',
      },
    },
    MuiSwitch: {
      root: {
        width: 32,
        height: 18,
        padding: 0,
        margin: '8px',
        display: 'flex',
      },
      switchBase: {
        padding: 2,
        color: '#fff',
        '& + $track': {
          opacity: 1,
          backgroundColor: '#ddd',
        },
        '&$checked': {
          transform: 'translateX(14px)',
          color: '#fff',
          '& + $track': {
            opacity: 1,
            backgroundColor: '#7FC7F0',
      
          },
        },
      },
      thumb: {
        width: 14,
        height: 14,
      },
      track: {
        border: `1px solid #ccc`,
        borderRadius: 16 / 2,
        opacity: 1,
        backgroundColor: '#fff',
      },
      colorPrimary: {
        '&.Mui-checked': {
          color: '#fff',

          '& + .MuiSwitch-track': {
            backgroundColor: '#7FC7F0',
            borderColor: '#7FC7F0',
          },
        },
      },
      colorSecondary: {
        '&.Mui-checked': {
          color: '#fff',

          '& + .MuiSwitch-track': {
            backgroundColor: '#E7BDBD',
          },
        },
      },
    },
    MuiInputBase: {
      input: {
        backgroundColor: '#BCD5E4',
      },
      colorSecondary: {
        '& input': {
          backgroundColor: 'white',
        },
      },
    },
    MuiOutlinedInput: {
      root: {borderRadius: 0, },
      notchedOutline: {
        borderColor:  '#6e6e6e'

      }
    },
    MuiDialogActions: {
      root: {
        padding: SPACE_UNIT * 3,
      },
    },
  },
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
  spacing: SPACE_UNIT,

  typography: {
    fontSize: 12,
    h3: {
      fontFamily: poppinsFont,
      fontWeight: 600,
    },
    h4: {
      fontFamily: poppinsFont,
      fontWeight: 300,
      fontSize: '14px',
      margin: 0,
    },
    subtitle2: {
      fontFamily: playfairDisplayFont,
      fontWeight: 400,
      fontStyle: 'italic',
    },
    button: {
      textTransform: 'none',
    },
    /*htmlFontSize: 10,
    button: {
      textTransform: 'none',
    },*/
  },

  palette: {
    divider: '#282828',
    common: {
      black: '#2E2E2E',
    },
    background: {
      default: '#E5E5E5',
      paper: '#fff',
    },
    text: {
      primary: '#000',
      secondary: '#2A2A2A',
    },
    secondary: {
      main: '#6e818a',
      contrastText: '#E7BDBD', //pale red
    },
    primary: {
      main: '#2196f3',
      dark: '#BCD5E4',
    },
    error: {
      main: '#EE6070',
      light: '#FCD2D2',
    },
  },
})

export { theme, globals, cssVariables }
