import {Color} from '@mui/material'
import {grey} from '@mui/material/colors'
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

const gray: Partial<Color> = {
  100: '#FBFBF',
  200: '#F1F3F5',
  300: '#EAECEE',
  400: '#DFE2E6',
  500: '#D0D4D9',

  600: '#AEB5BC',
  700: '#878E95',
  800: '#4A5056', //
  900: '#353A3F', //Base text color. Used for body copy and table text.
  A100: '#22252A', //Used for headline styles.
}
/*
declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color']
    }
  }

  interface Palette {
    neutral: Palette['primary']
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary']
    //Gray 300Divider lines, borders and scroll bars.
  }

  interface PaletteColor {
    darker?: string
  }
  interface SimplePaletteColorOptions {
    darker?: string
  }
  interface ThemeOptions {
    status: {
      danger: React.CSSProperties['color']
    }
  }
}*/

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
        root: ({ownerState}) => ({
          height: '50px',
          padding: '0 40px',
          ...(ownerState.size === 'small' &&
            ownerState.variant === 'contained' && {
              height: '40px',
              padding: '0 30px',
            }),
        }),
        contained: {
          borderRadius: '4px',
          fontSize: '12px',
          fontWdight: 'normal',
          border: 'none',
        },
        containedSecondary: {
          borderRadius: '4px',
          border: 'none',
        } /*
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
        */,

        containedPrimary: {
          fontWeight: 900,
          fontSize: '16px',

          color: '#fff',
          boxShadow: 'none',
          background: '#4F527D',
          borderRadius: '5px',

          '&:hover': {
            backgroundColor: '#383A5A',
            boxShadow: 'none',
          },
          '&:focus': {
            backgroundColor: '#383948',
          },
          '&.Mui-disabled': {
            backgroundColor: '#D0D4D9',
            color: '#AEB5BC',
          },
        },
        outlinedPrimary: {
          backgroundColor: '#fff',
          borderRadius: '5px',
          // boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          border: '1px solid #4F527D',
          fontFamily: latoFont,

          fontWeight: 900,
          fontSize: '16px',
          height: '50px',

          padding: '0 40px',

          color: '#4F527D',
          '&:hover': {
            borderColor: '#383A5A',
            backgroundColor: '#fff',
            color: '#383A5A',
          },
          '&:focus': {
            borderColor: '#383948',
            color: '#3383948',
          },
          '&.Mui-disabled': {
            borderColor: '#AEB5BC',
            color: '#AEB5BC',
          },
        },
        textPrimary: {
          color: '#000',
        },
      },
    },
    MuiLink: {
      styleOverrides: {},
    },
    MuiIcon: {
      defaultProps: {
        // Replace the `material-icons` default value.
        baseClassName: 'material-icons-two-tone',
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
          backgroundColor: '#F1F3F5',
          outlineColor: '#F1F3F5',
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
        root: {
          borderRadius: 0,
          '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#dee1e4',
            },
          },
        },
        notchedOutline: {
          borderColor: '#F1F3F5',
          '&:hover': {
            borderColor: '#F1F3F5',
          },
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
    h1: {
      fontFamily: latoFont,
      fontSize: '48px',
      fontWeight: 700,
      color: gray.A100,
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
    grey: grey,
    divider: grey[300],
    accent: {
      blue: '#47A4DD',
      purple: '#9499C7',
      green: '#63A650',
    },
    transparency: {
      purple1: '#EDEEF2',
      purple2: '#FAFAFB',
    },
    common: {
      black: '#2E2E2E',
    },
    background: {
      default: '#e5e5e5',

      paper: '#fff',
    },
    text: {
      primary: grey[900],
      secondary: '#2A2A2A',
    },
    secondary: {
      main: '#C22E49',
      contrastText: '#E7BDBD', //pale red
    },
    primary: {
      main: '#4F527D',
      dark: '#BCD5E4',
    },

    error: {
      main: '#EE6070',
      light: '#FCD2D2',
    },
  },
})

export {theme, globals, cssVariables}
