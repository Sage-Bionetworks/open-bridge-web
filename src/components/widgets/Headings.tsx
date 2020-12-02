import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import Link from '@material-ui/core/Link'
import BackIcon from '@material-ui/icons/KeyboardBackspace'
import Breadcrumbs from '@material-ui/core/Breadcrumbs/Breadcrumbs'
import { Typography } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'
import Heading, { TypographyProps } from '@material-ui/core/Typography'
import { playfairDisplayFont, poppinsFont, latoFont } from '../../style/theme'

export const MTBHeading = styled(Heading)({
  fontFamily: playfairDisplayFont,
  fontStyle: 'italic',
  fontWeight: 'normal',
  fontSize: (props: TypographyProps) =>
    props.variant === 'h1' ? '34px' : '14px',
  marginBottom: (props: TypographyProps) =>
    props.variant === 'h1' ? '24px' : '16px',

  color: 'rgba(40, 40, 40, 0.75)',
})

export const MTBHeadingH1 = styled(Heading)({
  fontFamily: playfairDisplayFont,
  fontStyle: 'italic',
  fontWeight: 'normal',
  fontSize: '21px',
  lineHeight: '28px',
  color: '#050505',
})

export const MTBHeadingH2 = styled(Heading)({
  fontFamily: poppinsFont,
  fontStyle: 'normal',
  fontWeight: 600,
  fontSize: '18px',
  lineHeight: '27px',
  color: '#050505',
})
export const MTBHeadingH3 = styled(Heading)({
  fontFamily: latoFont,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '15px',
  lineHeight: '18px',
  color: '#050505',
})

export const MTBHeadingH4 = styled(Heading)({
  fontFamily: latoFont,
  fontStyle: 'normal',
  fontWeight: 'bold',
  fontSize: '15px',
  lineHeight: '18px',
  color: '#050505',
})

export const MTBHeadingH5 = styled(Heading)({
  fontFamily: poppinsFont,
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontSize: '14px',
  lineHeight: '21px',
  color: '#050505',
})
