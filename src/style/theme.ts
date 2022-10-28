import {createTheme, Theme} from '@mui/material/styles'
import {CSSProperties} from '@mui/styles'

type cssGlobalClasses = {
  [key: string]: CSSProperties
}

export const openSansFont = ['Open Sans', 'serif', 'Lato', 'Roboto', 'Helvetica', 'Arial'].join(',')

export const playfairDisplayFont = ['Playfair Display', 'serif', 'Lato', 'Roboto', 'Helvetica', 'Arial'].join(',')

const SPACE_UNIT = 8

export const latoFont = ['Lato', 'Roboto', 'Helvetica', 'Arial'].join(',')

export const poppinsFont = ['Poppins', 'sans-serif'].join(',')

export type CssVariablesType = {
  shadowing: any

  activeBorder: string
}

export type ThemeType = Theme & CssVariablesType

const cssVariables = {
  shadowing: {
    boxShadow: '0 2px 5px -1px rgba(0, 0, 0, 0.3)',
  },
  activeBorder: `1px solid #2196f3`,
}

//those are global css classes
const globals: cssGlobalClasses = {
  a: {
    color: 'black',
  },
  '.whiteBg': {
    backgroundColor: '#fff',
  },
  '.blackBg': {
    backgroundColor: '#000',
  },
  listReset: {
    margin: '0',
    padding: '0',
    position: 'relative',
    listStyle: 'none',
  },
}

const theme: Theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: globals,
    },
    MuiRadio: {
      defaultProps: {
        color: 'secondary',
      },
      styleOverrides: {
        colorPrimary: '#000',
        root: {
          '&.Mui-checked': {
            color: '#000',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#000',
          '&.Mui-selected': {
            color: '#000',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          borderRadius: '4px',
          fontSize: '12px',
          fontWdight: 'normal',
          border: 'none',
        },
        containedSecondary: {
          borderRadius: '4px',
          border: 'none',
        },
        containedPrimary: {
          backgroundColor: '#3a3a3a',
          border: '1px solid #3a3a3a',
          borderRadius: '0',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          fontFamily: latoFont,

          fontWeight: 600,
          fontSize: '14px',
          lineHeight: '17px',
          padding: '16px 14px',

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
        textPrimary: {
          color: '#000',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          color: '#1c1c1c',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          paddingTop: '9px',
          paddingBottom: '9px',
        },
        outlined: {
          paddingTop: '8px',
          paddingBottom: '8px',
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 32,
          height: 18,
          padding: 0,
          margin: '8px',
          display: 'flex',
        },
        switchBase: {
          padding: 2,
          '&.Mui-checked': {
            transform: 'translateX(80%)',
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
          backgroundColor: '#ddd',
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
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          backgroundColor: '#BCD5E4',
        },
        colorSecondary: {
          '& input': {
            backgroundColor: 'white',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {borderRadius: 0},
        notchedOutline: {
          borderColor: '#6e6e6e',
        },
        input: {
          padding: '9px 14px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: SPACE_UNIT * 3,
        },
      },
    },

    MuiButtonBase: {
      styleOverrides: {},
      // The properties to apply

      defaultProps: {
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
  },

  spacing: SPACE_UNIT,

  typography: {
    fontSize: 12,
    body1: {
      fontFamily: latoFont,
      fontSize: '15px',
      color: '#3E3E3E',
      lineHeight: '18px',
    },

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
      default: '#e5e5e5',
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

export {theme, globals, cssVariables}
