import { createMuiTheme } from '@material-ui/core'
import { CSSProperties } from '@material-ui/core/styles/withStyles'

const theme = createMuiTheme({
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

type cssDict = {
  [key: string]: CSSProperties
}

const globals: cssDict = {
  '.assesmentContainer': {
    justifyContent: 'flex-start',

    display: 'flex',
    flexWrap: 'wrap',
    overflowWrap: 'normal',
  },
}

export { theme, globals }
