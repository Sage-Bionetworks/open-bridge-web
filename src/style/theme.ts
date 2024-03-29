import {Color} from '@mui/material'

import {createTheme, darken, Theme} from '@mui/material/styles'
import {CSSProperties} from 'react'

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

export const gray_custom: Partial<Color> = {
  100: '#FBFBFC',
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

const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
}

const theme: Theme = createTheme({
  breakpoints: {
    values: BREAKPOINTS,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: globals,
    },
    MuiRadio: {
      defaultProps: {
        // color: 'secondary',
        // color: 'green'
      },
      styleOverrides: {
        colorPrimary: '#878E95',
        root: {
          color: '#D0D4D9',
          '&.Mui-checked': {
            color: '#4F527D',
          },
          '&.Mui-disabled': {
            color: '#eee',
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: ({ownerState}) => ({
          textTransform: 'capitalize',
          height: '50px',
          padding: '0 40px',
          fontWeight: 900,
          fontSize: '16px',
          ...(ownerState.size === 'small' &&
            ownerState.variant === 'contained' && {
              height: '30px',
              padding: '0 24px',
            }),
          ...(ownerState.size === 'small' &&
            ownerState.variant === 'outlined' && {
              height: '30px',
              padding: '0 24px',
            }),
          ...(ownerState.variant === 'text' && {
            padding: '0 20px',
          }),
          ...(ownerState.color === 'error' &&
            ownerState.variant === 'text' && {
              color: '#FF4164',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
                color: '#FF4164',
              },
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
          fontFamily: latoFont,
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

          //  padding: '0 40px',

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
          padding: 0,
          minWidth: 'auto',
          color: '#4F527D',
          borderRadius: 0,
          background: 'transparent',
          fontWeight: 900,

          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline',
            color: '#383A5A',
          },
          '&:focus': {
            color: '#383948',
            backgroundColor: 'transparent',
          },
          '&.Mui-disabled': {
            backgroundColor: 'transparent',
            color: '#AEB5BC',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#878E95',
          '&:hover': {
            backgroundColor: 'transparent',
            color: darken('#4F527D', 0.8),
          },
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
          boxShadow: '0px 4px 4px #EAECEE',
          marginBottom: '8px',
          borderRadius: '0',
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
              backgroundColor: '#4F527D',
              borderColor: '#4F527D',
              opacity: 1,
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

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#AEB5BC',
          borderRadius: '0',
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
          backgroundColor: '#F1F3F5',
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

    MuiButtonBase: {
      styleOverrides: {},
      // The properties to apply

      defaultProps: {
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          padding: '24px 44px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '20px 0',
          borderTop: '1px solid #EAECEE',
          justifyContent: 'flex-end',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          '.MuiDialogTitle-root + &': {
            paddingTop: '20px',
          },
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          position: 'relative',
          padding: '20px 0',
          borderBottom: '1px solid #EAECEE',
          fontSize: '20px',
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'auto',
          // borderBottom: '1px solid #EAECEE',
        },
        /* indicator: {
          height: '3px',
          backgroundColor: 'red',

          '&.MuiTabs-indicatorColorSecondary': {
            backgroundColor: '#E7BDBD',
          },
        },*/
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        tag: {
          fontSize: '14px',
          backgroundColor: 'rgba(79, 82, 125, 0.25)',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: '#878E95',
          '&.Mui-selected': {
            color: '#22252A',
            fontWeight: 800,
          },
          marginRight: '16px',
          //width: '200px',

          //  clipPath: 'polygon(10% 0%, 90% 0, 98% 100%,0 100%)',
          borderRadius: '20px 20px 0 0',
          margin: '0 8px',
          height: '66px',
          paddingTop: '24px',
          zIndex: 0,
          backgroundColor: '#FAFAFB',
          fontSize: '18px',
          '&:first-of-type': {
            marginLeft: '0',
          },

          '& >div': {
            display: 'flex',
            alignItems: 'center',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: '14px',
        },
      },
    },
  },

  spacing: SPACE_UNIT,

  typography: {
    fontSize: 12,
    fontFamily: latoFont,
    body1: {
      fontFamily: latoFont,
      fontSize: '14px',
      fontWeight: 400,
      color: gray_custom[900],
      lineHeight: '18px',
    },
    body2: {
      //large body copy
      fontFamily: latoFont,
      fontSize: '20px',
      fontWeight: 400,
      color: gray_custom.A100,
    },

    h1: {
      fontFamily: latoFont,
      fontSize: '48px',
      fontWeight: 700,
      color: gray_custom.A100,
    },
    h2: {
      fontFamily: latoFont,
      fontSize: '32px',
      fontWeight: 700,
      color: gray_custom.A100,
    },

    h3: {
      fontFamily: latoFont,
      fontSize: '24px',
      fontWeight: 400,
      color: gray_custom.A100,
      marginBottom: '16px',
    },
    h4: {
      fontFamily: latoFont,
      fontWeight: 700,
      fontSize: '14px',
      margin: 0,

      color: gray_custom.A100,
    },
    h5: {
      fontFamily: latoFont,
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '20px',
    },
    subtitle1: {
      //Small Copy/Breadcrumb-Card
      fontFamily: latoFont,
      fontSize: '14px',
      fontWeight: 400,
      color: gray_custom[800],
      textTransform: 'uppercase',
    },

    subtitle2: {
      fontFamily: latoFont,
      fontSize: '14px',
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
    grey: gray_custom,
    divider: gray_custom[300],
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
      default: '#fff',

      paper: '#fff',
    },
    text: {
      primary: gray_custom[900],
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
      main: '#FF4164',
      light: '#FCD2D2',
    },
  },
})

function shouldForwardProp(prop: PropertyKey) {
  return !prop.toString().startsWith('$')
}

export {theme, globals, cssVariables, shouldForwardProp}
