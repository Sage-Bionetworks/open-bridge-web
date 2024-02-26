import {styled} from '@mui/material/styles'
import Heading from '@mui/material/Typography'
import {latoFont, playfairDisplayFont, poppinsFont, theme} from '../../style/theme'

export const DefaultHeading = styled(Heading, {
  shouldForwardProp: prop => prop !== 'variant',
})<{variant: string}>(({variant}) => ({
  fontSize: variant === 'h1' ? '34px' : '14px',
  marginBottom: variant === 'h1' ? '24px' : '16px',
  fontFamily: playfairDisplayFont,

  fontStyle: 'italic',
  fontWeight: 'normal',
  color: 'rgba(40, 40, 40, 0.75)',
  lineHeight: '28px',
}))

export const DefaultHeadingH1 = styled(Heading)({
  fontFamily: latoFont,

  fontWeight: 700,
  fontSize: '32px',
  lineHeight: '28px',
  color: theme.palette.grey.A100,
})

export const DefaultHeadingH2 = styled(Heading)({
  fontFamily: poppinsFont,
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '27px',
  color: '#050505',
})
export const DefaultHeadingH3 = styled(Heading)({
  fontFamily: latoFont,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '15px',
  lineHeight: '18px',
  color: '#050505',
})

export const DefaultHeadingH4 = styled(Heading)({
  fontFamily: latoFont,
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '15px',
  lineHeight: '18px',
  color: '#050505',
})

export const DefaultHeadingH5 = styled(Heading)({
  fontFamily: poppinsFont,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color: '#050505',
})

export const DefaultHeadingH6 = styled(Heading)({
  fontFamily: poppinsFont,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color: '#fff',
})
