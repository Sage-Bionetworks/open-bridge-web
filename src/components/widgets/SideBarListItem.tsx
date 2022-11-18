import {Button, ListItem} from '@mui/material'
import {styled, Theme} from '@mui/system'
import React from 'react'

import {latoFont, shouldForwardProp} from '@style/theme'

const StyledNonSBListItemStyles = (theme: Theme, isActive?: boolean, isOpen?: boolean) => ({
  color: theme.palette.action.active,
  paddingLeft: isActive
    ? isOpen
      ? theme.spacing(1.5)
      : theme.spacing(0.5)
    : isOpen
    ? theme.spacing(2)
    : theme.spacing(1),
  borderLeft: isActive ? '4px solid #BCD5E4' : 'none',
  '&:hover': {
    backgroundColor: '#EDEEF2;',
  },
})

const StyledSBListItemStyles = (theme: Theme, isActive?: boolean, isOpen?: boolean) => ({
  color: isActive ? '#fff' : theme.palette.action.active,
  height: '48px',
  paddingLeft: isOpen ? theme.spacing(0) : theme.spacing(0),
  backgroundColor: isActive ? '#9499C7' : 'transparent',
  marginBottom: theme.spacing(0.5),

  '&:hover': {
    backgroundColor: isActive ? '#9499C7' : '#f7f7f7',
  },

  '& span': {
    color: isActive ? '#fff' : theme.palette.grey[800],
  },

  '& svg': {
    fill: isActive ? '#fff' : '#878E95',
  },
})

const StyledDarkListItemStyles = (theme: Theme, isActive?: boolean) => ({
  height: theme.spacing(9),
  display: 'flex',
  color: theme.palette.common.white,
  '& button': {
    color: theme.palette.common.white,
    borderRadius: 0,
  },
  backgroundColor: isActive ? '#444' : 'inherit',
  borderLeft: isActive ? '4px solid #FFE500' : 'none',
  '&:hover': {
    backgroundColor: '#333',
  },
})

type StyledListItemProps = {
  $inStudyBuilder?: boolean
  $isActive?: boolean
  $isOpen?: boolean
  $isDark?: boolean
}
const StyledListItem = styled(ListItem, {
  label: 'StyledListItem',
  shouldForwardProp: shouldForwardProp,
})<StyledListItemProps>(({theme, $inStudyBuilder, $isActive, $isOpen, $isDark}) => {
  if ($isDark) {
    return StyledDarkListItemStyles(theme, $isActive)
  } else if ($inStudyBuilder) {
    return StyledSBListItemStyles(theme, $isActive, $isOpen)
  }
  return StyledNonSBListItemStyles(theme, $isActive, $isOpen)
})

//  ,

const StyledLinkButton = styled(Button, {
  label: 'StyledLinkButton',
  shouldForwardProp: shouldForwardProp,
})<{$isActive?: boolean; $isOpen?: boolean}>({
  fontFamily: latoFont,
  justifyContent: 'flex-start',
  //color: '#282828',
  padding: '0px',
  width: '100%',
  textDecoration: 'none',
  height: 'auto',
  '&:hover': {
    backgroundColor: 'inherit',
    height: 'auto',
  },
})

export interface SideBarListItemProps {
  isOpen: boolean
  isActive: boolean
  onClick: Function
  children: React.ReactNode
  variant?: 'light' | 'dark'

  inStudyBuilder?: boolean
}

const SideBarListItem: React.FunctionComponent<SideBarListItemProps> = ({
  isOpen,
  isActive,
  onClick,
  children,
  variant = 'light',

  inStudyBuilder,
}: SideBarListItemProps) => {
  const handleClick = () => {
    if (!inStudyBuilder) {
      onClick()
    }
  }
  return (
    <StyledListItem $isActive={isActive} $isOpen={isOpen} $inStudyBuilder={inStudyBuilder} $isDark={variant === 'dark'}>
      <StyledLinkButton onClick={handleClick}>{children}</StyledLinkButton>
    </StyledListItem>
  )
}

export default SideBarListItem
