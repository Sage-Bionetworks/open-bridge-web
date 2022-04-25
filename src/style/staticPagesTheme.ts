import {createTheme, Theme} from '@mui/material/styles'
import {globals, latoFont} from './theme'

/*declare module '@mui/material/styles' {
  
  
    interface Palette {
      neutral: Palette['primary'];
    }
    interface PaletteOptions {
      neutral: PaletteOptions['primary'];
    }
  
    interface PaletteColor {
      darker?: string;
    }
    interface SimplePaletteColorOptions {
      darker?: string;
    }
    interface ThemeOptions {
      status: {
        danger: React.CSSProperties['color'];
      };
    }
  }*/

export const colors = {
  primaryDarkBlue: '#072751', //Primary_DarkBlue
  primaryBlue: '#154078', //Primary_Blue
  lightBlue: '#2E84F6', // Primary_LightBlue
  primaryGreenBlue: '#5CB4D3', //Primary_GreenBlue
  neutralsWhite: '#fff',
  neutralsBlack: '#383948',
  neutralsWhiteBlue: '#F6F5FF',
}

const staticPagesTheme: Theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 364,
      md: 960, //not used
      lg: 1320,
      xl: 1920, //not used
    },
  },
  palette: {
    text: {
      primary: colors.neutralsWhite,
    },
    background: {
      default: colors.primaryBlue,
    },
    common: {
      white: '#fff', //Neutrals_White
      black: '#383948', //Neutrals_Black
    },

    primary: {
      dark: '#072751', //Primary_DarkBlue
      main: '#154078', //Primary_Blue
      light: '#2E84F6', // Primary_LightBlue
      contrastText: '#5CB4D3', //Primary_GreenBlue
    },
  },
  spacing: 4,
  typography: {
    fontFamily: latoFont,

    h1: {
      fontWeight: '700',
      fontSize: '72px',
      lineHeight: '86px',
      letterSpacing: '-0.02em',
      marginBottom: '40px',
      //  color: '#323142',
    },
    h2: {
      fontWeight: '700',
      fontSize: '48px',
      lineHeight: '58px',
      //  color: '#323142',
    },
    h3: {
      fontWeight: '700',
      fontSize: '32px',
      lineHeight: '38px',
      //  color: '#323142',
      //styleName: Headline 3;
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: globals,
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          border: '1px solid #072751',
          borderRadius: '54px',
          color: '072751',
        },
      },
    },
  },
})
export default staticPagesTheme
