import ArrowRightAltTwoToneIcon from '@mui/icons-material/ArrowRightAltTwoTone'
import {Box, Breadcrumbs, SxProps, Typography} from '@mui/material'
import {theme} from '@style/theme'
import React from 'react'
import {StyledLink} from './StyledComponents'

export interface BreadCrumbProps {
  links: {url: string; text: string}[]
  currentItem?: string
  sx?: SxProps
}

const BreadCrumb: React.FunctionComponent<BreadCrumbProps> = ({links, currentItem = '', sx}: BreadCrumbProps) => {
  console.log(sx)
  return (
    <Breadcrumbs aria-label="breadcrumb" separator={currentItem ? '/' : ''} sx={{...sx}}>
      {links.map((link, index) => (
        <StyledLink to={link.url} key={link.url} sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          {index === 0 && <ArrowRightAltTwoToneIcon sx={{transform: 'rotate(180deg)', color: '#4F527D'}} />}
          <Box sx={{marginLeft: index > 0 ? theme.spacing(1.5) : 0}}>{link.text}</Box>
        </StyledLink>
      ))}

      <Typography>{currentItem}</Typography>
    </Breadcrumbs>
  )
}

export default BreadCrumb
