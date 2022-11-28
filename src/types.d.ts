import '@mui/material/styles'
declare module '@super-effective/react-color-picker'
declare module 'react-json-to-csv'

declare module 'react-imask'

declare module '@mui/material/styles' {
  interface AccentPaletteColorOptions {
    blue: string
    green: string
    purple: string
  }

  interface TransparencyPaletteColorOptions {
    purple1: string
    purple2: string
  }

  interface AccentPaletteColor {
    blue: string
    green: string
    purple: string
  }

  interface TransparencyPaletteColor {
    purple1: string
    purple2: string
  }

  interface PaletteOptions {
    accent: AccentPaletteColorOptions
    transparency: TransparencyPaletteColorOptions
  }

  interface Palette {
    accent: AccentPaletteColor
    transparency: TransparencyPaletteColor
  }
}

declare module 'react-pluralize'
